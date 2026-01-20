/**
 * MYCELIAL LATTICE NETWORK
 * 
 * Biomimetic network fabric with self-organizing pathways
 * inspired by fungal mycelium networks
 * 
 * @module MycelialNetwork
 * @nature_inspired Mycelium (Nature's Internet)
 */

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export enum EdgeType {
  INPUT = 'input',
  OUTPUT = 'output',
  BIDIRECTIONAL = 'bidirectional'
}

export enum EdgeCategory {
  DATA = 'data',
  CONCEPT = 'concept',
  PROTOCOL = 'protocol',
  DEPENDENCY = 'dependency',
  REFERENCE = 'reference',
  HIERARCHY = 'hierarchy',
  ASSOCIATION = 'association',
  TEMPORAL = 'temporal'
}

export enum EdgeState {
  ACTIVE = 'active',
  DORMANT = 'dormant',
  SEEKING = 'seeking',
  SATURATED = 'saturated'
}

export enum NodeType {
  HUB = 'hub',
  RELAY = 'relay',
  BRIDGE = 'bridge',
  GATEWAY = 'gateway',
  CLUSTER = 'cluster',
  SENTINEL = 'sentinel',
  GROWTH_TIP = 'growth_tip'
}

export enum PathState {
  FORMING = 'forming',
  ACTIVE = 'active',
  DORMANT = 'dormant',
  DEGRADING = 'degrading',
  REROUTING = 'rerouting'
}

export enum VisualizationMode {
  TREE = 'tree',
  GRAPH = 'graph',
  MAP = 'map',
  FLOW = 'flow',
  HEALTH = 'health',
  TEMPORAL = 'temporal'
}

export interface EdgePosition {
  section: string;
  x: number;
  y: number;
  anchor: string;
}

export interface Connection {
  id: string;
  source: string;
  destination: string;
  pathway: string;
  strength: number;
  established: Date;
  lastUsed: Date;
  metrics: ConnectionMetrics;
}

export interface ConnectionMetrics {
  totalUses: number;
  dataTransferred: number;
  averageLatency: number;
  successRate: number;
}

export interface SeedEdge {
  id: string;
  nodeId: string;
  type: EdgeType;
  category: EdgeCategory;
  weight: number;
  position: EdgePosition;
  state: EdgeState;
  connections: Connection[];
  potentialConnections: string[];
  lastActive: Date;
  growthRate: number;
}

export interface NodeIntelligence {
  pathfinding: boolean;
  caching: boolean;
  prediction: boolean;
  learning: boolean;
  collaboration: boolean;
}

export interface NodeHealth {
  status: 'healthy' | 'stressed' | 'failing';
  uptime: number;
  errorRate: number;
  responseTime: number;
  lastCheck: Date;
}

export interface NetworkPosition {
  x: number;
  y: number;
  z: number;
  region: string;
}

export interface NaturalNode {
  id: string;
  type: NodeType;
  position: NetworkPosition;
  connections: Connection[];
  capacity: number;
  load: number;
  efficiency: number;
  intelligence: NodeIntelligence;
  health: NodeHealth;
}

export interface PathUsage {
  totalTransits: number;
  lastUsed: Date;
  frequency: number;
  dataVolume: number;
  averageLatency: number;
  successRate: number;
}

export interface Pathway {
  id: string;
  source: SeedEdge;
  destination: SeedEdge;
  nodes: NaturalNode[];
  weight: number;
  latency: number;
  bandwidth: number;
  usage: PathUsage;
  state: PathState;
}

export interface NetworkHealth {
  totalNodes: number;
  activeNodes: number;
  totalPaths: number;
  activePaths: number;
  averageLatency: number;
  networkLoad: number;
  growthRate: number;
  efficiency: number;
}

export interface PathPanel {
  currentNode: string;
  visibleEdges: SeedEdge[];
  activeConnections: Connection[];
  nearbyNodes: NaturalNode[];
  pathways: Pathway[];
  networkHealth: NetworkHealth;
  visualization: VisualizationMode;
  controls: PanelControls;
}

