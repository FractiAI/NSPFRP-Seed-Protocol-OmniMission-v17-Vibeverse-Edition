/**
 * 📡 BROADCAST DIVISION SYSTEM
 * 
 * Organizes content around broadcast division with systems, playlists, and catalogs
 * Feeds all users, vibespheres, panels, consoles, feeds, series, novels, curriculums
 * All octaves and singularities
 * From 10-year-old level to frontier scientific research grade
 * Everything in between
 */

export type ContentLevel = 
  | 'age-10'           // 10-year-old can understand
  | 'beginner'         // Beginner level
  | 'intermediate'     // Intermediate level
  | 'advanced'         // Advanced level
  | 'expert'           // Expert level
  | 'frontier-research'; // Frontier scientific research grade

export type ContentFormat =
  | 'raw'              // Raw content
  | 'refined'          // Refined content
  | 'curated'          // Curated content
  | 'produced';        // Fully produced content

export type ContentType =
  | 'feed'             // Feed content
  | 'series'           // Series content
  | 'novel'            // Novel content
  | 'curriculum'       // Curriculum content
  | 'panel'            // Panel content
  | 'console'          // Console content
  | 'vibesphere'       // Vibesphere content
  | 'documentation'    // Documentation
  | 'research'         // Research content
  | 'tutorial'         // Tutorial content
  | 'story'            // Story content
  | 'protocol';        // Protocol content

export interface ContentItem {
  /** Content ID */
  id: string;
  
  /** Content title */
  title: string;
  
  /** Content type */
  type: ContentType;
  
  /** Content level */
  level: ContentLevel;
  
  /** Content format */
  format: ContentFormat;
  
  /** Octave level */
  octave: number;
  
  /** Singularity level */
  singularity: number;
  
  /** Content source */
  source: 'raw' | 'refined' | 'curated' | 'produced';
  
  /** Content data */
  content: any;
  
  /** Metadata */
  metadata: {
    author?: string;
    tags?: string[];
    category?: string;
    duration?: number;
    language?: string;
    targetAudience?: string[];
  };
  
  /** Timestamps */
  createdAt: number;
  updatedAt: number;
}

export interface Playlist {
  /** Playlist ID */
  id: string;
  
  /** Playlist name */
  name: string;
  
  /** Playlist description */
  description: string;
  
  /** Content items */
  items: ContentItem[];
  
  /** Target audience */
  targetAudience: ContentLevel[];
  
  /** Octave range */
  octaveRange: { min: number; max: number };
  
  /** Singularity range */
  singularityRange: { min: number; max: number };
  
  /** Playlist order */
  order: 'sequential' | 'random' | 'adaptive';
  
  /** Metadata */
  metadata: Record<string, any>;
}

export interface Catalog {
  /** Catalog ID */
  id: string;
  
  /** Catalog name */
  name: string;
  
  /** Catalog description */
  description: string;
  
  /** Content items */
  items: ContentItem[];
  
  /** Playlists */
  playlists: Playlist[];
  
  /** Organization */
  organization: {
    byLevel: Map<ContentLevel, ContentItem[]>;
    byType: Map<ContentType, ContentItem[]>;
    byOctave: Map<number, ContentItem[]>;
    bySingularity: Map<number, ContentItem[]>;
  };
  
  /** Metadata */
  metadata: Record<string, any>;
}

export interface BroadcastSystem {
  /** System ID */
  id: string;
  
  /** System name */
  name: string;
  
  /** System description */
  description: string;
  
  /** Catalogs */
  catalogs: Catalog[];
  
  /** Playlists */
  playlists: Playlist[];
  
  /** Content items */
  contentItems: ContentItem[];
  
  /** Distribution channels */
  channels: {
    users: string[];
    vibespheres: string[];
    panels: string[];
    consoles: string[];
    feeds: string[];
    series: string[];
    novels: string[];
    curriculums: string[];
  };
  
  /** Metadata */
  metadata: Record<string, any>;
}

/**
 * Broadcast Division System
 * 
 * Organizes and distributes content across all octaves and singularities
 */
export class BroadcastDivisionSystem {
  private systems: Map<string, BroadcastSystem>;
  private contentItems: Map<string, ContentItem>;
  private playlists: Map<string, Playlist>;
  private catalogs: Map<string, Catalog>;
  
  constructor() {
    this.systems = new Map();
    this.contentItems = new Map();
    this.playlists = new Map();
    this.catalogs = new Map();
    this.initializeDefaultSystem();
  }
  
  /**
   * Initialize default broadcast system
   */
  private initializeDefaultSystem(): void {
    const defaultSystem: BroadcastSystem = {
      id: 'broadcast-division-main',
      name: 'Broadcast Division Main System',
      description: 'Main broadcast division system for all content distribution',
      catalogs: [],
      playlists: [],
      contentItems: [],
      channels: {
        users: [],
        vibespheres: [],
        panels: [],
        consoles: [],
        feeds: [],
        series: [],
        novels: [],
        curriculums: []
      },
      metadata: {}
    };
    
    this.systems.set(defaultSystem.id, defaultSystem);
  }
  
