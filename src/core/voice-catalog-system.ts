/**
 * VOICE-ENABLED UNIVERSAL CATALOG SYSTEM
 * 
 * Provides spoken output for text streams and complete catalog access
 * with auto-updating pricing and downloadable brochure
 * 
 * @module VoiceCatalogSystem
 */

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface VoiceOutputSystem {
  engine: VoiceEngine;
  voices: VoiceProfile[];
  currentVoice: VoiceProfile;
  queue: SpeechQueue;
  controls: VoiceControls;
}

export interface VoiceEngine {
  provider: 'Web Speech API' | 'Azure' | 'Google' | 'ElevenLabs';
  quality: 'standard' | 'premium' | 'neural';
  languages: string[];
  features: VoiceFeatures;
}

export interface VoiceProfile {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'neutral';
  accent: string;
  pitch: number;        // 0.5 - 2.0
  rate: number;         // 0.5 - 2.0
  volume: number;       // 0 - 1.0
  personality: string;
}

export interface VoiceFeatures {
  realTimeSynthesis: boolean;
  streamSupport: boolean;
  queueManagement: boolean;
  interruptSupport: boolean;
  emotionDetection: boolean;
  multiLanguage: boolean;
}

export interface VoiceControls {
  play: () => void;
  pause: () => void;
  stop: () => void;
  skip: () => void;
  volumeUp: () => void;
  volumeDown: () => void;
  speedUp: () => void;
  speedDown: () => void;
}

export interface SpeechQueue {
  items: SpeechQueueItem[];
  currentIndex: number;
  isPlaying: boolean;
}

export interface SpeechQueueItem {
  id: string;
  text: string;
  priority: 'low' | 'medium' | 'high';
  timestamp: Date;
  options?: SpeechOptions;
}

export interface SpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: string;
  lang?: string;
}

export interface CatalogItem {
  id: string;
  name: string;
  description: string;
  category: string;
  price: PricingTier;
  features: string[];
  isNew: boolean;
  lastUpdated: Date;
}

export interface PricingTier {
  free?: number;
  basic?: number;
  premium?: number;
  enterprise?: number | 'custom';
  currency: string;
  billingCycle: 'monthly' | 'annual' | 'one-time';
}

export interface CatalogCategory {
  id: string;
  name: string;
  icon: string;
  items: CatalogItem[];
  order: number;
}

export interface BrochureContent {
  cover: CoverPage;
  intro: IntroductionSection;
  catalog: CompleteCatalog;
  pricing: PricingTables;
  bundles: PackageOffers;
  contact: ContactInformation;
}

export interface CoverPage {
  title: string;
  subtitle: string;
  version: string;
  date: Date;
  logo: string;
}

export interface CompleteCatalog {
  categories: CatalogCategory[];
  totalItems: number;
  lastUpdated: Date;
}

// ============================================================================
// VOICE OUTPUT ENGINE
// ============================================================================

export class VoiceOutputEngine {
  private synthesis: SpeechSynthesis;
  private voices: SpeechSynthesisVoice[];
  private currentVoice: SpeechSynthesisVoice | null;
  private queue: SpeechQueue;
  private enabled: boolean;
  private currentUtterance: SpeechSynthesisUtterance | null;

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.voices = [];
    this.currentVoice = null;
    this.queue = {
      items: [],
      currentIndex: 0,
      isPlaying: false
    };
    this.enabled = false;
    this.currentUtterance = null;