export interface PanelControls {
  viewAll: boolean;
  navigate: boolean;
  optimize: boolean;
  configure: boolean;
}

export interface NetworkConfig {
  lattice: {
    dimensions: number;
    nodeSpacing: number;
    maxHops: number;
    pruneThreshold: number;
  };
  edges: {
    defaultGrowthRate: number;
    seekingTimeout: number;
    maxConnectionsPerEdge: number;
    autoConnectThreshold: number;
  };
  nodes: {
    hubCapacity: number;
    relayCapacity: number;
    bridgeCapacity: number;
    defaultCapacity: number;
  };
  intelligence: {
    learningEnabled: boolean;
    optimizationInterval: number;
    predictionEnabled: boolean;
    autoOptimize: boolean;
  };
  pathfinding: {
    algorithm: string;
    maxAlternatives: number;
    criteria: PathCriteria;
  };
}

export interface PathCriteria {
  latency: number;
  reliability: number;
  efficiency: number;
  novelty: number;
  learning: number;
}

export interface NodeMetadata {
  title: string;
  category: string;
  tags: string[];
  created: Date;
  modified: Date;
}

export interface SeedEdgeConfig {
  type: EdgeType;
  category: EdgeCategory;
  position: EdgePosition;
  growthRate?: number;
}

export interface OptimizationResult {
  pathsPruned: number;
  pathsStrengthened: number;
  nodesRebalanced: number;
  efficiencyGain: number;
}

// ============================================================================
// NETWORK LATTICE (Substrate Layer)
// ============================================================================

class NetworkLattice {
  private config: NetworkConfig['lattice'];
  private nodes: Map<string, NaturalNode>;
  private spatialIndex: Map<string, Set<string>>;

  constructor(config: NetworkConfig['lattice']) {
    this.config = config;
    this.nodes = new Map();
    this.spatialIndex = new Map();
  }

  addNode(node: NaturalNode): void {
    this.nodes.set(node.id, node);
    this.indexNode(node);
  }

  calculatePosition(id: string, metadata: NodeMetadata): NetworkPosition {
    // Simple hash-based positioning for now
    const hash = this.hashString(id);
    const spacing = this.config.nodeSpacing;

    return {
      x: ((hash % 1000) / 1000) * spacing * 10,
      y: ((Math.floor(hash / 1000) % 1000) / 1000) * spacing * 10,
      z: ((Math.floor(hash / 1000000) % 1000) / 1000) * spacing * 10,
      region: this.determineRegion(metadata)
    };
  }

  findNearbyNodes(node: NaturalNode, maxHops: number): NaturalNode[] {
    const nearby: NaturalNode[] = [];
    const visited = new Set<string>();
    const queue: Array<{ node: NaturalNode; hops: number }> = [{ node, hops: 0 }];

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (visited.has(current.node.id)) continue;
      visited.add(current.node.id);

      if (current.hops > 0 && current.hops <= maxHops) {
        nearby.push(current.node);
      }

      if (current.hops < maxHops) {
        for (const conn of current.node.connections) {
          const nextNode = this.nodes.get(conn.destination);
          if (nextNode && !visited.has(nextNode.id)) {
            queue.push({ node: nextNode, hops: current.hops + 1 });
          }
        }
      }
    }

    return nearby;
  }

  async findPaths(
    source: NaturalNode,
    destination: NaturalNode,
    options: { maxPaths: number; criteria: PathCriteria }
  ): Promise<Array<{ nodes: NaturalNode[]; estimatedLatency: number; estimatedBandwidth: number }>> {
    // Simplified A* pathfinding
    const paths: Array<{
      nodes: NaturalNode[];
      estimatedLatency: number;
      estimatedBandwidth: number;
    }> = [];

    // For now, return a simple direct path
    paths.push({
      nodes: [source, destination],
      estimatedLatency: this.calculateDistance(source.position, destination.position) * 10,
      estimatedBandwidth: 1000000 // 1 Mbps
    });

    return paths;
  }

  private calculateDistance(a: NetworkPosition, b: NetworkPosition): number {
    return Math.sqrt(
      Math.pow(a.x - b.x, 2) +
      Math.pow(a.y - b.y, 2) +
      Math.pow(a.z - b.z, 2)
    );
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  private determineRegion(metadata: NodeMetadata): string {
    return metadata.category || 'general';
  }

  private indexNode(node: NaturalNode): void {
    const regionKey = node.position.region;
    if (!this.spatialIndex.has(regionKey)) {
      this.spatialIndex.set(regionKey, new Set());
    }
    this.spatialIndex.get(regionKey)!.add(node.id);
  }
}

