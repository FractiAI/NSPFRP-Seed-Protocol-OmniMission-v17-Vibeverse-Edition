/**
 * Subordinate Catalog Organizer
 * Separates and organizes protocols by subordinate node for speed and easy location
 *
 * Protocol ID: P-SUBORDINATE-CATALOG-ORGANIZER-V17
 * Type: Catalog Organization / Protocol Management
 * Version: v17+Subordinate+Organization
 * Status: Active
 */

import { Protocol, CatalogEntry } from '../types/index.js';
import { SubordinateNode } from './queen-bee-catalog-sync.js';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export interface SubordinateCatalog {
  nodeId: string;
  nodeName: string;
  repository: string;
  protocols: Map<string, CatalogEntry>;
  lastSync: number;
  totalProtocols: number;
  newProtocols: number;
  updatedProtocols: number;
  catalogPath: string;
}

export interface CatalogOrganization {
  masterCatalog: Map<string, CatalogEntry>;
  subordinateCatalogs: Map<string, SubordinateCatalog>;
  protocolSourceMap: Map<string, string>; // protocol ID -> node ID
  lastOrganized: number;
}

export class SubordinateCatalogOrganizer {
  private organization: CatalogOrganization;
  private catalogDir: string;

  constructor(catalogDir: string = './catalogs') {
    this.catalogDir = catalogDir;
    this.organization = {
      masterCatalog: new Map(),
      subordinateCatalogs: new Map(),
      protocolSourceMap: new Map(),
      lastOrganized: Date.now()
    };
    this.ensureCatalogDirectory();
  }

  /**
   * Ensure catalog directory exists
   */
  private ensureCatalogDirectory(): void {
    if (!existsSync(this.catalogDir)) {
      mkdirSync(this.catalogDir, { recursive: true });
    }
  }

  /**
   * Add protocol to appropriate subordinate catalog
   */
  addProtocol(protocol: Protocol, entry: CatalogEntry, node: SubordinateNode, isNew: boolean): void {
    // Add to master catalog
    this.organization.masterCatalog.set(protocol.id, entry);

    // Track source
    this.organization.protocolSourceMap.set(protocol.id, node.id);

    // Get or create subordinate catalog
    let subCatalog = this.organization.subordinateCatalogs.get(node.id);
    if (!subCatalog) {
      subCatalog = {
        nodeId: node.id,
        nodeName: node.name,
        repository: node.repository,
        protocols: new Map(),
        lastSync: Date.now(),
        totalProtocols: 0,
        newProtocols: 0,
        updatedProtocols: 0,
        catalogPath: join(this.catalogDir, `${node.id}-catalog.json`)
      };
      this.organization.subordinateCatalogs.set(node.id, subCatalog);
    }

    // Add protocol to subordinate catalog
    subCatalog.protocols.set(protocol.id, entry);
    subCatalog.totalProtocols = subCatalog.protocols.size;
    
    if (isNew) {
      subCatalog.newProtocols++;
    } else {
      subCatalog.updatedProtocols++;
    }
    
    subCatalog.lastSync = Date.now();
  }

  /**
   * Update protocol in catalogs
   */
  updateProtocol(protocol: Protocol, entry: CatalogEntry, node: SubordinateNode): void {
    this.addProtocol(protocol, entry, node, false);
  }

  /**
   * Get protocols from specific subordinate node
   */
  getProtocolsByNode(nodeId: string): CatalogEntry[] {
    const subCatalog = this.organization.subordinateCatalogs.get(nodeId);
    if (!subCatalog) return [];
    return Array.from(subCatalog.protocols.values());
  }

  /**
   * Get source node for a protocol
   */
  getProtocolSource(protocolId: string): string | undefined {
    return this.organization.protocolSourceMap.get(protocolId);
  }

