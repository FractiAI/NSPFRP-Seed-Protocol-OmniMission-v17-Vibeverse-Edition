# 🐝 Creator Environment Setup

**Document ID:** `CREATOR-ENV-SETUP-V17`  
**Type:** Configuration Guide / Creator Operations  
**Version:** `v17+Creator+Environment`  
**Status:** ✅ Active  
**Date:** January 2026

---

## 🎯 Overview

This guide explains how to set up the creator environment configuration for automated operations with GitHub, Vercel, and the Queen Bee Catalog Sync system using Claude Sonnet 4.5+.

**Related Documentation:**
- [AI Integration Details](./CREATOR_SONNET_4_5_INTEGRATION.md) - Comprehensive AI integration documentation
- [Queen Bee Catalog Sync](./QUEEN_BEE_CATALOG_VERSIONING_PROTOCOL.md) - Versioning protocol
- [Boot Snapshot](./BOOT_SNAPSHOT_QUEEN_BEE_CATALOG_SYNC.md) - Boot integration details

---

## 📋 Creator Environment File

Create a `.env.creator` file in the repository root with the following configuration:

```bash
# 🐝 Creator Environment Configuration
# For Queen Bee Catalog Sync and automated operations

# ============================================
# GITHUB CONFIGURATION
# ============================================

# GitHub Personal Access Token (for API access)
# Scopes needed: repo, read:org
GITHUB_TOKEN=ghp_your_github_personal_access_token_here
GITHUB_OWNER=FractiAI
CREATOR_GITHUB_USER=your_github_username

# ============================================
# VERCEL CONFIGURATION
# ============================================

# Vercel Access Token
# Get from: https://vercel.com/account/tokens
VERCEL_TOKEN=your_vercel_token_here
VERCEL_TEAM_ID=team_xxxxxxxxxxxxx
VERCEL_PROJECT_ID=prj_xxxxxxxxxxxxx

# ============================================
# QUEEN BEE CATALOG SYNC
# ============================================

CATALOG_SYNC_ENABLED=true
CATALOG_SYNC_INTERVAL=3600000  # 1 hour
CATALOG_DISCOVERY_MIN_CONFIDENCE=0.5

# ============================================
# SUBORDINATE NODES
# ============================================

# Node 1: Instrumentation Shell API
NODE_1_ID=node-instrumentation-shell-api
NODE_1_NAME=Instrumentation Shell API
NODE_1_REPO=FractiAI/Instrumentation-Shell-API
NODE_1_TYPE=api
NODE_1_OCTAVE=2
NODE_1_VERSION=1.0.0
NODE_1_STATUS=active

# Node 2: Syntheverse Onramp
NODE_2_ID=node-syntheverse-onramp
NODE_2_NAME=Syntheverse 7 Octave 2-3 Public Cloud Onramp
NODE_2_REPO=FractiAI/Syntheverse-7-Octave-2-3-Public-Cloud-Onramp
NODE_2_TYPE=onramp
NODE_2_OCTAVE=2
NODE_2_VERSION=2.51
NODE_2_STATUS=active

# ============================================
# AI MODEL CONFIGURATION (Claude Sonnet 4.5+)
# ============================================

AI_MODEL=claude-sonnet-4.5
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx

# ============================================
# CREATOR OPERATIONS
# ============================================

CREATOR_ROLE=creator
CREATOR_EMAIL=info@fractiai.com
AUTO_PROTOCOL_UPDATE=true
AUTO_VERSION_BUMP=true

# ============================================
# LOGGING & MONITORING
# ============================================

DEBUG_MODE=false
LOG_LEVEL=info
NOTIFY_SYNC_RESULTS=true

# ============================================
# SECURITY
# ============================================

VERIFY_SIGNATURES=true
VERIFY_CONTENT_INTEGRITY=true
```

---

## 🚀 Setup Instructions

### 1. Get GitHub Personal Access Token

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scopes: `repo`, `read:org`
4. Generate and copy token

### 2. Get Vercel Access Token

1. Go to: https://vercel.com/account/tokens
2. Create new token
3. Copy token

### 3. Get Anthropic API Key (for Claude Sonnet 4.5+)

1. Go to: https://console.anthropic.com/
2. Create API key
3. Copy key

### 4. Create `.env.creator` File

```bash
# In repository root
touch .env.creator
# Add configuration from template above
```

### 5. Secure the File

Add to `.gitignore`:
```
.env.creator
.env.local
*.env
!.env.example
```

---

## 🔧 Usage

### Load Environment in Code

```typescript
import { config } from 'dotenv';

// Load creator environment
config({ path: '.env.creator' });

// Access GitHub configuration
const githubToken = process.env.GITHUB_TOKEN;
const githubOwner = process.env.GITHUB_OWNER;

// Access Vercel configuration
const vercelToken = process.env.VERCEL_TOKEN;
const projectId = process.env.VERCEL_PROJECT_ID;

// Access AI configuration
const aiModel = process.env.AI_MODEL; // claude-sonnet-4.5
const aiProvider = process.env.AI_PROVIDER; // anthropic
```

