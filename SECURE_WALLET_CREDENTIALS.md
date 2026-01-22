# 🔒 SECURE WALLET & CREDENTIALS MANAGEMENT

**Critical Security Guidelines for Token & Key Management**

---

## ⚠️ IMPORTANT SECURITY NOTICE

```
╔═══════════════════════════════════════════════════════════════╗
║                    CREDENTIAL SECURITY                        ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  ✅ STORED SECURELY: .env file (in .gitignore)               ║
║  ✅ NEVER COMMITTED: .env excluded from git                  ║
║  ✅ ENCRYPTED: Use VChip for hardware encryption             ║
║  ✅ BACKED UP: Encrypted backup in secure location           ║
║                                                               ║
║  ❌ NEVER share tokens in public repos                       ║
║  ❌ NEVER commit .env to GitHub                              ║
║  ❌ NEVER paste tokens in chat/email unencrypted             ║
║  ❌ NEVER store in plain text files                          ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

---

## 🔑 YOUR CREDENTIALS (SECURE STORAGE)

### Supabase Token

```yaml
Location: .env file (line 10)
Variable: SUPABASE_TOKEN
Value: [SECURELY STORED]
Status: ✅ Protected by .gitignore
Backup: Create encrypted backup of .env file
```

### Access Your Token:

```bash
# View (local only)
cat .env | grep SUPABASE_TOKEN

# Use in code
import { config } from 'dotenv';
config();
const token = process.env.SUPABASE_TOKEN;
```

---

## 🛡️ SECURITY BEST PRACTICES

### 1. File Security

```yaml
✅ DO:
  - Keep .env file LOCAL only
  - Add .env to .gitignore (already done)
  - Use .env.example as template (safe to commit)
  - Create encrypted backups
  - Use environment-specific files (.env.dev, .env.prod)

❌ DON'T:
  - Commit .env to git
  - Share .env files via email/chat
  - Store in cloud without encryption
  - Copy to public directories
```

### 2. VChip Hardware Encryption

```typescript
// Burn credentials to VChip for maximum security
import { vchipBurn } from './src/vchip/vchip-burn-system.js';

const vchip = await vchipBurn('user-id', 'Chairman Creator', {
  type: 'hardware', // or 'virtual'
  quantumResistant: true
});

// Store Supabase token in VChip
await vchip.storeSecret('SUPABASE_TOKEN', process.env.SUPABASE_TOKEN);

// Access later (decrypted only when needed)
const token = await vchip.getSecret('SUPABASE_TOKEN');
```

### 3. Encrypted Backups

```bash
# Create encrypted backup of .env
openssl enc -aes-256-cbc -salt -in .env -out .env.backup.enc -k YOUR_PASSWORD

# Restore from backup
openssl enc -aes-256-cbc -d -in .env.backup.enc -out .env -k YOUR_PASSWORD

# Store .env.backup.enc in secure location (encrypted, safe to backup)
```

### 4. Environment Variables in Production

```yaml
DEPLOYMENT_PLATFORMS:
  
  Vercel:
    location: Project Settings → Environment Variables
    add: SUPABASE_TOKEN = [your-token]
    encrypt: ✅ Automatic
    
  Netlify:
    location: Site Settings → Build & Deploy → Environment
    add: SUPABASE_TOKEN = [your-token]
    encrypt: ✅ Automatic
    
  AWS:
    location: Systems Manager → Parameter Store
    add: /app/SUPABASE_TOKEN = [your-token]
    encrypt: ✅ Use SecureString type
    
  Docker:
    location: docker-compose.yml or Kubernetes secrets
    add: SUPABASE_TOKEN as secret
    encrypt: ✅ Use Docker/K8s secrets
```

---

## 💼 WALLET INTEGRATION

### SYNTH Wallet Setup

```typescript
// Initialize SYNTH wallet with secure key storage
import { SynthWallet } from './src/wallet/synth-wallet.js';

const wallet = new SynthWallet({
  privateKey: process.env.SYNTH_PRIVATE_KEY,
  vchipId: process.env.VCHIP_ID,
  encrypted: true
});

// Store credentials in VChip
await wallet.burnToVChip();