    this.initializeVoices();
  }

  private initializeVoices(): void {
    const loadVoices = () => {
      this.voices = this.synthesis.getVoices();
      // Prefer natural-sounding voices
      this.currentVoice = this.voices.find(v => 
        v.name.includes('Natural') || v.name.includes('Premium')
      ) || this.voices[0];
    };

    if (this.synthesis.onvoiceschanged !== undefined) {
      this.synthesis.onvoiceschanged = loadVoices;
    }
    loadVoices();
  }

  /**
   * Enable or disable voice output
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (!enabled) {
      this.stop();
    }
  }

  /**
   * Speak text immediately
   */
  speak(text: string, options?: SpeechOptions): void {
    if (!this.enabled) return;

    this.stop(); // Stop any current speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = this.currentVoice;
    utterance.rate = options?.rate || 1.0;
    utterance.pitch = options?.pitch || 1.0;
    utterance.volume = options?.volume || 1.0;
    utterance.lang = options?.lang || 'en-US';

    this.currentUtterance = utterance;
    this.synthesis.speak(utterance);
  }

  /**
   * Add text to speech queue
   */
  enqueue(text: string, priority: 'low' | 'medium' | 'high' = 'medium', options?: SpeechOptions): void {
    const item: SpeechQueueItem = {
      id: this.generateId(),
      text,
      priority,
      timestamp: new Date(),
      options
    };

    // Insert based on priority
    if (priority === 'high') {
      this.queue.items.unshift(item);
    } else {
      this.queue.items.push(item);
    }

    if (!this.queue.isPlaying) {
      this.processQueue();
    }
  }

  /**
   * Process speech queue
   */
  private async processQueue(): Promise<void> {
    if (this.queue.items.length === 0) {
      this.queue.isPlaying = false;
      return;
    }

    this.queue.isPlaying = true;
    const item = this.queue.items[this.queue.currentIndex];

    await this.speakItem(item);

    this.queue.items.splice(this.queue.currentIndex, 1);
    
    if (this.queue.items.length > 0) {
      this.processQueue();
    } else {
      this.queue.isPlaying = false;
    }
  }

  private speakItem(item: SpeechQueueItem): Promise<void> {
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(item.text);
      utterance.voice = this.currentVoice;
      utterance.rate = item.options?.rate || 1.0;
      utterance.pitch = item.options?.pitch || 1.0;
      utterance.volume = item.options?.volume || 1.0;
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      this.synthesis.speak(utterance);
    });
  }

  /**
   * Stop current speech
   */
  stop(): void {
    if (this.synthesis.speaking) {
      this.synthesis.cancel();
    }
    this.currentUtterance = null;
  }

  /**
   * Pause current speech
   */
  pause(): void {
    if (this.synthesis.speaking) {
      this.synthesis.pause();
    }
  }

  /**
   * Resume paused speech
   */
  resume(): void {
    if (this.synthesis.paused) {
      this.synthesis.resume();
    }
  }

  /**
   * Clear speech queue
   */
  clearQueue(): void {
    this.queue.items = [];
    this.queue.currentIndex = 0;
    this.queue.isPlaying = false;
  }

  /**
   * Check if currently speaking
   */
  isSpeaking(): boolean {
    return this.synthesis.speaking;
  }

  private generateId(): string {
    return `speech_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// ============================================================================
// CATALOG MANAGER
// ============================================================================

export class CatalogManager {
  private categories: Map<string, CatalogCategory>;
  private items: Map<string, CatalogItem>;
  private lastUpdate: Date;
  private updateInterval: number;
  private updateCallbacks: Array<(updates: CatalogItem[]) => void>;

  constructor(updateInterval: number = 30000) {
    this.categories = new Map();
    this.items = new Map();
    this.lastUpdate = new Date();
    this.updateInterval = updateInterval;
    this.updateCallbacks = [];

    this.initializeCatalog();
    this.startAutoUpdate();
  }

  private initializeCatalog(): void {
    // Initialize with complete Syntheverse-Vibeverse catalog
    this.addCategory({
      id: 'resort',
      name: 'Resort & Campus Experiences',
      icon: '🏖️',
      items: [],
      order: 1
    });

    this.addCategory({
      id: 'creator-tools',
      name: 'Creator Tools & Services',
      icon: '🛠️',
      items: [],
      order: 2
    });

    this.addCategory({
      id: 'companions',
      name: 'Companion Experiences',
      icon: '🤝',
      items: [],
      order: 3
    });

    this.addCategory({
      id: 'enterprise',
      name: 'Enterprise Solutions',
      icon: '🏢',
      items: [],
      order: 4
    });

    this.addCategory({
      id: 'bundles',
      name: 'Bundle Packages',
      icon: '🎁',
      items: [],
      order: 5
    });

    this.loadInitialCatalogData();
  }

  private loadInitialCatalogData(): void {
    // Resort & Campus
    this.addItem('resort', {
      id: 'man-cave-cabaret',
      name: 'Man Cave Cabaret Live Entertainment',
      description: 'Live performances, holographic entertainment, multi-octave experience levels, and full sensory reality options',
      category: 'resort',
      price: {
        free: 0,
        premium: 49,
        enterprise: 199,
        currency: 'USD',
        billingCycle: 'monthly'
      },
      features: ['Live performances', 'Holographic entertainment', 'Multi-octave levels'],
      isNew: false,
      lastUpdated: new Date()
    });

    this.addItem('resort', {
      id: 'taino-clinic',
      name: 'Taíno Shaman Wellness Clinic',
      description: 'Traditional Taíno healing, holographic therapy sessions, botanical remedies, and energy balancing',
      category: 'resort',
      price: {
        basic: 75,
        premium: 149,
        currency: 'USD',
        billingCycle: 'monthly'
      },
      features: ['Traditional healing', 'Holographic therapy', 'Botanical remedies'],
      isNew: false,
      lastUpdated: new Date()
    });

    this.addItem('resort', {
      id: 'campus-cinema',
      name: 'Campus Cinema Experience',
      description: 'Netflix-style catalog with variable octave playback, custom clock speeds, and density selection',
      category: 'resort',
      price: {
        free: 0,
        premium: 29,
        enterprise: 99,
        currency: 'USD',
        billingCycle: 'monthly'
      },
      features: ['Netflix-style viewing', 'Variable octave', 'Custom playback'],
      isNew: false,
      lastUpdated: new Date()
    });

    this.addItem('resort', {
      id: 'creator-studio',
      name: 'Animation & Content Studio',
      description: 'Professional creation platform with frame-by-frame editing, VIBEFRAME support, and multi-layer compositing',
      category: 'resort',
      price: {
        free: 0,
        premium: 29,
        enterprise: 99,
        currency: 'USD',
        billingCycle: 'monthly'
      },
      features: ['Frame creation', 'VIBEFRAME editing', 'Multi-layer compositing'],
      isNew: true,
      lastUpdated: new Date()
    });

    // Creator Tools
    this.addItem('creator-tools', {
      id: 'snap-engine',
      name: 'SNAP Creator Language',
      description: 'No-code application builder that converts natural language to working applications in minutes',
      category: 'creator-tools',
      price: {
        free: 0,
        premium: 49,
        enterprise: 499,
        currency: 'USD',
        billingCycle: 'monthly'
      },
      features: ['No-code apps', 'Natural language', 'Minutes to deploy'],
      isNew: true,
      lastUpdated: new Date()
    });

    this.addItem('creator-tools', {
      id: 'vibeframe-editor',
      name: 'VIBEFRAME Drag & Drop Editor',
      description: '7-layer nested reality editor with professional timeline and multi-format export',
      category: 'creator-tools',
      price: {
        premium: 39,
        currency: 'USD',
        billingCycle: 'monthly'
      },
      features: ['7 nested shells', 'Drag-and-drop', 'Professional timeline'],
      isNew: true,
      lastUpdated: new Date()
    });

    this.addItem('creator-tools', {
      id: 'mycelial-network',
      name: 'Mycelial Network Access',
      description: 'Living network navigation with seed edges, natural pathways, and auto-discovery',
      category: 'creator-tools',
      price: {
        free: 0,
        premium: 19,
        currency: 'USD',
        billingCycle: 'monthly'
      },
      features: ['Natural navigation', 'Auto-discovery', 'Path visualization'],
      isNew: false,
      lastUpdated: new Date()
    });

    // Bundles
    this.addItem('bundles', {
      id: 'starter-bundle',
      name: 'Syntheverse Starter',
      description: 'Includes Campus Cinema, Creator Studio, SNAP Engine, Mycelial Network, and basic companions',
      category: 'bundles',
      price: {
        premium: 99,
        currency: 'USD',
        billingCycle: 'monthly'
      },
      features: ['5 services included', 'Save $45/month'],
      isNew: false,
      lastUpdated: new Date()
    });

    this.addItem('bundles', {
      id: 'creator-bundle',
      name: 'Syntheverse Creator',
      description: 'All Starter features plus VIBEFRAME Editor, Man Cave Premium, Wellness Clinic, and priority support',
      category: 'bundles',
      price: {
        premium: 199,
        currency: 'USD',
        billingCycle: 'monthly'
      },
      features: ['9 services included', 'Save $127/month'],
      isNew: false,
      lastUpdated: new Date()
    });

    this.addItem('bundles', {
      id: 'ultimate-bundle',
      name: 'Syntheverse Ultimate',
      description: 'All Creator features plus Man Cave VIP, unlimited wellness, Hero Host consulting, and white-glove support',
      category: 'bundles',
      price: {
        enterprise: 399,
        currency: 'USD',
        billingCycle: 'monthly'
      },
      features: ['Complete access', 'Save $350+/month'],
      isNew: false,
      lastUpdated: new Date()
    });
  }

  private addCategory(category: CatalogCategory): void {
    this.categories.set(category.id, category);
  }

  private addItem(categoryId: string, item: CatalogItem): void {
    this.items.set(item.id, item);
    const category = this.categories.get(categoryId);
    if (category) {
      category.items.push(item);
    }
  }

  /**
   * Get all categories
   */
  getCategories(): CatalogCategory[] {
    return Array.from(this.categories.values()).sort((a, b) => a.order - b.order);
  }

  /**
   * Get items by category
   */
  getCategoryItems(categoryId: string): CatalogItem[] {
    const category = this.categories.get(categoryId);
    return category ? category.items : [];
  }

  /**
   * Get item by ID
   */
  getItem(itemId: string): CatalogItem | undefined {
    return this.items.get(itemId);
  }

  /**
   * Register callback for catalog updates
   */
  onUpdate(callback: (updates: CatalogItem[]) => void): void {
    this.updateCallbacks.push(callback);
  }

  /**
   * Start automatic update checking
   */
  private startAutoUpdate(): void {
    setInterval(() => {
      this.checkForUpdates();
    }, this.updateInterval);
  }

  /**
   * Check for catalog updates
   */
  private async checkForUpdates(): Promise<void> {
    // In production, would fetch from server
    // For now, simulates update detection
    console.log('🔄 Checking for catalog updates...');
  }

  /**
   * Notify callbacks of updates
   */
  private notifyUpdates(updates: CatalogItem[]): void {
    this.updateCallbacks.forEach(callback => callback(updates));
  }

  /**
   * Get complete catalog for brochure
   */
  getCompleteCatalog(): CompleteCatalog {
    return {
      categories: this.getCategories(),
      totalItems: this.items.size,
      lastUpdated: this.lastUpdate
    };
  }
}

// ============================================================================
// BROCHURE GENERATOR
// ============================================================================

export class BrochureGenerator {
  private catalog: CatalogManager;

  constructor(catalog: CatalogManager) {
    this.catalog = catalog;
  }

  /**
   * Generate brochure content
   */
  generateContent(): BrochureContent {
    return {
      cover: this.generateCover(),
      intro: this.generateIntro(),
      catalog: this.catalog.getCompleteCatalog(),
      pricing: this.generatePricingTables(),
      bundles: this.generateBundleOffers(),
      contact: this.generateContactInfo()
    };
  }

  /**
   * Generate PDF brochure
   */
  async generatePDF(): Promise<Blob> {
    const content = this.generateContent();
    // In production, would use PDF library to generate
    const pdfContent = this.formatAsPDF(content);
    return new Blob([pdfContent], { type: 'application/pdf' });
  }

  /**
   * Generate HTML brochure
   */
  generateHTML(): string {
    const content = this.generateContent();
    return this.formatAsHTML(content);
  }

  private generateCover(): CoverPage {
    return {
      title: 'Syntheverse-Vibeverse Complete Catalog',
      subtitle: 'Resort, Campus & Creator Ecosystem',
      version: '1.0',
      date: new Date(),
      logo: '🌐'
    };
  }

  private generateIntro(): IntroductionSection {
    return {
      welcome: 'Welcome to Post-Singularity Earth',
      description: 'Complete catalog of all offerings, services, and experiences',
      highlights: [
        'Live entertainment venues',
        'Wellness and healing',
        'Content creation tools',
        'No-code development',
        'Enterprise solutions'
      ]
    };
  }

  private generatePricingTables(): PricingTables {
    // Implementation would generate comprehensive pricing tables
    return {};
  }

  private generateBundleOffers(): PackageOffers {
    // Implementation would generate bundle comparison tables
    return {};
  }

  private generateContactInfo(): ContactInformation {
    return {
      email: 'contact@syntheverse.com',
      website: 'https://syntheverse.com',
      support: '24/7 available'
    };
  }

  private formatAsPDF(content: BrochureContent): string {
    // Simplified - in production would use proper PDF library
    return JSON.stringify(content);
  }

  private formatAsHTML(content: BrochureContent): string {
    // Generate HTML brochure
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${content.cover.title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            h1 { color: #4facfe; }
            .category { margin: 20px 0; }
          </style>
        </head>
        <body>
          <h1>${content.cover.title}</h1>
          <p>${content.cover.subtitle}</p>
          <!-- More content here -->
        </body>
      </html>
    `;
  }
}

