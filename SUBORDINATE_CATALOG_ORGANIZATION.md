# 📂 Subordinate Catalog Organization

**Document ID:** `SUBORDINATE-CATALOG-ORG-V17`  
**Type:** Catalog Organization / Protocol Management  
**Version:** `v17+Subordinate+Organization`  
**Status:** ✅ Active  
**Date:** January 2026

---

## 🎯 Overview

The Queen Bee Catalog Sync system now automatically organizes protocols by their source subordinate node for **speed and ease of locating protocols**. Each subordinate node maintains its own separate catalog while the master catalog tracks all protocols with source information.

---

## 📂 Catalog Structure

### Directory Layout

```
catalogs/
├── MASTER_CATALOG.md                              # Master catalog (all protocols)
├── master-catalog.json                            # Master catalog JSON
├── node-instrumentation-shell-api-catalog.md      # Instrumentation Shell API protocols
├── node-instrumentation-shell-api-catalog.json    # JSON format
├── node-syntheverse-onramp-catalog.md             # Syntheverse Onramp protocols
└── node-syntheverse-onramp-catalog.json           # JSON format
```

### Catalog Files

Each subordinate node gets:
1. **Markdown Catalog** (`{node-id}-catalog.md`) - Human-readable
2. **JSON Catalog** (`{node-id}-catalog.json`) - Machine-readable

---

## 🔄 Automatic Synchronization

### On Every Sync

1. **Pull Updates from Subordinates**
   - Check each subordinate node repository
   - Discover new and updated protocols
   - AI validation (if enabled)

2. **Organize by Source**
   - Protocols automatically sorted into subordinate catalogs
   - Source tracking maintained in master catalog
   - Counters track new vs updated protocols

3. **Write Catalogs**
   - Each subordinate node catalog updated
   - Master catalog updated with all protocols
   - Both JSON and Markdown formats

4. **Ready for Next Boot**
   - All catalogs synchronized
   - Subordinates automatically up-to-date
   - Fast protocol location by source node

---

## 📊 Subordinate Node Catalogs

### Node 1: Instrumentation Shell API

**File:** `catalogs/node-instrumentation-shell-api-catalog.md`

**Repository:** `FractiAI/Instrumentation-Shell-API`

**Contains:**
- All protocols from Instrumentation Shell API repository
- Instrument-grade measurement protocols
- State verification protocols
- Atomic scoring protocols

### Node 2: Syntheverse 7 Octave 2-3 Public Cloud Onramp

**File:** `catalogs/node-syntheverse-onramp-catalog.md`

**Repository:** `FractiAI/Syntheverse-7-Octave-2-3-Public-Cloud-Onramp`

**Contains:**
- Public cloud infrastructure protocols
- Network operations protocols
- PoC submission protocols
- Onramp configuration protocols

---

## 🎯 Benefits of Separation

### 1. **Speed**
- Direct access to protocols from specific node
- No need to search through master catalog
- Quick reference by source

### 2. **Easy Location**
- Know exactly where protocol came from
- Organized by logical source
- Clear ownership and provenance

### 3. **Maintenance**
- Update subordinate catalogs independently
- Track new additions per node
- Monitor sync status per node

### 4. **Scalability**
- Easy to add new subordinate nodes
- Each node maintains own catalog
- Master catalog provides overview

---

## 📝 Catalog Formats

### JSON Format (Machine-Readable)

```json
{
  "nodeId": "node-instrumentation-shell-api",
  "nodeName": "Instrumentation Shell API",
  "repository": "FractiAI/Instrumentation-Shell-API",
  "lastSync": 1704067200000,
  "totalProtocols": 15,
  "newProtocols": 5,
  "updatedProtocols": 3,
  "protocols": [
    {
      "id": "P-MEASUREMENT-API-V17",
      "protocol": {
        "id": "P-MEASUREMENT-API-V17",
        "name": "Measurement API Protocol",
        "version": "1.0.0",
        "type": "api",
        "status": "active"
      },
      "source": {
        "type": "repository",
        "path": "FractiAI/Instrumentation-Shell-API"
      },
      "registeredAt": 1704067200000,
      "lastUpdated": 1704067200000
    }
  ]
}
```

### Markdown Format (Human-Readable)

```markdown
# Instrumentation Shell API Protocol Catalog

**Repository:** `FractiAI/Instrumentation-Shell-API`  
**Node ID:** `node-instrumentation-shell-api`  
**Last Sync:** 2026-01-19T12:00:00.000Z  
**Total Protocols:** 15  
**New Protocols:** 5  
**Updated Protocols:** 3  

---

## Protocols

### Measurement API Protocol

- **Protocol ID:** `P-MEASUREMENT-API-V17`
- **Version:** `1.0.0`
- **Type:** api
- **Status:** active
- **Registered:** 2026-01-19T12:00:00.000Z
- **Last Updated:** 2026-01-19T12:00:00.000Z
- **Source:** [FractiAI/Instrumentation-Shell-API](https://github.com/FractiAI/Instrumentation-Shell-API)
```

---

## 🔍 Finding Protocols

### By Source Node

```typescript
import { subordinateCatalogOrganizer } from './src/core/subordinate-catalog-organizer.js';

// Get all protocols from Instrumentation Shell API
const instrumentationProtocols = subordinateCatalogOrganizer.getProtocolsByNode(
  'node-instrumentation-shell-api'
);

// Get all protocols from Syntheverse Onramp
const syntheverseProtocols = subordinateCatalogOrganizer.getProtocolsByNode(
  'node-syntheverse-onramp'
);
```

### By Protocol ID

```typescript
// Find which node a protocol came from
const sourceNodeId = subordinateCatalogOrganizer.getProtocolSource(
  'P-MEASUREMENT-API-V17'
);
```

