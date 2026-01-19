/**
 * Queen Bee Creator Catalog Sync System
 * Acts as the authoritative creator catalog that checks and integrates updates from subordinate nodes
 * 
 * Protocol ID: P-QUEEN-BEE-CATALOG-SYNC-V17
 * Type: Catalog Synchronization / Creator Authority
 * Version: v17+QueenBee+CatalogSync
 * Status: Active
 */

import { Protocol, ProtocolCatalog, CatalogEntry, DiscoverySource, ProtocolDiscovery, ProtocolCandidate } from '../types/index.js';
import { ProtocolDiscoveryEngine } from './protocol-discovery-engine.js';
import { aiEnhancedOperations } from './ai-enhanced-operations.js';
import { subordinateCatalogOrganizer } from './subordinate-catalog-organizer.js';

export interface SubordinateNode {
  id: string;
  name: string;
  repository: string;
  type: 'api' | 'onramp' | 'shell' | 'other';
  octave: number;
  lastChecked: number;
  lastUpdated: number;
  version: string;
  catalogUrl?: string;
  apiEndpoint?: string;
  status: 'active' | 'inactive' | 'error';
  metadata?: Record<string, any>;
}

export interface CatalogSyncResult {
  timestamp: number;
  nodeId: string;
  nodeName: string;
  protocolsFound: number;
  protocolsNew: number;
  protocolsUpdated: number;
  protocolsSkipped: number;
  errors: string[];
  version: string;
}

export interface VersionInfo {
  catalogVersion: string;
  protocolVersion: string;
  lastSync: number;
  subordinateNodes: SubordinateNode[];
  totalProtocols: number;
  totalUpdates: number;
}

export class QueenBeeCatalogSync {
  private catalog: ProtocolCatalog;
  private discoveryEngine: ProtocolDiscoveryEngine;
  private subordinateNodes: Map<string, SubordinateNode>;
  private syncInterval: number = 3600000; // 1 hour default
  private syncTimer?: NodeJS.Timeout;
  private version: string = '1.0.0';

  constructor() {
    this.catalog = this.initializeCatalog();
    this.discoveryEngine = new ProtocolDiscoveryEngine();
    this.subordinateNodes = new Map();
    this.initializeSubordinateNodes();
  }

  /**
   * Initialize the creator catalog
   */
  private initializeCatalog(): ProtocolCatalog {
    return {
      id: 'CATALOG-QUEEN-BEE-CREATOR-V17',
      name: 'Queen Bee Creator Catalog',
      protocols: new Map(),
      pobs: new Map(),
      metadata: {
        name: 'Queen Bee Creator Catalog',
        description: 'Authoritative creator catalog for all NSPFRP protocols across subordinate nodes',
        version: this.version,
        createdAt: Date.now(),
        updatedAt: Date.now()
      },
      lastSync: Date.now()
    };
  }

  /**
   * Initialize subordinate nodes
   */
  private initializeSubordinateNodes(): void {
    const nodes: SubordinateNode[] = [
      {
        id: 'node-instrumentation-shell-api',
        name: 'Instrumentation Shell API',
        repository: 'FractiAI/Instrumentation-Shell-API',
        type: 'api',
        octave: 2,
        lastChecked: 0,
        lastUpdated: 0,
        version: '1.0.0',
        catalogUrl: 'https://github.com/FractiAI/Instrumentation-Shell-API',
        apiEndpoint: 'https://instrumentation-shell-api.vercel.app',
        status: 'active',
        metadata: {
          description: 'Instrument-grade measurement and verification API - NSPFRP Compliant',
          purpose: 'Instrument-grade measurement capabilities, state verification, atomic scoring'
        }
      },
      {
        id: 'node-syntheverse-onramp',
        name: 'Syntheverse 7 Octave 2-3 Public Cloud Onramp',
        repository: 'FractiAI/Syntheverse-7-Octave-2-3-Public-Cloud-Onramp',
        type: 'onramp',
        octave: 2,
        lastChecked: 0,
        lastUpdated: 0,
        version: '2.51',
        catalogUrl: 'https://github.com/FractiAI/Syntheverse-7-Octave-2-3-Public-Cloud-Onramp',
        status: 'active',
        metadata: {
          description: 'Public cloud infrastructure and network operations onramp',
          purpose: 'Public cloud infrastructure, network operations, PoC submissions'
        }
      }
    ];

    nodes.forEach(node => {
      this.subordinateNodes.set(node.id, node);
    });
  }