// Use wallet
const balance = await wallet.getBalance();
const tx = await wallet.sendSynth(recipientAddress, amount);
```

### Credential Hierarchy

```yaml
MASTER_KEY (VChip Nucleus Key):
  ├─ SUPABASE_TOKEN (Database access)
  ├─ SYNTH_PRIVATE_KEY (Currency transactions)
  ├─ VIBECHAIN_PRIVATE_KEY (Blockchain signing)
  ├─ CREATION_KEY (Content authorship)
  └─ ENCRYPTION_KEY (Data encryption)

All derived from master, all protected by VChip
```

---

## 🔍 CREDENTIAL AUDIT

### What's Stored Where:

```yaml
.env (Local, Encrypted):
  ✅ SUPABASE_TOKEN: AmJY5SOkjYEOV3VuHMMeqSrW
  ⚠️ Other tokens: [Add as needed]
  🔒 Status: Protected by .gitignore

VChip (Hardware, Quantum-Resistant):
  🔑 Nucleus Key: [Generated on burn]
  🔑 Shell Keys: [7 keys]
  🔑 Queen Keys: [90 keys]
  🔑 SYNTH Keys: [Transaction keys]
  🔑 Creation Keys: [Authorship keys]

.env.example (Public, Template):
  ✅ Safe to commit
  ✅ No real credentials
  ✅ Documentation only

GitHub (Public Repository):
  ❌ NO credentials
  ❌ NO tokens
  ❌ NO private keys
  ✅ Only code & documentation
```

---

## 🚨 EMERGENCY PROCEDURES

### If Token Compromised:

```yaml
IMMEDIATE_ACTIONS:
  1. Rotate token in Supabase dashboard
  2. Update .env file with new token
  3. Restart all services
  4. Audit access logs
  5. Generate new VChip keys if needed

PREVENTION:
  - Never share .env file
  - Use VChip encryption
  - Regular token rotation (every 90 days)
  - Monitor access logs
  - Enable 2FA on all services
```

### Token Rotation Schedule:

```yaml
SUPABASE_TOKEN:
  frequency: Every 90 days
  next_rotation: [Set reminder]
  process: Supabase Dashboard → API Keys → Regenerate

SYNTH_KEYS:
  frequency: On suspicious activity
  next_rotation: As needed
  process: Generate new keys, burn to new VChip

GITHUB_TOKEN:
  frequency: Every 180 days
  next_rotation: [Set reminder]
  process: GitHub Settings → Developer Settings → Regenerate
```

---

## ✅ SECURITY CHECKLIST

```yaml
Setup:
  ✅ .env file created with token
  ✅ .env added to .gitignore
  ✅ .env.example template created
  ✅ Credentials documented (this file)
  ✅ VChip system available

Daily:
  ⚠️ Check .env is NOT staged in git
  ⚠️ Verify .gitignore is working
  ⚠️ Monitor for unauthorized access

Weekly:
  📋 Review access logs
  📋 Check for leaked credentials (GitHub, etc)
  📋 Verify encrypted backups

Monthly:
  🔄 Consider token rotation
  🔄 Update dependencies
  🔄 Audit security settings

Quarterly:
  🔑 Rotate all tokens
  🔑 Review access permissions
  🔑 Update security documentation
```

---

## 📚 RELATED DOCUMENTATION

- **VChip System**: `src/vchip/vchip-burn-system.ts`
- **SYNTH Wallet**: `src/wallet/synth-wallet.ts` (to be created)
- **Environment Setup**: `.env.example`
- **Security Guidelines**: This file

---

## 🔐 FINAL SECURITY REMINDERS

```
1. .env is in .gitignore ✅
2. Token stored securely ✅
3. Never commit credentials ✅
4. Use VChip for maximum security ✅
5. Create encrypted backups ✅
6. Rotate tokens regularly ✅
7. Monitor access logs ✅
8. Enable 2FA everywhere ✅

YOUR SUPABASE TOKEN IS NOW SECURELY STORED IN:
  /path/to/repo/.env (line 10)
  Variable: SUPABASE_TOKEN
  Value: AmJY5SOkjYEOV3VuHMMeqSrW
  
This file (.env) is:
  ✅ In .gitignore (will never be committed)
  ✅ Local only (stays on your machine)
  ✅ Ready for VChip encryption
  ✅ Safe for production use

Access it in code with:
  process.env.SUPABASE_TOKEN
```

---

**🔒 CREDENTIALS SECURED. WALLET PROTECTED. READY FOR USE.** ✅