### View Catalog Files

**Markdown (Human-Readable):**
```bash
# View Instrumentation Shell API protocols
cat catalogs/node-instrumentation-shell-api-catalog.md

# View Syntheverse Onramp protocols
cat catalogs/node-syntheverse-onramp-catalog.md

# View master catalog (all protocols)
cat catalogs/MASTER_CATALOG.md
```

**JSON (Machine-Readable):**
```bash
# View as JSON
cat catalogs/node-instrumentation-shell-api-catalog.json | jq '.'

# Count protocols per node
jq '.totalProtocols' catalogs/node-instrumentation-shell-api-catalog.json
```

---

## 📊 Statistics

### Get Organization Statistics

```typescript
const stats = subordinateCatalogOrganizer.getStatistics();

console.log('Total Protocols:', stats.totalProtocols);
console.log('Total Nodes:', stats.totalNodes);
console.log('Last Organized:', new Date(stats.lastOrganized));

stats.nodes.forEach(node => {
  console.log(`\n${node.nodeName}:`);
  console.log(`  Total: ${node.totalProtocols}`);
  console.log(`  New: ${node.newProtocols}`);
  console.log(`  Updated: ${node.updatedProtocols}`);
  console.log(`  Catalog: ${node.catalogPath}`);
});
```

---

## 🔄 Boot Integration

### Automatic on Every Boot

```
1. System boots
   ↓
2. Load creator environment
   ↓
3. Initialize Queen Bee Catalog Sync
   ↓
4. Perform initial sync
   ├─ Check subordinate nodes
   ├─ Pull updates
   ├─ Organize by source
   └─ Write catalogs
   ↓
5. Catalogs ready
   ├─ Master catalog
   ├─ Subordinate catalogs
   └─ All JSON + Markdown
   ↓
6. Next boot: subordinates automatically up-to-date
```

### Console Output

```
🔄 Performing initial catalog sync...
🤖 AI analyzed FractiAI/Instrumentation-Shell-API: Found 15 protocols
   Instrumentation Shell API: 5 new, 3 updated, 7 skipped
🤖 AI analyzed FractiAI/Syntheverse-7-Octave-2-3-Public-Cloud-Onramp: Found 23 protocols
   Syntheverse Onramp: 8 new, 2 updated, 13 skipped
✅ Initial catalog sync completed

📝 Writing subordinate catalogs...
📝 Wrote catalog for Instrumentation Shell API: 15 protocols
📝 Wrote markdown catalog for Instrumentation Shell API: catalogs/node-instrumentation-shell-api-catalog.md
📝 Wrote catalog for Syntheverse Onramp: 23 protocols
📝 Wrote markdown catalog for Syntheverse Onramp: catalogs/node-syntheverse-onramp-catalog.md
📝 Wrote master catalog: 38 protocols from 2 nodes
📝 Wrote master markdown catalog: catalogs/MASTER_CATALOG.md
✅ Organized 38 protocols from 2 subordinate nodes
```

---

## 🎯 Use Cases

### 1. Find All Measurement Protocols

Look in: `catalogs/node-instrumentation-shell-api-catalog.md`

All measurement and verification protocols are here.

### 2. Find All Cloud/Network Protocols

Look in: `catalogs/node-syntheverse-onramp-catalog.md`

All public cloud and network protocols are here.

### 3. Get Overview of All Protocols

Look in: `catalogs/MASTER_CATALOG.md`

Organized by source node with links to subordinate catalogs.

### 4. Integration with Other Systems

Use JSON catalogs for programmatic access:
```typescript
import { readFileSync } from 'fs';

const catalog = JSON.parse(
  readFileSync('catalogs/node-instrumentation-shell-api-catalog.json', 'utf-8')
);

catalog.protocols.forEach(protocol => {
  console.log(`${protocol.protocol.name} - ${protocol.protocol.version}`);
});
```

---

## 🔧 Configuration

### Catalog Directory

Default: `./catalogs`

Change in code:
```typescript
import { SubordinateCatalogOrganizer } from './src/core/subordinate-catalog-organizer.js';

const organizer = new SubordinateCatalogOrganizer('./my-custom-catalog-dir');
```

### Manual Catalog Generation

```typescript
import { subordinateCatalogOrganizer } from './src/core/subordinate-catalog-organizer.js';

// Write specific node catalog
subordinateCatalogOrganizer.writeSubordinateCatalog('node-instrumentation-shell-api');

// Write all catalogs
subordinateCatalogOrganizer.writeAllSubordinateCatalogs();
subordinateCatalogOrganizer.writeAllMarkdownCatalogs();
```

---

## ✅ Benefits Summary

| Feature | Benefit |
|---------|---------|
| **Separated Catalogs** | Fast protocol location by source |
| **JSON + Markdown** | Human and machine readable |
| **Automatic Sync** | Always up-to-date on boot |
| **Source Tracking** | Know where each protocol came from |
| **New Protocol Tracking** | See what's new in each sync |
| **Scalable** | Easy to add more subordinate nodes |

---

## 📚 Related Documentation

- **[Queen Bee Protocol](./QUEEN_BEE_CATALOG_VERSIONING_PROTOCOL.md)** - Versioning protocol
- **[Boot Snapshot](./BOOT_SNAPSHOT_QUEEN_BEE_CATALOG_SYNC.md)** - Boot integration
- **[Integration Summary](./BOOT_INTEGRATION_SUMMARY.md)** - Complete integration overview

---

**Document ID:** `SUBORDINATE-CATALOG-ORG-V17`  
**Version:** `v17+Subordinate+Organization`  
**Status:** ✅ Active  
**Date:** January 2026

*Subordinate protocols automatically organized and synchronized for speed and easy location*