  /**
   * Register a subordinate node
   */
  registerSubordinateNode(node: SubordinateNode): void {
    this.subordinateNodes.set(node.id, node);
    this.updateCatalogMetadata();
  }

  /**
   * Check a single subordinate node for updates
   */
  async checkSubordinateNode(nodeId: string): Promise<CatalogSyncResult> {
    const node = this.subordinateNodes.get(nodeId);
    if (!node) {
      throw new Error(`Subordinate node ${nodeId} not found`);
    }

    const result: CatalogSyncResult = {
      timestamp: Date.now(),
      nodeId: node.id,
      nodeName: node.name,
      protocolsFound: 0,
      protocolsNew: 0,
      protocolsUpdated: 0,
      protocolsSkipped: 0,
      errors: [],
      version: node.version
    };

    try {
      // Update last checked time
      node.lastChecked = Date.now();
      node.status = 'active';

      // Discover protocols from repository
      const source: DiscoverySource = {
        type: 'repository',
        path: node.repository,
        metadata: {
          nodeId: node.id,
          nodeType: node.type,
          octave: node.octave
        }
      };

      const discoveries = await this.discoveryEngine.discoverProtocols(source, {
        minConfidence: 0.5
      });

      result.protocolsFound = discoveries.length;

      // Process each discovered protocol
      for (const discovery of discoveries) {
        try {
          const protocol = discovery.candidate as Protocol;
          const existing = this.catalog.protocols.get(protocol.id);

          // AI-enhanced validation for new protocols
          if (!existing && aiEnhancedOperations.isEnabled()) {
            const validation = await aiEnhancedOperations.validateProtocol(discovery.candidate);
            if (!validation.valid) {
              result.errors.push(`AI validation failed for ${protocol.id}: ${validation.reasoning}`);
              continue;
            }
          }

          if (existing) {
            // Check if update is needed
            if (this.isNewerVersion(protocol.version, existing.protocol.version)) {
              // AI-enhanced analysis for updates
              if (aiEnhancedOperations.isEnabled()) {
                const analysis = await aiEnhancedOperations.analyzeProtocolUpdate(protocol, existing.protocol);
                const decision = await aiEnhancedOperations.decideSyncAction(protocol, { node, existing, analysis });
                
                if (decision.decision === 'reject') {
                  result.errors.push(`AI rejected update for ${protocol.id}: ${decision.reasoning}`);
                  continue;
                } else if (decision.decision === 'review') {
                  console.log(`⚠️  Protocol ${protocol.id} requires manual review: ${decision.reasoning}`);
                }
              }
              
              // Update existing protocol
              await this.updateProtocol(protocol, source, node);
              result.protocolsUpdated++;
            } else {
              result.protocolsSkipped++;
            }
          } else {
            // Register new protocol
            await this.registerProtocol(protocol, source, node);
            result.protocolsNew++;
          }
        } catch (error) {
          result.errors.push(`Error processing protocol ${discovery.candidate.id}: ${error.message}`);
        }
      }

      // Update node version if changed
      if (discoveries.length > 0) {
        node.lastUpdated = Date.now();
      }

    } catch (error) {
      node.status = 'error';
      result.errors.push(`Error checking node: ${error.message}`);
    }

    return result;
  }

  /**
   * Sync all subordinate nodes
   */
  async syncAllSubordinateNodes(): Promise<CatalogSyncResult[]> {
    const results: CatalogSyncResult[] = [];

    for (const [nodeId, node] of this.subordinateNodes) {
      if (node.status === 'active') {
        try {
          const result = await this.checkSubordinateNode(nodeId);
          results.push(result);
        } catch (error) {
          results.push({
            timestamp: Date.now(),
            nodeId: node.id,
            nodeName: node.name,
            protocolsFound: 0,
            protocolsNew: 0,
            protocolsUpdated: 0,
            protocolsSkipped: 0,
            errors: [error.message],
            version: node.version
          });
        }
      }
    }

    // Update catalog metadata after sync
    await this.updateCatalogMetadata();

    // Write separated catalogs for each subordinate node
    console.log('\n📝 Writing subordinate catalogs...');
    subordinateCatalogOrganizer.writeAllSubordinateCatalogs();
    subordinateCatalogOrganizer.writeAllMarkdownCatalogs();
    
    const stats = subordinateCatalogOrganizer.getStatistics();
    console.log(`✅ Organized ${stats.totalProtocols} protocols from ${stats.totalNodes} subordinate nodes`);
    
    // Reset counters after writing
    subordinateCatalogOrganizer.resetCounters();

    return results;
  }