// ============================================================================
// VOICE CATALOG SYSTEM (Main Integration)
// ============================================================================

export class VoiceCatalogSystem {
  private voice: VoiceOutputEngine;
  private catalog: CatalogManager;
  private brochure: BrochureGenerator;

  constructor() {
    this.voice = new VoiceOutputEngine();
    this.catalog = new CatalogManager();
    this.brochure = new BrochureGenerator(this.catalog);

    this.setupUpdateNotifications();
  }

  /**
   * Enable voice output
   */
  enableVoice(): void {
    this.voice.setEnabled(true);
    this.voice.speak('Voice output enabled. Click any catalog item to hear its description.');
  }

  /**
   * Disable voice output
   */
  disableVoice(): void {
    this.voice.setEnabled(false);
  }

  /**
   * Speak catalog item description
   */
  speakItem(itemId: string): void {
    const item = this.catalog.getItem(itemId);
    if (item) {
      const text = `${item.name}. ${item.description}. Pricing: ${this.formatPrice(item.price)}`;
      this.voice.speak(text);
    }
  }

  /**
   * Speak category name
   */
  speakCategory(categoryId: string): void {
    const categories = this.catalog.getCategories();
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      this.voice.speak(`${category.name} category`);
    }
  }

  /**
   * Download brochure
   */
  async downloadBrochure(format: 'pdf' | 'html' = 'pdf'): Promise<void> {
    this.voice.speak('Generating your complete catalog brochure. Download will begin shortly.');

    if (format === 'pdf') {
      const blob = await this.brochure.generatePDF();
      this.triggerDownload(blob, 'Syntheverse-Vibeverse-Catalog-2026.pdf');
    } else {
      const html = this.brochure.generateHTML();
      const blob = new Blob([html], { type: 'text/html' });
      this.triggerDownload(blob, 'Syntheverse-Vibeverse-Catalog-2026.html');
    }

    this.voice.speak('Download complete! Your catalog is ready.');
  }

  /**
   * Get catalog for display
   */
  getCatalog(): CompleteCatalog {
    return this.catalog.getCompleteCatalog();
  }

  private setupUpdateNotifications(): void {
    this.catalog.onUpdate((updates) => {
      if (updates.length > 0) {
        const text = `New updates available: ${updates.map(u => u.name).join(', ')}`;
        this.voice.enqueue(text, 'high');
      }
    });
  }

  private formatPrice(price: PricingTier): string {
    if (price.free !== undefined) {
      return 'Free tier available';
    } else if (price.premium) {
      return `$${price.premium} per ${price.billingCycle === 'monthly' ? 'month' : 'year'}`;
    } else if (price.enterprise) {
      return price.enterprise === 'custom' ? 'Custom pricing' : `$${price.enterprise} per ${price.billingCycle === 'monthly' ? 'month' : 'year'}`;
    }
    return 'Contact for pricing';
  }

  private triggerDownload(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// ============================================================================
// HELPER TYPES
// ============================================================================

interface IntroductionSection {
  welcome: string;
  description: string;
  highlights: string[];
}

interface PricingTables {
  [key: string]: any;
}

interface PackageOffers {
  [key: string]: any;
}

interface ContactInformation {
  email: string;
  website: string;
  support: string;
}

// ============================================================================
// EXPORT
// ============================================================================

export default VoiceCatalogSystem;