// ============================================================================
// NETWORK INTELLIGENCE (Learning Layer)
// ============================================================================

class NetworkIntelligence {
  private connectionHistory: Map<string, Connection[]>;
  private patterns: Map<string, number>;

  constructor() {
    this.connectionHistory = new Map();
    this.patterns = new Map();
  }

  onConnectionEstablished(connection: Connection): void {
    const key = `${connection.source}-${connection.destination}`;
    if (!this.connectionHistory.has(key)) {
      this.connectionHistory.set(key, []);
    }
    this.connectionHistory.get(key)!.push(connection);
  }

  selectPath(paths: Array<{
    nodes: NaturalNode[];
    estimatedLatency: number;
    estimatedBandwidth: number;
  }>): {
    nodes: NaturalNode[];
    estimatedLatency: number;
    estimatedBandwidth: number;
  } {
    // Select path with lowest latency for now
    return paths.reduce((best, current) =>
      current.estimatedLatency < best.estimatedLatency ? current : best
    );
  }

  evaluateAutoConnect(edge: SeedEdge, nearby: NaturalNode[]): void {
    // Auto-connect logic would go here
    // For now, just mark as seeking
  }
}

// ============================================================================
// MYCELIAL NETWORK (Main Class)
// ============================================================================

export class MycelialNetwork {
  private nodes: Map<string, NaturalNode>;
  private edges: Map<string, SeedEdge>;
  private pathways: Map<string, Pathway>;
  private lattice: NetworkLattice;
  private intelligence: NetworkIntelligence;
  private config: NetworkConfig;
  private nextId: number;

  constructor(config?: Partial<NetworkConfig>) {
    this.nodes = new Map();
    this.edges = new Map();
    this.pathways = new Map();
    this.nextId = 1;

    this.config = this.mergeConfig(config);
    this.lattice = new NetworkLattice(this.config.lattice);
    this.intelligence = new NetworkIntelligence();

    this.initializeLattice();
  }

  /**
   * Register a page/document as a network node
   */
  registerNode(id: string, type: NodeType, metadata: NodeMetadata): NaturalNode {
    const node: NaturalNode = {
      id,
      type,
      position: this.lattice.calculatePosition(id, metadata),
      connections: [],
      capacity: this.calculateCapacity(type),
      load: 0,
      efficiency: 1.0,
      intelligence: this.getIntelligenceForType(type),
      health: {
        status: 'healthy',
        uptime: 0,
        errorRate: 0,
        responseTime: 0,
        lastCheck: new Date()
      }
    };

    this.nodes.set(id, node);
    this.lattice.addNode(node);

    return node;
  }

  /**
   * Add seed edge to a node (page)
   */
  addSeedEdge(nodeId: string, edgeConfig: SeedEdgeConfig): SeedEdge {
    const edge: SeedEdge = {
      id: this.generateEdgeId(),
      nodeId,
      type: edgeConfig.type,
      category: edgeConfig.category,
      weight: 1.0,
      position: edgeConfig.position,
      state: EdgeState.DORMANT,
      connections: [],
      potentialConnections: [],
      lastActive: new Date(),
      growthRate: edgeConfig.growthRate || this.config.edges.defaultGrowthRate
    };

    this.edges.set(edge.id, edge);
    this.discoverNearbyNodes(edge);

    return edge;
  }