  /**
   * Register a protocol in the catalog
   */
  private async registerProtocol(
    protocol: Protocol,
    source: DiscoverySource,
    node: SubordinateNode
  ): Promise<CatalogEntry> {
    const entry: CatalogEntry = {
      id: protocol.id,
      protocol,
      metadata: protocol.metadata,
      versions: {
        current: protocol.version,
        history: [{
          version: protocol.version,
          timestamp: Date.now(),
          source
        }]
      },
      pobs: [],
      sources: [source],
      lastUpdated: Date.now(),
      syncStatus: {
        status: 'synced',
        lastSync: Date.now(),
        syncSource: node.repository
      }
    };

    this.catalog.protocols.set(protocol.id, entry);
    
    // Add to subordinate catalog organizer (separated by node)
    subordinateCatalogOrganizer.addProtocol(protocol, entry, node, true);
    
    return entry;
  }

  /**
   * Update an existing protocol
   */
  private async updateProtocol(
    protocol: Protocol,
    source: DiscoverySource,
    node: SubordinateNode
  ): Promise<CatalogEntry> {
    const existing = this.catalog.protocols.get(protocol.id);
    if (!existing) {
      return await this.registerProtocol(protocol, source, node);
    }

    // Add to version history
    existing.versions.history.push({
      version: protocol.version,
      timestamp: Date.now(),
      source
    });

    // Update protocol
    existing.protocol = protocol;
    existing.versions.current = protocol.version;
    existing.lastUpdated = Date.now();
    existing.syncStatus = {
      status: 'synced',
      lastSync: Date.now(),
      syncSource: node.repository
    };

    // Add source if not already present
    const sourceExists = existing.sources.some(s => s.path === source.path);
    if (!sourceExists) {
      existing.sources.push(source);
    }

    // Update in subordinate catalog organizer
    subordinateCatalogOrganizer.updateProtocol(protocol, existing, node);

    return existing;
  }

  /**
   * Check if version is newer
   */
  private isNewerVersion(newVersion: string, currentVersion: string): boolean {
    // Simple semantic version comparison
    const newParts = newVersion.split('.').map(Number);
    const currentParts = currentVersion.split('.').map(Number);

    for (let i = 0; i < Math.max(newParts.length, currentParts.length); i++) {
      const newPart = newParts[i] || 0;
      const currentPart = currentParts[i] || 0;

      if (newPart > currentPart) return true;
      if (newPart < currentPart) return false;
    }

    return false;
  }

  /**
   * Update catalog metadata
   */
  private async updateCatalogMetadata(): Promise<void> {
    this.catalog.metadata.updatedAt = Date.now();
    this.catalog.metadata.version = this.version;
    this.catalog.lastSync = Date.now();
  }

  /**
   * Get version information
   */
  getVersionInfo(): VersionInfo {
    const nodes = Array.from(this.subordinateNodes.values());
    const totalProtocols = this.catalog.protocols.size;
    const totalUpdates = nodes.reduce((sum, node) => sum + (node.lastUpdated > 0 ? 1 : 0), 0);

    return {
      catalogVersion: this.version,
      protocolVersion: 'v17+QueenBee+CatalogSync',
      lastSync: this.catalog.lastSync,
      subordinateNodes: nodes,
      totalProtocols,
      totalUpdates
    };
  }

  /**
   * Start automatic synchronization
   */
  startAutoSync(interval?: number): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
    }

    this.syncInterval = interval || this.syncInterval;

    this.syncTimer = setInterval(async () => {
      try {
        await this.syncAllSubordinateNodes();
      } catch (error) {
        console.error('Auto-sync error:', error);
      }
    }, this.syncInterval);
  }

  /**
   * Stop automatic synchronization
   */
  stopAutoSync(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = undefined;
    }
  }

  /**
   * Get catalog
   */
  getCatalog(): ProtocolCatalog {
    return this.catalog;
  }

  /**
   * Get subordinate nodes
   */
  getSubordinateNodes(): SubordinateNode[] {
    return Array.from(this.subordinateNodes.values());
  }
}

// Export singleton instance
export const queenBeeCatalogSync = new QueenBeeCatalogSync();