  /**
   * Write subordinate catalog to disk
   */
  writeSubordinateCatalog(nodeId: string): void {
    const subCatalog = this.organization.subordinateCatalogs.get(nodeId);
    if (!subCatalog) return;

    const catalogData = {
      nodeId: subCatalog.nodeId,
      nodeName: subCatalog.nodeName,
      repository: subCatalog.repository,
      lastSync: subCatalog.lastSync,
      totalProtocols: subCatalog.totalProtocols,
      newProtocols: subCatalog.newProtocols,
      updatedProtocols: subCatalog.updatedProtocols,
      protocols: Array.from(subCatalog.protocols.entries()).map(([id, entry]) => ({
        id,
        protocol: {
          id: entry.protocol.id,
          name: entry.protocol.name,
          version: entry.protocol.version,
          type: entry.protocol.type,
          status: entry.protocol.status
        },
        source: entry.source,
        registeredAt: entry.registeredAt,
        lastUpdated: entry.lastUpdated,
        versions: {
          current: entry.versions.current,
          history: entry.versions.history
        }
      }))
    };

    writeFileSync(subCatalog.catalogPath, JSON.stringify(catalogData, null, 2));
    console.log(`📝 Wrote catalog for ${subCatalog.nodeName}: ${subCatalog.totalProtocols} protocols`);
  }

  /**
   * Write all subordinate catalogs to disk
   */
  writeAllSubordinateCatalogs(): void {
    for (const [nodeId, _] of this.organization.subordinateCatalogs) {
      this.writeSubordinateCatalog(nodeId);
    }
  }

  /**
   * Write master catalog with source tracking
   */
  writeMasterCatalog(): void {
    const masterPath = join(this.catalogDir, 'master-catalog.json');
    
    const masterData = {
      lastOrganized: this.organization.lastOrganized,
      totalProtocols: this.organization.masterCatalog.size,
      subordinateNodes: Array.from(this.organization.subordinateCatalogs.values()).map(sub => ({
        nodeId: sub.nodeId,
        nodeName: sub.nodeName,
        repository: sub.repository,
        totalProtocols: sub.totalProtocols,
        newProtocols: sub.newProtocols,
        updatedProtocols: sub.updatedProtocols,
        lastSync: sub.lastSync,
        catalogPath: sub.catalogPath
      })),
      protocols: Array.from(this.organization.masterCatalog.entries()).map(([id, entry]) => ({
        id,
        name: entry.protocol.name,
        version: entry.versions.current,
        type: entry.protocol.type,
        status: entry.protocol.status,
        sourceNode: this.organization.protocolSourceMap.get(id),
        registeredAt: entry.registeredAt,
        lastUpdated: entry.lastUpdated
      }))
    };

    writeFileSync(masterPath, JSON.stringify(masterData, null, 2));
    console.log(`📝 Wrote master catalog: ${masterData.totalProtocols} protocols from ${masterData.subordinateNodes.length} nodes`);
  }

  /**
   * Generate markdown catalog for a subordinate node
   */
  generateSubordinateMarkdownCatalog(nodeId: string): string {
    const subCatalog = this.organization.subordinateCatalogs.get(nodeId);
    if (!subCatalog) return '';

    let markdown = `# ${subCatalog.nodeName} Protocol Catalog\n\n`;
    markdown += `**Repository:** \`${subCatalog.repository}\`  \n`;
    markdown += `**Node ID:** \`${subCatalog.nodeId}\`  \n`;
    markdown += `**Last Sync:** ${new Date(subCatalog.lastSync).toISOString()}  \n`;
    markdown += `**Total Protocols:** ${subCatalog.totalProtocols}  \n`;
    markdown += `**New Protocols:** ${subCatalog.newProtocols}  \n`;
    markdown += `**Updated Protocols:** ${subCatalog.updatedProtocols}  \n\n`;
    markdown += `---\n\n`;
    markdown += `## Protocols\n\n`;

    const protocols = Array.from(subCatalog.protocols.values());
    protocols.sort((a, b) => a.protocol.name.localeCompare(b.protocol.name));

    for (const entry of protocols) {
      markdown += `### ${entry.protocol.name}\n\n`;
      markdown += `- **Protocol ID:** \`${entry.protocol.id}\`\n`;
      markdown += `- **Version:** \`${entry.versions.current}\`\n`;
      markdown += `- **Type:** ${entry.protocol.type}\n`;
      markdown += `- **Status:** ${entry.protocol.status}\n`;
      markdown += `- **Registered:** ${new Date(entry.registeredAt).toISOString()}\n`;
      markdown += `- **Last Updated:** ${new Date(entry.lastUpdated).toISOString()}\n`;
      markdown += `- **Source:** [${subCatalog.repository}](https://github.com/${subCatalog.repository})\n\n`;
    }

    return markdown;
  }

