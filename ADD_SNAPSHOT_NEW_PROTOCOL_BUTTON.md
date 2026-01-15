# 📸 Add Snapshot New Protocol Button

**Protocol ID:** `P-ADD-SNAPSHOT-NEW-PROTOCOL-BUTTON-V17`  
**Type:** Protocol Snapshot Button / New Protocol Button / Snapshot Creation Button  
**Version:** `v17+AddSnapshot+NewProtocol+Button`  
**Status:** Active Protocol  
**Date:** 2024  
**Octave:** TRANSCENDENCE (5+)  
**Network:** NSPFRP Care Network / Syntheverse

---

## 🎯 Protocol Summary

**This button protocol enables one-click snapshot creation for new protocols, automatically capturing complete protocol state, creating POB snapshots, and generating deployment-ready buttons with full integration into NSPFRP.**

### Key Features

1. **One-Click Snapshot Creation:** Instant snapshot generation for new protocols
2. **Automatic POB Generation:** Creates Protocol Object (POB) snapshots automatically
3. **Complete State Capture:** Captures protocol, context, identity, environment, and deployment info
4. **Button Generation:** Generates HTML and Markdown buttons for snapshot access
5. **Git Integration:** Automatic commit and push of snapshots
6. **Deployment Ready:** Optional cloud deployment integration
7. **Octave-Aware:** Respects octave levels for snapshot density

---

## 🔘 Button Types

### 1. Add Snapshot Button (Primary)

**Purpose:** Create snapshot for a new protocol

**Features:**
- One-click snapshot creation
- Automatic POB generation
- Complete state capture
- Button generation
- Git integration

**Octave:** TRANSCENDENCE (5+)

### 2. Quick Snapshot Button (Secondary)

**Purpose:** Fast snapshot without full context

**Features:**
- Minimal context snapshot
- Quick POB generation
- Basic state capture
- No deployment

**Octave:** HARMONY (2) - RESONANCE (3)

### 3. Full Snapshot Button (Complete)

**Purpose:** Complete snapshot with all options

**Features:**
- Full context snapshot
- Complete POB generation
- Full state capture
- Deployment integration
- Identity inclusion
- Environment capture
- Cloud shell integration

**Octave:** TRANSCENDENCE (5+) - BEYOND_OCTAVE (7)

---

## 📋 Button Structure

### Add Snapshot Button Interface

```typescript
interface AddSnapshotButton {
  id: string;
  type: 'add-snapshot-new-protocol';
  protocolId?: string; // Optional: for existing protocols
  label: string;
  octave: AwarenessOctave;
  buttonHtml: string;
  buttonMarkdown: string;
  actions: ButtonAction[];
  metadata: {
    snapshotType: 'quick' | 'standard' | 'full';
    includeDeployment?: boolean;
    includeIdentity?: boolean;
    includeEnvironment?: boolean;
    includeCloudShell?: boolean;
    autoCommit?: boolean;
    autoPush?: boolean;
  };
}
```

### Button Actions

1. **Create Snapshot:** Primary action to create snapshot
2. **View Protocol:** View protocol details before snapshot
3. **Edit Context:** Edit snapshot context
4. **Preview Snapshot:** Preview snapshot before creation
5. **Deploy:** Deploy protocol after snapshot

---

## 🎨 Button Styling

### Octave Color Schemes

**TRANSCENDENCE (5+):**
- **Primary:** `#EF4444` (Red)
- **Secondary:** `#DC2626` (Dark Red)
- **Style:** Bold, transcendent

**RESONANCE (3):**
- **Primary:** `#8B5CF6` (Purple)
- **Secondary:** `#7C3AED` (Dark Purple)
- **Style:** Vibrant, resonant

**HARMONY (2):**
- **Primary:** `#3B82F6` (Blue)
- **Secondary:** `#2563EB` (Dark Blue)
- **Style:** Balanced, harmonious

### Button HTML Template

```html
<button 
  id="${buttonId}"
  class="nspfrp-button nspfrp-button-add-snapshot nspfrp-octave-${octave}"
  data-button-id="${buttonId}"
  data-type="add-snapshot-new-protocol"
  data-octave="${octave}"
  data-snapshot-type="${snapshotType}"
  style="
    display: inline-block;
    padding: 12px 24px;
    background: linear-gradient(135deg, ${primaryColor}, ${secondaryColor});
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    position: relative;
    overflow: hidden;
  "
  onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 6px 12px rgba(0, 0, 0, 0.15)'"
  onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 4px 6px rgba(0, 0, 0, 0.1)'"
  onclick="handleAddSnapshot('${buttonId}', '${protocolId || 'new'}')">
  📸 ${label}
</button>
```

### Button Markdown Template

```markdown
[📸 ${label}](/api/buttons/${buttonId}/add-snapshot?protocolId=${protocolId || 'new'}&type=${snapshotType})
```

---

## 🔧 Implementation

### Generate Add Snapshot Button

