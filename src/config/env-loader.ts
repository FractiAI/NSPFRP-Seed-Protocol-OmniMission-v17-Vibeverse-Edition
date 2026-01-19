/**
 * Environment Configuration Loader
 * Loads creator environment for GitHub, Vercel, and AI operations
 *
 * Protocol ID: P-ENV-CONFIG-V17
 * Type: Configuration / Environment Management
 * Version: v17+Env+Config
 * Status: Active
 */

import { config } from 'dotenv';
import { existsSync } from 'fs';
import { join } from 'path';

export interface EnvConfig {
  // GitHub
  github: {
    token?: string;
    owner: string;
    user: string;
  };
  
  // Vercel
  vercel: {
    token?: string;
    teamId?: string;
    projectId?: string;
  };
  
  // AI (Claude Sonnet 4.5+)
  ai: {
    model: string;
    provider: string;
    apiKey?: string;
    enabled: boolean;
    validateProtocols: boolean;
    resolveConflicts: boolean;
    analyzeCode: boolean;
    temperature: number;
    maxTokens: number;
    contextWindow: number;
  };
  
  // Catalog Sync
  catalogSync: {
    enabled: boolean;
    interval: number;
    minConfidence: number;
    aiEnhanced: boolean;
  };
  
  // Creator Operations
  creator: {
    role: string;
    email: string;
    autoUpdate: boolean;
    autoVersionBump: boolean;
    aiDecisionMaking: boolean;
  };
  
  // Logging
  logging: {
    debug: boolean;
    level: string;
    notifyResults: boolean;
    logAiInteractions: boolean;
  };
  
  // Security
  security: {
    verifySignatures: boolean;
    verifyIntegrity: boolean;
    verifyAiResponses: boolean;
  };
}

export class EnvLoader {
  private config: EnvConfig;
  private loaded: boolean = false;

  constructor() {
    this.config = this.getDefaultConfig();
  }

  /**
   * Load environment configuration
   */
  load(): EnvConfig {
    if (this.loaded) {
      return this.config;
    }

    // Try to load .env.creator
    const creatorEnvPath = join(process.cwd(), '.env.creator');
    if (existsSync(creatorEnvPath)) {
      config({ path: creatorEnvPath });
      console.log('✅ Loaded creator environment from .env.creator');
    } else {
      console.log('⚠️  No .env.creator found - using defaults (copy env.creator.template to .env.creator)');
    }

    // Parse environment variables
    this.config = {
      github: {
        token: process.env.GITHUB_TOKEN,
        owner: process.env.GITHUB_OWNER || 'FractiAI',
        user: process.env.CREATOR_GITHUB_USER || 'creator'
      },
      
      vercel: {
        token: process.env.VERCEL_TOKEN,
        teamId: process.env.VERCEL_TEAM_ID,
        projectId: process.env.VERCEL_PROJECT_ID
      },
      
      ai: {
        model: process.env.AI_MODEL || 'claude-sonnet-4.5',
        provider: process.env.AI_PROVIDER || 'anthropic',
        apiKey: process.env.ANTHROPIC_API_KEY,
        enabled: process.env.AI_ENABLED === 'true',
        validateProtocols: process.env.AI_VALIDATE_PROTOCOLS === 'true',
        resolveConflicts: process.env.AI_RESOLVE_CONFLICTS === 'true',
        analyzeCode: process.env.AI_ANALYZE_CODE === 'true',
        temperature: parseFloat(process.env.AI_TEMPERATURE || '0.7'),
        maxTokens: parseInt(process.env.AI_MAX_TOKENS || '4096'),
        contextWindow: parseInt(process.env.AI_CONTEXT_WINDOW || '200000')
      },
      
      catalogSync: {
        enabled: process.env.CATALOG_SYNC_ENABLED !== 'false',
        interval: parseInt(process.env.CATALOG_SYNC_INTERVAL || '3600000'),
        minConfidence: parseFloat(process.env.CATALOG_DISCOVERY_MIN_CONFIDENCE || '0.5'),
        aiEnhanced: process.env.AI_ENHANCED_DISCOVERY === 'true'
      },
      
      creator: {
        role: process.env.CREATOR_ROLE || 'creator',
        email: process.env.CREATOR_EMAIL || 'info@fractiai.com',
        autoUpdate: process.env.AUTO_PROTOCOL_UPDATE === 'true',
        autoVersionBump: process.env.AUTO_VERSION_BUMP === 'true',
        aiDecisionMaking: process.env.AI_DECISION_MAKING === 'true'
      },
      
      logging: {
        debug: process.env.DEBUG_MODE === 'true',
        level: process.env.LOG_LEVEL || 'info',
        notifyResults: process.env.NOTIFY_SYNC_RESULTS === 'true',
        logAiInteractions: process.env.LOG_AI_INTERACTIONS === 'true'
      },
      
      security: {
        verifySignatures: process.env.VERIFY_SIGNATURES === 'true',
        verifyIntegrity: process.env.VERIFY_CONTENT_INTEGRITY === 'true',
        verifyAiResponses: process.env.VERIFY_AI_RESPONSES === 'true'
      }
    };

    this.loaded = true;
    this.logConfiguration();
    
    return this.config;
  }

  /**
   * Get current configuration
   */
  getConfig(): EnvConfig {
    if (!this.loaded) {
      return this.load();
    }
    return this.config;
  }

  /**
   * Check if a feature is enabled
   */
  isFeatureEnabled(feature: keyof EnvConfig['ai']): boolean {
    return this.config.ai[feature] === true;
  }

  /**
   * Get default configuration
   */
  private getDefaultConfig(): EnvConfig {
    return {
      github: {
        owner: 'FractiAI',
        user: 'creator'
      },
      vercel: {},
      ai: {
        model: 'claude-sonnet-4.5',
        provider: 'anthropic',
        enabled: false,
        validateProtocols: false,
        resolveConflicts: false,
        analyzeCode: false,
        temperature: 0.7,
        maxTokens: 4096,
        contextWindow: 200000
      },
      catalogSync: {
        enabled: true,
        interval: 3600000,
        minConfidence: 0.5,
        aiEnhanced: false
      },
      creator: {
        role: 'creator',
        email: 'info@fractiai.com',
        autoUpdate: false,
        autoVersionBump: false,
        aiDecisionMaking: false
      },
      logging: {
        debug: false,
        level: 'info',
        notifyResults: false,
        logAiInteractions: false
      },
      security: {
        verifySignatures: false,
        verifyIntegrity: false,
        verifyAiResponses: false
      }
    };
  }

  /**
   * Log configuration status
   */
  private logConfiguration(): void {
    console.log('\n🐝 Creator Environment Configuration:');
    console.log('=====================================');
    console.log(`GitHub: ${this.config.github.token ? '✅ Configured' : '❌ Not configured'}`);
    console.log(`Vercel: ${this.config.vercel.token ? '✅ Configured' : '❌ Not configured'}`);
    console.log(`AI (${this.config.ai.model}): ${this.config.ai.apiKey ? '✅ Configured' : '❌ Not configured'}`);
    console.log(`AI Enabled: ${this.config.ai.enabled ? '✅ Yes' : '❌ No'}`);
    console.log(`Catalog Sync: ${this.config.catalogSync.enabled ? '✅ Enabled' : '❌ Disabled'}`);
    console.log(`AI-Enhanced Discovery: ${this.config.catalogSync.aiEnhanced ? '✅ Yes' : '❌ No'}`);
    console.log('=====================================\n');
  }
}

// Singleton instance
export const envLoader = new EnvLoader();

// Auto-load on import
envLoader.load();