  /**
   * Add content item
   */
  addContentItem(item: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>): ContentItem {
    const fullItem: ContentItem = {
      ...item,
      id: `content-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    this.contentItems.set(fullItem.id, fullItem);
    
    // Add to default system
    const system = this.systems.get('broadcast-division-main');
    if (system) {
      system.contentItems.push(fullItem);
    }
    
    return fullItem;
  }
  
  /**
   * Create playlist
   */
  createPlaylist(
    name: string,
    description: string,
    items: ContentItem[],
    targetAudience: ContentLevel[],
    octaveRange: { min: number; max: number },
    singularityRange: { min: number; min: number },
    order: Playlist['order'] = 'sequential'
  ): Playlist {
    const playlist: Playlist = {
      id: `playlist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      items,
      targetAudience,
      octaveRange,
      singularityRange,
      order,
      metadata: {}
    };
    
    this.playlists.set(playlist.id, playlist);
    
    // Add to default system
    const system = this.systems.get('broadcast-division-main');
    if (system) {
      system.playlists.push(playlist);
    }
    
    return playlist;
  }
  
  /**
   * Create catalog
   */
  createCatalog(
    name: string,
    description: string,
    items: ContentItem[],
    playlists: Playlist[] = []
  ): Catalog {
    // Organize content
    const organization = {
      byLevel: new Map<ContentLevel, ContentItem[]>(),
      byType: new Map<ContentType, ContentItem[]>(),
      byOctave: new Map<number, ContentItem[]>(),
      bySingularity: new Map<number, ContentItem[]>()
    };
    
    // Organize by level
    for (const level of ['age-10', 'beginner', 'intermediate', 'advanced', 'expert', 'frontier-research'] as ContentLevel[]) {
      organization.byLevel.set(level, items.filter(item => item.level === level));
    }
    
    // Organize by type
    for (const type of ['feed', 'series', 'novel', 'curriculum', 'panel', 'console', 'vibesphere', 'documentation', 'research', 'tutorial', 'story', 'protocol'] as ContentType[]) {
      organization.byType.set(type, items.filter(item => item.type === type));
    }
    
    // Organize by octave
    for (const item of items) {
      const octaveItems = organization.byOctave.get(item.octave) || [];
      octaveItems.push(item);
      organization.byOctave.set(item.octave, octaveItems);
    }
    
    // Organize by singularity
    for (const item of items) {
      const singularityItems = organization.bySingularity.get(item.singularity) || [];
      singularityItems.push(item);
      organization.bySingularity.set(item.singularity, singularityItems);
    }
    
    const catalog: Catalog = {
      id: `catalog-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      items,
      playlists,
      organization,
      metadata: {}
    };
    
    this.catalogs.set(catalog.id, catalog);
    
    // Add to default system
    const system = this.systems.get('broadcast-division-main');
    if (system) {
      system.catalogs.push(catalog);
    }
    
    return catalog;
  }
  
  /**
   * Get content by level
   */
  getContentByLevel(level: ContentLevel): ContentItem[] {
    return Array.from(this.contentItems.values())
      .filter(item => item.level === level);
  }
  
  /**
   * Get content by type
   */
  getContentByType(type: ContentType): ContentItem[] {
    return Array.from(this.contentItems.values())
      .filter(item => item.type === type);
  }
  
  /**
   * Get content by octave
   */
  getContentByOctave(octave: number): ContentItem[] {
    return Array.from(this.contentItems.values())
      .filter(item => item.octave === octave);
  }
  
  /**
   * Get content by singularity
   */
  getContentBySingularity(singularity: number): ContentItem[] {
    return Array.from(this.contentItems.values())
      .filter(item => item.singularity === singularity);
  }
  
  /**
   * Get content for target audience
   */
  getContentForAudience(
    level: ContentLevel,
    octave?: number,
    singularity?: number
  ): ContentItem[] {
    let items = Array.from(this.contentItems.values())
      .filter(item => item.level === level);
    
    if (octave !== undefined) {
      items = items.filter(item => item.octave === octave);
    }
    
    if (singularity !== undefined) {
      items = items.filter(item => item.singularity === singularity);
    }
    
    return items;
  }
  
  /**
   * Get playlist
   */
  getPlaylist(playlistId: string): Playlist | undefined {
    return this.playlists.get(playlistId);
  }
  
  /**
   * Get catalog
   */
  getCatalog(catalogId: string): Catalog | undefined {
    return this.catalogs.get(catalogId);
  }
  
  /**
   * Get broadcast system
   */
  getSystem(systemId: string): BroadcastSystem | undefined {
    return this.systems.get(systemId);
  }
  
  /**
   * Distribute content to channel
   */
  distributeToChannel(
    contentId: string,
    channel: keyof BroadcastSystem['channels']
  ): void {
    const system = this.systems.get('broadcast-division-main');
    if (!system) return;
    
    const content = this.contentItems.get(contentId);
    if (!content) return;
    
    // Add to channel
    if (!system.channels[channel].includes(contentId)) {
      system.channels[channel].push(contentId);
    }
  }
  
  /**
   * Get all content items
   */
  getAllContentItems(): ContentItem[] {
    return Array.from(this.contentItems.values());
  }
  
  /**
   * Get all playlists
   */
  getAllPlaylists(): Playlist[] {
    return Array.from(this.playlists.values());
  }
  
  /**
   * Get all catalogs
   */
  getAllCatalogs(): Catalog[] {
    return Array.from(this.catalogs.values());
  }
}

// Export singleton
export const broadcastDivision = new BroadcastDivisionSystem();