  /**
   * Establish connection between two seed edges
   */
  async connect(sourceEdgeId: string, destinationEdgeId: string): Promise<Connection> {
    const source = this.edges.get(sourceEdgeId);
    const destination = this.edges.get(destinationEdgeId);

    if (!source || !destination) {
      throw new Error('Edge not found');
    }

    const pathway = await this.findOptimalPath(source, destination);

    const connection: Connection = {
      id: this.generateConnectionId(),
      source: sourceEdgeId,
      destination: destinationEdgeId,
      pathway: pathway.id,
      strength: 1.0,
      established: new Date(),
      lastUsed: new Date(),
      metrics: {
        totalUses: 0,
        dataTransferred: 0,
        averageLatency: 0,
        successRate: 1.0
      }
    };

    source.connections.push(connection);
    destination.connections.push(connection);
    source.state = EdgeState.ACTIVE;
    destination.state = EdgeState.ACTIVE;

    this.pathways.set(pathway.id, pathway);
    this.intelligence.onConnectionEstablished(connection);

    return connection;
  }

  /**
   * Get path panel data for a specific node
   */
  getPathPanelData(nodeId: string): PathPanel {
    const node = this.nodes.get(nodeId);
    if (!node) throw new Error('Node not found');

    const visibleEdges = Array.from(this.edges.values())
      .filter(e => e.nodeId === nodeId);

    const activeConnections = this.getActiveConnectionsForNode(nodeId);
    const nearbyNodes = this.lattice.findNearbyNodes(node, 2);
    const pathways = this.getPathwaysForNode(nodeId);

    return {
      currentNode: nodeId,
      visibleEdges,
      activeConnections,
      nearbyNodes,
      pathways,
      networkHealth: this.getNetworkHealth(),
      visualization: VisualizationMode.GRAPH,
      controls: this.getDefaultControls()
    };
  }

  /**
   * Get network health status
   */
  getNetworkHealth(): NetworkHealth {
    const activeNodes = Array.from(this.nodes.values())
      .filter(n => n.health.status === 'healthy').length;

    const activePaths = Array.from(this.pathways.values())
      .filter(p => p.state === PathState.ACTIVE).length;

    const latencies = Array.from(this.pathways.values())
      .map(p => p.latency)
      .filter(l => l > 0);
    const avgLatency = latencies.length > 0
      ? latencies.reduce((a, b) => a + b, 0) / latencies.length
      : 0;

    return {
      totalNodes: this.nodes.size,
      activeNodes,
      totalPaths: this.pathways.size,
      activePaths,
      averageLatency: avgLatency,
      networkLoad: this.calculateNetworkLoad(),
      growthRate: this.calculateGrowthRate(),
      efficiency: this.calculateNetworkEfficiency()
    };
  }