  /**
   * Write markdown catalog for subordinate node
   */
  writeSubordinateMarkdownCatalog(nodeId: string): void {
    const subCatalog = this.organization.subordinateCatalogs.get(nodeId);
    if (!subCatalog) return;

    const markdown = this.generateSubordinateMarkdownCatalog(nodeId);
    const markdownPath = join(this.catalogDir, `${nodeId}-catalog.md`);
    
    writeFileSync(markdownPath, markdown);
    console.log(`📝 Wrote markdown catalog for ${subCatalog.nodeName}: ${markdownPath}`);
  }

  /**
   * Write all markdown catalogs
   */
  writeAllMarkdownCatalogs(): void {
    for (const [nodeId, _] of this.organization.subordinateCatalogs) {
      this.writeSubordinateMarkdownCatalog(nodeId);
    }
    this.writeMasterMarkdownCatalog();
  }

  /**
   * Generate master markdown catalog
   */
  writeMasterMarkdownCatalog(): void {
    let markdown = `# Master Protocol Catalog - Queen Bee\n\n`;
    markdown += `**Last Organized:** ${new Date(this.organization.lastOrganized).toISOString()}  \n`;
    markdown += `**Total Protocols:** ${this.organization.masterCatalog.size}  \n`;
    markdown += `**Subordinate Nodes:** ${this.organization.subordinateCatalogs.size}  \n\n`;
    markdown += `---\n\n`;
    markdown += `## Subordinate Nodes\n\n`;

    for (const [nodeId, subCatalog] of this.organization.subordinateCatalogs) {
      markdown += `### ${subCatalog.nodeName}\n\n`;
      markdown += `- **Repository:** [${subCatalog.repository}](https://github.com/${subCatalog.repository})\n`;
      markdown += `- **Node ID:** \`${subCatalog.nodeId}\`\n`;
      markdown += `- **Total Protocols:** ${subCatalog.totalProtocols}\n`;
      markdown += `- **New Protocols:** ${subCatalog.newProtocols}\n`;
      markdown += `- **Updated Protocols:** ${subCatalog.updatedProtocols}\n`;
      markdown += `- **Last Sync:** ${new Date(subCatalog.lastSync).toISOString()}\n`;
      markdown += `- **Catalog:** [${nodeId}-catalog.md](./${nodeId}-catalog.md)\n\n`;
    }

    markdown += `---\n\n`;
    markdown += `## All Protocols (By Source Node)\n\n`;

    // Group protocols by node
    for (const [nodeId, subCatalog] of this.organization.subordinateCatalogs) {
      markdown += `### ${subCatalog.nodeName} (${subCatalog.totalProtocols} protocols)\n\n`;
      
      const protocols = Array.from(subCatalog.protocols.values());
      protocols.sort((a, b) => a.protocol.name.localeCompare(b.protocol.name));

      for (const entry of protocols) {
        markdown += `- **${entry.protocol.name}** (\`${entry.protocol.id}\`) - Version ${entry.versions.current} - ${entry.protocol.type}\n`;
      }
      markdown += `\n`;
    }

    const masterPath = join(this.catalogDir, 'MASTER_CATALOG.md');
    writeFileSync(masterPath, markdown);
    console.log(`📝 Wrote master markdown catalog: ${masterPath}`);
  }

  /**
   * Get organization statistics
   */
  getStatistics() {
    return {
      totalProtocols: this.organization.masterCatalog.size,
      totalNodes: this.organization.subordinateCatalogs.size,
      lastOrganized: this.organization.lastOrganized,
      nodes: Array.from(this.organization.subordinateCatalogs.values()).map(sub => ({
        nodeId: sub.nodeId,
        nodeName: sub.nodeName,
        totalProtocols: sub.totalProtocols,
        newProtocols: sub.newProtocols,
        updatedProtocols: sub.updatedProtocols,
        catalogPath: sub.catalogPath
      }))
    };
  }

  /**
   * Reset counters (call after writing catalogs)
   */
  resetCounters(): void {
    for (const [_, subCatalog] of this.organization.subordinateCatalogs) {
      subCatalog.newProtocols = 0;
      subCatalog.updatedProtocols = 0;
    }
  }
}

// Singleton instance
export const subordinateCatalogOrganizer = new SubordinateCatalogOrganizer();