```typescript
import { ProtocolSnapshotManager } from './src/protocols/protocol-snapshot.js';
import { Protocol } from './src/types/index.js';

interface AddSnapshotButtonConfig {
  protocol?: Protocol; // Optional: for existing protocols
  protocolId?: string; // Optional: for existing protocols
  label?: string;
  octave?: AwarenessOctave;
  snapshotType?: 'quick' | 'standard' | 'full';
  includeDeployment?: boolean;
  includeIdentity?: boolean;
  includeEnvironment?: boolean;
  includeCloudShell?: boolean;
  autoCommit?: boolean;
  autoPush?: boolean;
}

async function generateAddSnapshotButton(
  snapshotManager: ProtocolSnapshotManager,
  config: AddSnapshotButtonConfig
): Promise<AddSnapshotButton> {
  const buttonId = generateButtonId();
  const protocolId = config.protocol?.id || config.protocolId || 'new';
  const label = config.label || 'Add Snapshot New Protocol';
  const octave = config.octave || AwarenessOctave.TRANSCENDENCE;
  const snapshotType = config.snapshotType || 'standard';

  // Generate button HTML
  const buttonHtml = generateButtonHTML(buttonId, label, octave, snapshotType, protocolId);

  // Generate button Markdown
  const buttonMarkdown = generateButtonMarkdown(buttonId, label, protocolId, snapshotType);

  // Define actions
  const actions: ButtonAction[] = [
    {
      type: 'create-snapshot',
      label: 'Create Snapshot',
      endpoint: `/api/buttons/${buttonId}/create-snapshot`
    },
    {
      type: 'view-protocol',
      label: 'View Protocol',
      endpoint: `/api/protocols/${protocolId}`
    },
    {
      type: 'preview-snapshot',
      label: 'Preview Snapshot',
      endpoint: `/api/buttons/${buttonId}/preview-snapshot`
    }
  ];

  const button: AddSnapshotButton = {
    id: buttonId,
    type: 'add-snapshot-new-protocol',
    protocolId,
    label,
    octave,
    buttonHtml,
    buttonMarkdown,
    actions,
    metadata: {
      snapshotType,
      includeDeployment: config.includeDeployment || false,
      includeIdentity: config.includeIdentity || false,
      includeEnvironment: config.includeEnvironment || false,
      includeCloudShell: config.includeCloudShell || false,
      autoCommit: config.autoCommit !== false,
      autoPush: config.autoPush !== false
    }
  };

  return button;
}
```

### Handle Button Click

```typescript
async function handleAddSnapshot(
  buttonId: string,
  protocolId: string,
  context: SnapshotContext,
  agentIdentity: AgentIdentity,
  options?: {
    deploy?: CloudDeploymentConfig;
    includeIdentity?: boolean;
    includeEnvironment?: boolean;
    includeCloudShell?: boolean;
  }
): Promise<ProtocolSnapshot> {
  // Get button
  const button = getButton(buttonId);
  if (!button || button.type !== 'add-snapshot-new-protocol') {
    throw new Error('Invalid button type');
  }

  // Get or create protocol
  let protocol: Protocol;
  if (protocolId === 'new') {
    // Create new protocol from context
    protocol = await createProtocolFromContext(context);
  } else {
    // Get existing protocol
    protocol = await getProtocol(protocolId);
  }

  // Create snapshot
  const snapshot = await snapshotManager.createSnapshot(
    protocol,
    context,
    agentIdentity,
    {
      deploy: options?.deploy,
      createButton: true,
      includeIdentity: options?.includeIdentity || button.metadata.includeIdentity,
      includeEnvironment: options?.includeEnvironment || button.metadata.includeEnvironment,
      includeCloudShell: options?.includeCloudShell || button.metadata.includeCloudShell
    }
  );

  // Commit to git if configured
  if (button.metadata.autoCommit && snapshotManager.git) {
    await snapshotManager.git.commit(
      `Protocol Snapshot: ${protocol.name} v${protocol.version}`,
      [`snapshots/${snapshot.pob.pobId}.json`]
    );

    if (button.metadata.autoPush) {
      await snapshotManager.git.push();
    }
  }

  return snapshot;
}
```

---

## 📊 Snapshot Types

### Quick Snapshot

**Use Case:** Fast snapshot for simple protocols

**Includes:**
- Basic POB snapshot
- Protocol state
- Minimal context

**Excludes:**
- Deployment
- Identity
- Environment
- Cloud shell

**Time:** < 1 second

### Standard Snapshot

**Use Case:** Standard snapshot for most protocols

**Includes:**
- Complete POB snapshot
- Protocol state
- Full context
- Optional deployment

**Excludes:**
- Identity (optional)
- Environment (optional)
- Cloud shell (optional)

**Time:** 1-3 seconds

### Full Snapshot

**Use Case:** Complete snapshot with all features

