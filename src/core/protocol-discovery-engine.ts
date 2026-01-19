/**
 * Protocol Discovery Engine
 * Discovers protocols from multiple sources autonomously
 * 
 * Part of Queen Bee Catalog Sync System
 */

import { Protocol, DiscoverySource, ProtocolDiscovery, ProtocolCandidate, DiscoveryMetadata } from '../types/index.js';
import { aiEnhancedOperations } from './ai-enhanced-operations.js';

export interface DiscoveryOptions {
  minConfidence?: number;
  types?: Array<'seed' | 'protocol' | 'ssp' | 'integration'>;
}

export interface DiscoveryPattern {
  type: 'file-pattern' | 'code-pattern' | 'doc-pattern' | 'naming-convention';
  pattern: RegExp | string;
  confidence: number;
  extractor: (match: string, context: any) => Promise<ProtocolCandidate | null>;
}

export class ProtocolDiscoveryEngine {
  private patterns: DiscoveryPattern[];

  constructor() {
    this.initializePatterns();
  }

  /**
   * Initialize discovery patterns
   */
  private initializePatterns(): void {
    this.patterns = [
      {
        type: 'file-pattern',
        pattern: /PROTOCOL.*\.md$/i,
        confidence: 0.8,
        extractor: this.extractFromProtocolFile.bind(this)
      },
      {
        type: 'file-pattern',
        pattern: /.*PROTOCOL.*V\d+.*\.md$/i,
        confidence: 0.85,
        extractor: this.extractFromVersionedProtocol.bind(this)
      },
      {
        type: 'doc-pattern',
        pattern: /Protocol ID:\s*([A-Z0-9-]+)/i,
        confidence: 0.9,
        extractor: this.extractFromDocHeader.bind(this)
      }
    ];
  }

  /**
   * Discover protocols from a source
   */
  async discoverProtocols(
    source: DiscoverySource,
    options: DiscoveryOptions = {}
  ): Promise<ProtocolDiscovery[]> {
    const discoveries: ProtocolDiscovery[] = [];

    switch (source.type) {
      case 'repository':
        discoveries.push(...await this.discoverFromRepository(source, options));
        break;
      case 'codebase':
        discoveries.push(...await this.discoverFromCodebase(source, options));
        break;
      case 'documentation':
        discoveries.push(...await this.discoverFromDocumentation(source, options));
        break;
      case 'catalog':
        discoveries.push(...await this.discoverFromCatalog(source, options));
        break;
    }

    // Filter by confidence and options
    return discoveries.filter(d => 
      d.confidence >= (options.minConfidence || 0.5) &&
      (!options.types || options.types.includes(d.candidate.type))
    );
  }

  /**
   * Discover protocols from GitHub repository
   */
  private async discoverFromRepository(
    source: DiscoverySource,
    options: DiscoveryOptions
  ): Promise<ProtocolDiscovery[]> {
    const discoveries: ProtocolDiscovery[] = [];

    try {
      // Parse repository path (e.g., "FractiAI/repo-name")
      const [owner, repo] = source.path.split('/');

      // Fetch repository structure via GitHub API
      const structure = await this.fetchRepositoryStructure(owner, repo);

      // AI-enhanced repository analysis (if enabled)
      let protocolFiles: any[];
      if (aiEnhancedOperations.isEnabled() && process.env.AI_ENHANCED_DISCOVERY === 'true') {
        const aiAnalysis = await aiEnhancedOperations.analyzeRepositoryStructure(owner, repo, structure);
        console.log(`🤖 AI analyzed ${owner}/${repo}: Found ${aiAnalysis.protocolFiles.length} potential protocols (confidence: ${aiAnalysis.confidence})`);
        
        // Combine AI findings with pattern matching
        const patternFiles = await this.findProtocolFiles(structure);
        const patternPaths = new Set(patternFiles.map(f => f.path));
        
        // Merge AI suggestions with pattern matches
        protocolFiles = patternFiles;
        for (const aiPath of aiAnalysis.protocolFiles) {
          if (!patternPaths.has(aiPath)) {
            const file = structure.find(f => f.path === aiPath);
            if (file) {
              protocolFiles.push(file);
            }
          }
        }
      } else {
        // Standard pattern matching
        protocolFiles = await this.findProtocolFiles(structure);
      }

      for (const file of protocolFiles) {
        try {
          const content = await this.fetchFileContent(owner, repo, file.path);
          const candidate = await this.extractProtocolCandidate(file, content);

          if (candidate) {
            discoveries.push({
              id: this.generateId(),
              source: {
                ...source,
                metadata: { ...source.metadata, file: file.path }
              },
              candidate,
              confidence: this.calculateConfidence(candidate, file),
              metadata: {
                repository: source.path,
                file: file.path,
                size: content.length
              },
              timestamp: Date.now()
            });
          }
        } catch (error) {
          console.error(`Error processing file ${file.path}:`, error);
        }
      }
    } catch (error) {
      console.error(`Error discovering from repository ${source.path}:`, error);
    }

    return discoveries;
  }

