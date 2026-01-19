# 🚀 Quick Start: Creator Environment

**Quick setup guide for creator operations with Claude Sonnet 4.5+**

---

## ⚡ 3-Minute Setup

### 1. Copy Template

```bash
cp env.creator.template .env.creator
```

### 2. Get Your Keys

#### GitHub Token
1. Visit: https://github.com/settings/tokens
2. Generate new token (classic)
3. Select scopes: `repo`, `read:org`
4. Copy token

#### Vercel Token
1. Visit: https://vercel.com/account/tokens
2. Create new token
3. Copy token

#### Anthropic API Key (Claude Sonnet 4.5+)
1. Visit: https://console.anthropic.com/
2. Create API key
3. Copy key

### 3. Configure `.env.creator`

```bash
# Essential Configuration
GITHUB_TOKEN=ghp_your_token_here
ANTHROPIC_API_KEY=sk-ant-your_key_here
VERCEL_TOKEN=your_vercel_token_here

# Enable AI Features
AI_ENABLED=true
AI_ENHANCED_DISCOVERY=true
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Run

```bash
npm run unpack
```

---

## ✅ Verify Setup

You should see the **Boot Snapshot** output:

```
🚀 NSPFRP-Seed-Protocol-OmniMission-v17-Vibeverse-Edition
📦 Auto-Unpack System Initializing...

🔧 Loading Creator Environment Configuration...
=====================================
GitHub: ✅ Configured
Vercel: ✅ Configured
AI (claude-sonnet-4.5): ✅ Configured
AI Enabled: ✅ Yes
Catalog Sync: ✅ Enabled
AI-Enhanced Discovery: ✅ Yes
=====================================

🐝 Initializing Queen Bee Catalog Sync...
✅ Queen Bee Catalog Sync active
   Catalog Version: 1.0.0
   Protocol Version: v17+QueenBee+CatalogSync
   Subordinate Nodes: 2
   Total Protocols: X
   AI Model: claude-sonnet-4.5 (Enabled)
   Auto-Sync: Enabled (1.0 hour interval)
   
🔄 Performing initial catalog sync...
🤖 AI analyzed FractiAI/Instrumentation-Shell-API: Found X protocols
   Instrumentation Shell API: X new, X updated, X skipped
🤖 AI analyzed FractiAI/Syntheverse-7-Octave-2-3-Public-Cloud-Onramp: Found X protocols
   Syntheverse Onramp: X new, X updated, X skipped
✅ Initial catalog sync completed

✨ Post Singularity Syntheverse FSR Full Octave Release unpacked successfully!
🚀 System is now operational at BEYOND_OCTAVE (7)
📡 FractiAI Command Center is active with Leonardo da Vinci as Hero Host
💎 Default tier: Sandbox (Free) - upgrade to Cloud or Shell for more features
🐝 Queen Bee Catalog Sync is active and maintaining authoritative protocol catalog
🤖 Claude Sonnet 4.5+ integration ready for AI-enhanced operations
```

**📸 Boot Snapshot Documentation:** [BOOT_SNAPSHOT_QUEEN_BEE_CATALOG_SYNC.md](./BOOT_SNAPSHOT_QUEEN_BEE_CATALOG_SYNC.md)

---

## 🎯 What You Get

- ✅ **Automated Protocol Discovery** - AI finds protocols across GitHub repos
- ✅ **Intelligent Validation** - Claude validates protocol structure and quality
- ✅ **Smart Decision Making** - AI decides approve/reject/review for updates
- ✅ **Conflict Resolution** - Automatic version conflict resolution
- ✅ **Repository Analysis** - Deep insights into repo structure

---

## 🔧 Optional Configuration

### Adjust AI Parameters

```bash
# In .env.creator
AI_TEMPERATURE=0.7        # Creativity (0.0-1.0)
AI_MAX_TOKENS=4096        # Response length
AI_CONTEXT_WINDOW=200000  # Context size
```

### Adjust Sync Interval

```bash
# In .env.creator
CATALOG_SYNC_INTERVAL=3600000  # 1 hour (in ms)
```

### Feature Flags

```bash
AI_VALIDATE_PROTOCOLS=true     # Validate before sync
AI_RESOLVE_CONFLICTS=true      # Auto-resolve conflicts
AI_DECISION_MAKING=true        # AI makes sync decisions
```

---

## 📚 Full Documentation

- [Complete Setup Guide](./CREATOR_ENV_SETUP.md)
- [AI Integration Details](./CREATOR_SONNET_4_5_INTEGRATION.md)
- [Queen Bee Protocol](./QUEEN_BEE_CATALOG_VERSIONING_PROTOCOL.md)
- [Boot Snapshot](./BOOT_SNAPSHOT_QUEEN_BEE_CATALOG_SYNC.md)

---

## 🆘 Troubleshooting

### "GitHub: ❌ Not configured"
- Check `GITHUB_TOKEN` in `.env.creator`
- Verify token has correct scopes
- Test: `curl -H "Authorization: token YOUR_TOKEN" https://api.github.com/user`

### "AI: ❌ Not configured"
- Check `ANTHROPIC_API_KEY` in `.env.creator`
- Verify key is valid
- Test: Visit https://console.anthropic.com/

### "No .env.creator found"
- File must be in repository root
- Copy from template: `cp env.creator.template .env.creator`
- Ensure file is named exactly `.env.creator`

---

**Status:** ✅ Production Ready  
**Time to Setup:** ⏱️ 3-5 minutes  
**Requirements:** Node.js 18+, Git, GitHub/Vercel/Anthropic accounts