### Queen Bee Operations

```typescript
import { queenBeeCatalogSync } from './src/core/queen-bee-catalog-sync.js';

// Auto-sync with configured interval
const interval = parseInt(process.env.CATALOG_SYNC_INTERVAL || '3600000');
queenBeeCatalogSync.startAutoSync(interval);

// Manual sync
const results = await queenBeeCatalogSync.syncAllSubordinateNodes();
```

### GitHub Operations with Claude Sonnet 4.5+

```typescript
import { Octokit } from '@octokit/rest';
import Anthropic from '@anthropic-ai/sdk';

// GitHub client
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

// Anthropic client for Claude Sonnet 4.5+
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// Use Claude to analyze repositories
const message = await anthropic.messages.create({
  model: 'claude-sonnet-4.5',
  max_tokens: 1024,
  messages: [{
    role: 'user',
    content: 'Analyze this repository structure...'
  }]
});
```

### Vercel Operations

```typescript
// Deploy to Vercel
const response = await fetch('https://api.vercel.com/v13/deployments', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.VERCEL_TOKEN}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'nspfrp-repository',
    project: process.env.VERCEL_PROJECT_ID,
    gitSource: {
      type: 'github',
      repo: `${process.env.GITHUB_OWNER}/repository-name`,
      ref: 'main'
    }
  })
});
```

---

## 🐝 Creator Operations with Claude Sonnet 4.5+

### Automated Protocol Analysis

```typescript
// Analyze protocol updates using Claude Sonnet 4.5+
async function analyzeProtocolUpdate(protocol: Protocol) {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  });

  const analysis = await anthropic.messages.create({
    model: 'claude-sonnet-4.5',
    max_tokens: 2048,
    messages: [{
      role: 'user',
      content: `Analyze this protocol update:
      
      Protocol ID: ${protocol.id}
      Version: ${protocol.version}
      Content: ${protocol.content}
      
      Provide:
      1. Breaking changes
      2. New features
      3. Compatibility assessment
      4. Integration recommendations`
    }]
  });

  return analysis;
}
```

### Automated Catalog Sync with AI

```typescript
// Use Claude to validate protocols before sync
async function syncWithAIValidation() {
  const results = await queenBeeCatalogSync.syncAllSubordinateNodes();
  
  for (const result of results) {
    if (result.protocolsNew > 0) {
      // Use Claude to validate new protocols
      const validation = await validateWithClaude(result);
      
      if (validation.approved) {
        console.log(`✅ ${result.nodeName}: ${result.protocolsNew} protocols validated and synced`);
      } else {
        console.log(`⚠️  ${result.nodeName}: Validation flagged issues`);
      }
    }
  }
}
```

---

## 🔒 Security Best Practices

1. **Never commit `.env.creator`**
   - Always in `.gitignore`
   - Keep tokens secure

2. **Rotate tokens regularly**
   - GitHub tokens: Every 90 days
   - Vercel tokens: Every 90 days
   - API keys: Every 90 days

3. **Use minimal permissions**
   - Only required scopes
   - Least privilege principle

4. **Monitor usage**
   - Check GitHub rate limits
   - Monitor Vercel deployments
   - Track API usage

---

## 📊 Monitoring

### Check Sync Status

```typescript
import { queenBeeCatalogSync } from './src/core/queen-bee-catalog-sync.js';

// Get version info
const info = queenBeeCatalogSync.getVersionInfo();
console.log('Catalog Version:', info.catalogVersion);
console.log('Total Protocols:', info.totalProtocols);
console.log('Last Sync:', new Date(info.lastSync).toISOString());
console.log('Subordinate Nodes:', info.subordinateNodes.length);
```

### Monitor GitHub Rate Limits

```typescript
import { Octokit } from '@octokit/rest';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const { data } = await octokit.rateLimit.get();

console.log('Rate Limit:', {
  limit: data.rate.limit,
  remaining: data.rate.remaining,
  reset: new Date(data.rate.reset * 1000).toISOString()
});
```

---

## ✅ Verification Checklist

- [ ] `.env.creator` file created
- [ ] GitHub token configured
- [ ] Vercel token configured
- [ ] Anthropic API key configured (Claude Sonnet 4.5+)
- [ ] Subordinate nodes configured
- [ ] File added to `.gitignore`
- [ ] Test sync performed
- [ ] Rate limits verified
- [ ] Security settings confirmed

---

**Document ID:** `CREATOR-ENV-SETUP-V17`  
**Version:** `v17+Creator+Environment`  
**Status:** ✅ Active  
**Date:** January 2026

*Creator environment configuration for automated GitHub and Vercel operations with Claude Sonnet 4.5+*