  /**
   * Fetch repository structure from GitHub API
   */
  private async fetchRepositoryStructure(owner: string, repo: string): Promise<any[]> {
    // Use GitHub API to fetch repository contents
    const token = process.env.GITHUB_TOKEN;
    const url = `https://api.github.com/repos/${owner}/${repo}/contents`;

    try {
      const response = await fetch(url, {
        headers: token ? { Authorization: `token ${token}` } : {}
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching repository structure:`, error);
      return [];
    }
  }

  /**
   * Find protocol files in repository structure
   */
  private async findProtocolFiles(structure: any[]): Promise<any[]> {
    const protocolFiles: any[] = [];

    const findFiles = (items: any[]) => {
      for (const item of items) {
        if (item.type === 'file') {
          // Check if file matches protocol patterns
          for (const pattern of this.patterns) {
            if (pattern.type === 'file-pattern') {
              const regex = typeof pattern.pattern === 'string' 
                ? new RegExp(pattern.pattern) 
                : pattern.pattern;
              
              if (regex.test(item.name)) {
                protocolFiles.push(item);
                break;
              }
            }
          }
        } else if (item.type === 'dir') {
          // Recursively search directories (would need to fetch subdirectory)
          // For now, skip nested directories
        }
      }
    };

    findFiles(structure);
    return protocolFiles;
  }

  /**
   * Fetch file content from GitHub
   */
  private async fetchFileContent(owner: string, repo: string, path: string): Promise<string> {
    const token = process.env.GITHUB_TOKEN;
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

    try {
      const response = await fetch(url, {
        headers: token ? { Authorization: `token ${token}` } : {}
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Decode base64 content
      if (data.encoding === 'base64') {
        return Buffer.from(data.content, 'base64').toString('utf-8');
      }

      return data.content || '';
    } catch (error) {
      console.error(`Error fetching file content:`, error);
      return '';
    }
  }

  /**
   * Extract protocol candidate from file
   */
  private async extractProtocolCandidate(file: any, content: string): Promise<ProtocolCandidate | null> {
    // Try to extract protocol information from markdown content
    const protocolIdMatch = content.match(/Protocol ID:\s*([A-Z0-9-]+)/i);
    const versionMatch = content.match(/Version:\s*([^\n]+)/i);
    const typeMatch = content.match(/Type:\s*([^\n]+)/i);

    if (!protocolIdMatch) {
      return null;
    }

    const protocolId = protocolIdMatch[1];
    const version = versionMatch ? versionMatch[1].trim() : '1.0.0';
    const type = this.determineProtocolType(typeMatch ? typeMatch[1] : '', content);

    return {
      id: protocolId,
      name: this.extractProtocolName(content, file.name),
      version,
      content,
      type,
      indicators: [{
        type: 'file-pattern',
        pattern: file.name,
        match: file.name,
        confidence: 0.8
      }]
    };
  }

  /**
   * Determine protocol type
   */
  private determineProtocolType(typeString: string, content: string): 'seed' | 'protocol' | 'ssp' | 'integration' {
    const lower = typeString.toLowerCase();
    const contentLower = content.toLowerCase();

    if (lower.includes('seed') || contentLower.includes('seed protocol')) {
      return 'seed';
    }
    if (lower.includes('ssp') || contentLower.includes('seed synthesizer')) {
      return 'ssp';
    }
    if (lower.includes('integration') {
      return 'integration';
    }

    return 'protocol';
  }

  /**
   * Extract protocol name
   */
  private extractProtocolName(content: string, fileName: string): string {
    // Try to find title in markdown
    const titleMatch = content.match(/^#\s+(.+)$/m);
    if (titleMatch) {
      return titleMatch[1].trim();
    }

    // Fall back to filename
    return fileName.replace(/\.md$/, '').replace(/_/g, ' ');
  }

  /**
   * Calculate discovery confidence
   */
  private calculateConfidence(candidate: ProtocolCandidate, context: any): number {
    let confidence = 0.5;

    // Indicator-based confidence
    if (candidate.indicators.length > 0) {
      const indicatorConfidence = candidate.indicators.reduce(
        (sum, indicator) => sum + indicator.confidence,
        0
      ) / candidate.indicators.length;
      confidence = (confidence + indicatorConfidence) / 2;
    }

    // Context-based adjustments
    if (context.size && context.size > 1000) confidence += 0.1;
    if (candidate.version) confidence += 0.1;
    if (candidate.name && candidate.name.length > 0) confidence += 0.1;

    return Math.min(confidence, 1.0);
  }

  /**
   * Discover from codebase (placeholder)
   */
  private async discoverFromCodebase(
    source: DiscoverySource,
    options: DiscoveryOptions
  ): Promise<ProtocolDiscovery[]> {
    // Implementation for codebase discovery
    return [];
  }

  /**
   * Discover from documentation (placeholder)
   */
  private async discoverFromDocumentation(
    source: DiscoverySource,
    options: DiscoveryOptions
  ): Promise<ProtocolDiscovery[]> {
    // Implementation for documentation discovery
    return [];
  }

  /**
   * Discover from catalog (placeholder)
   */
  private async discoverFromCatalog(
    source: DiscoverySource,
    options: DiscoveryOptions
  ): Promise<ProtocolDiscovery[]> {
    // Implementation for catalog discovery
    return [];
  }

  /**
   * Extract from protocol file
   */
  private async extractFromProtocolFile(match: string, context: any): Promise<ProtocolCandidate | null> {
    // Implementation
    return null;
  }

  /**
   * Extract from versioned protocol
   */
  private async extractFromVersionedProtocol(match: string, context: any): Promise<ProtocolCandidate | null> {
    // Implementation
    return null;
  }

  /**
   * Extract from doc header
   */
  private async extractFromDocHeader(match: string, context: any): Promise<ProtocolCandidate | null> {
    // Implementation
    return null;
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `discovery-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