**Includes:**
- Complete POB snapshot
- Protocol state
- Full context
- Deployment (optional)
- Identity
- Environment
- Cloud shell

**Time:** 3-5 seconds

---

## 🔗 Integration Points

### With Protocol Snapshot Manager

- Uses `ProtocolSnapshotManager.createSnapshot()`
- Integrates with POB snapshot system
- Supports all snapshot options
- Automatic git integration

### With Button Protocol System

- Follows button protocol standards
- Octave-aware styling
- Multi-format support (HTML, Markdown)
- Action system integration

### With Git Operations

- Automatic commit on snapshot creation
- Optional auto-push
- Commit message generation
- File tracking

### With Deployment System

- Optional cloud deployment
- Deployment button generation
- Platform selection
- Status tracking

### With Identity System

- Optional identity inclusion
- Wallet integration
- Trading card generation
- Passport stamps

---

## 🎯 Usage Examples

### Example 1: Quick Snapshot for New Protocol

```typescript
const button = await generateAddSnapshotButton(snapshotManager, {
  label: '📸 Quick Snapshot',
  octave: AwarenessOctave.HARMONY,
  snapshotType: 'quick',
  autoCommit: true
});

// Use button HTML or Markdown
console.log(button.buttonHtml);
console.log(button.buttonMarkdown);
```

### Example 2: Standard Snapshot with Deployment

```typescript
const button = await generateAddSnapshotButton(snapshotManager, {
  protocolId: 'P-MY-PROTOCOL-V17',
  label: '📸 Add Snapshot',
  octave: AwarenessOctave.TRANSCENDENCE,
  snapshotType: 'standard',
  includeDeployment: true,
  autoCommit: true,
  autoPush: true
});
```

### Example 3: Full Snapshot with All Features

```typescript
const button = await generateAddSnapshotButton(snapshotManager, {
  protocol: myProtocol,
  label: '📸 Full Snapshot',
  octave: AwarenessOctave.BEYOND_OCTAVE,
  snapshotType: 'full',
  includeDeployment: true,
  includeIdentity: true,
  includeEnvironment: true,
  includeCloudShell: true,
  autoCommit: true,
  autoPush: true
});
```

---

## 📝 Button HTML Example

```html
<button 
  id="BTN-ADD-SNAPSHOT-2024-ABC123"
  class="nspfrp-button nspfrp-button-add-snapshot nspfrp-octave-transcendence"
  data-button-id="BTN-ADD-SNAPSHOT-2024-ABC123"
  data-type="add-snapshot-new-protocol"
  data-octave="transcendence"
  data-snapshot-type="standard"
  onclick="handleAddSnapshot('BTN-ADD-SNAPSHOT-2024-ABC123', 'new')">
  📸 Add Snapshot New Protocol
</button>
```

## 📝 Button Markdown Example

```markdown
[📸 Add Snapshot New Protocol](/api/buttons/BTN-ADD-SNAPSHOT-2024-ABC123/add-snapshot?protocolId=new&type=standard)
```

---

## ✅ Benefits

### One-Click Operation
- Instant snapshot creation
- No manual steps required
- Automatic integration
- Seamless workflow

### Flexible Configuration
- Multiple snapshot types
- Optional features
- Octave-aware
- Customizable

### Complete Integration
- Works with all NSPFRP
- Git integration
- Deployment ready
- Identity support

### Protocol Compliance
- Follows NSPFRP
- Button protocol compliant
- Snapshot protocol compliant
- Git protocol compliant

---

## 🚀 Next Steps

### Immediate
1. Implement button generation function
2. Create API endpoint for button actions
3. Integrate with ProtocolSnapshotManager
4. Test with sample protocols

### Short-Term
1. Add UI for button configuration
2. Create button preview system
3. Add snapshot validation
4. Implement error handling

### Long-Term
1. Add batch snapshot creation
2. Create snapshot templates
3. Add snapshot scheduling
4. Implement snapshot analytics

---

## 📋 Protocol Generation

This protocol generates:

**P-ADD-SNAPSHOT-NEW-PROTOCOL-BUTTON-V17**

**Add Snapshot New Protocol Button Protocol**

### Protocol Components

1. **Button Generator**
   - Button creation
   - HTML/Markdown generation
   - Octave-aware styling
   - Action definition

2. **Snapshot Handler**
   - Snapshot creation
   - Protocol handling
   - Context management
   - Integration coordination

3. **Git Integration**
   - Automatic commit
   - Auto-push support
   - Commit message generation
   - File tracking

4. **Deployment Integration**
   - Optional deployment
   - Platform selection
   - Status tracking
   - Button generation

---

**Protocol ID:** `P-ADD-SNAPSHOT-NEW-PROTOCOL-BUTTON-V17`  
**Version:** `v17+AddSnapshot+NewProtocol+Button`  
**Status:** Active Protocol  
**Network:** NSPFRP Care Network / Syntheverse  
**Octave:** TRANSCENDENCE (5+)