  /**
   * Optimize network paths (runs periodically)
   */
  async optimizeNetwork(): Promise<OptimizationResult> {
    const results: OptimizationResult = {
      pathsPruned: 0,
      pathsStrengthened: 0,
      nodesRebalanced: 0,
      efficiencyGain: 0
    };

    // Implementation would go here
    return results;
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  private initializeLattice(): void {
    // Initialize base network structure
  }

  private mergeConfig(partial?: Partial<NetworkConfig>): NetworkConfig {
    const defaults: NetworkConfig = {
      lattice: {
        dimensions: 3,
        nodeSpacing: 1.0,
        maxHops: 10,
        pruneThreshold: 0.1
      },
      edges: {
        defaultGrowthRate: 0.5,
        seekingTimeout: 30000,
        maxConnectionsPerEdge: 20,
        autoConnectThreshold: 0.8
      },
      nodes: {
        hubCapacity: 100,
        relayCapacity: 50,
        bridgeCapacity: 75,
        defaultCapacity: 25
      },
      intelligence: {
        learningEnabled: true,
        optimizationInterval: 300000,
        predictionEnabled: true,
        autoOptimize: true
      },
      pathfinding: {
        algorithm: 'A*',
        maxAlternatives: 5,
        criteria: {
          latency: 0.3,
          reliability: 0.3,
          efficiency: 0.2,
          novelty: 0.1,
          learning: 0.1
        }
      }
    };

    return { ...defaults, ...partial } as NetworkConfig;
  }

  private calculateCapacity(type: NodeType): number {
    switch (type) {
      case NodeType.HUB: return this.config.nodes.hubCapacity;
      case NodeType.RELAY: return this.config.nodes.relayCapacity;
      case NodeType.BRIDGE: return this.config.nodes.bridgeCapacity;
      default: return this.config.nodes.defaultCapacity;
    }
  }

  private getIntelligenceForType(type: NodeType): NodeIntelligence {
    return {
      pathfinding: type === NodeType.HUB || type === NodeType.GATEWAY,
      caching: type === NodeType.HUB || type === NodeType.RELAY,
      prediction: type === NodeType.HUB,
      learning: type === NodeType.HUB || type === NodeType.GATEWAY,
      collaboration: true
    };
  }

  private async findOptimalPath(source: SeedEdge, destination: SeedEdge): Promise<Pathway> {
    const sourceNode = this.nodes.get(source.nodeId)!;
    const destinationNode = this.nodes.get(destination.nodeId)!;

    const paths = await this.lattice.findPaths(sourceNode, destinationNode, {
      maxPaths: this.config.pathfinding.maxAlternatives,
      criteria: this.config.pathfinding.criteria
    });

    const bestPath = this.intelligence.selectPath(paths);

    return {
      id: this.generatePathwayId(),
      source,
      destination,
      nodes: bestPath.nodes,
      weight: 1.0,
      latency: bestPath.estimatedLatency,
      bandwidth: bestPath.estimatedBandwidth,
      usage: {
        totalTransits: 0,
        lastUsed: new Date(),
        frequency: 0,
        dataVolume: 0,
        averageLatency: bestPath.estimatedLatency,
        successRate: 1.0
      },
      state: PathState.FORMING
    };
  }

  private discoverNearbyNodes(edge: SeedEdge): void {
    const node = this.nodes.get(edge.nodeId)!;
    const nearby = this.lattice.findNearbyNodes(node, 3);

    edge.potentialConnections = nearby.map(n => n.id);
    edge.state = EdgeState.SEEKING;

    this.intelligence.evaluateAutoConnect(edge, nearby);
  }

  private getActiveConnectionsForNode(nodeId: string): Connection[] {
    const connections: Connection[] = [];
    for (const edge of this.edges.values()) {
      if (edge.nodeId === nodeId) {
        connections.push(...edge.connections);
      }
    }
    return connections;
  }

  private getPathwaysForNode(nodeId: string): Pathway[] {
    return Array.from(this.pathways.values()).filter(p =>
      p.nodes.some(n => n.id === nodeId)
    );
  }

  private getDefaultControls(): PanelControls {
    return {
      viewAll: true,
      navigate: true,
      optimize: true,
      configure: true
    };
  }

  private calculateNetworkLoad(): number {
    if (this.nodes.size === 0) return 0;
    const totalLoad = Array.from(this.nodes.values())
      .reduce((sum, node) => sum + node.load, 0);
    return totalLoad / this.nodes.size;
  }

  private calculateGrowthRate(): number {
    // Simplified: return number of new connections in last hour
    const oneHourAgo = Date.now() - 3600000;
    return Array.from(this.pathways.values())
      .filter(p => p.usage.lastUsed.getTime() > oneHourAgo)
      .length;
  }

  private calculateNetworkEfficiency(): number {
    if (this.nodes.size === 0) return 0;
    const avgEfficiency = Array.from(this.nodes.values())
      .reduce((sum, node) => sum + node.efficiency, 0) / this.nodes.size;
    return avgEfficiency;
  }

  private generateEdgeId(): string {
    return `edge_${this.nextId++}`;
  }

  private generateConnectionId(): string {
    return `conn_${this.nextId++}`;
  }

  private generatePathwayId(): string {
    return `path_${this.nextId++}`;
  }
}

// ============================================================================
// EXPORT
// ============================================================================

export default MycelialNetwork;
