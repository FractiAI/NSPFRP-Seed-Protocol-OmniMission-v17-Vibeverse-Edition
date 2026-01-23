/**
 * SYNTHEVERSE SHOPPING CHANNEL
 * Complete online marketplace - like Amazon for the Syntheverse
 * 
 * 🌌 IMAGINARY MARKETPLACE NOTICE:
 * All products, properties, and experiences are IMAGINARY OFFERINGS
 * within the fictional Syntheverse universe. Like items in a game store.
 * NOT actual e-commerce. Creative worldbuilding only.
 * 
 * 5-STAR CATALOG EXPERIENCE
 * Auto-populates as creators publish
 * Studio creators earn from sales
 * Shop button on all surfaces
 * 98% sweetspot tuned
 */

export interface CatalogItem {
  itemId: string;
  type: 'property' | 'product' | 'experience' | 'service' | 'franchise' | 'adventure' | 'membership' | 'vchip' | 'nft';
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  imaginary: boolean; // Always true
  resonance: number; // 98% sweetspot
  creator: {
    creatorId: string;
    studioName: string;
    verified: boolean;
    rating: number; // 0-5 stars
  };
  pricing: {
    usd: number;
    synth: number;
    imaginaryCurrency: boolean; // Always true
    tierDiscounts: {
      [tier: string]: number; // Percentage discount
    };
  };
  media: {
    primaryImage: string;
    gallery: string[];
    video?: string;
    virtual3D?: string;
  };
  features: string[];
  specifications: { [key: string]: any };
  ratings: {
    average: number; // 0-5 stars
    count: number;
    distribution: { [stars: number]: number }; // 5→4→3→2→1
  };
  inventory: {
    available: boolean;
    quantity?: number; // undefined = unlimited (digital)
    limited: boolean;
  };
  tags: string[];
  publishedAt: Date;
  updatedAt: Date;
  featured: boolean;
  bestseller: boolean;
}

export interface PropertyListing extends CatalogItem {
  type: 'property';
  propertyDetails: {
    location: string; // Imaginary location in Syntheverse
    size: string; // sq ft or acres
    bedrooms?: number;
    bathrooms?: number;
    amenities: string[];
    propertyType: 'residential' | 'commercial' | 'land' | 'node' | 'virtual';
    coordinates?: { x: number; y: number; z: number }; // Virtual coordinates
  };
}

export interface ProductListing extends CatalogItem {
  type: 'product';
  productDetails: {
    brand: string;
    model?: string;
    dimensions?: { width: number; height: number; depth: number; unit: string };
    weight?: { value: number; unit: string };
    materials?: string[];
    colors?: string[];
    sizes?: string[];
  };
}

export interface ExperienceListing extends CatalogItem {
  type: 'experience';
  experienceDetails: {
    duration: string;
    participants: { min: number; max: number };
    difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    location: string;
    included: string[];
    requirements: string[];
    adventureReady: boolean;
  };
}

export interface CreatorStudio {
  studioId: string;
  creatorId: string;
  studioName: string;
  description: string;
  verified: boolean;
  rating: {
    average: number;
    count: number;
  };
  totalSales: number;
  totalEarnings: {
    usd: number;
    synth: number;
    imaginary: boolean;
  };
  publishedItems: string[]; // Item IDs
  revenueShare: number; // Percentage (typically 70-80%)
  joinedAt: Date;
  contact: {
    email: string;
    website?: string;
    social?: { [platform: string]: string };
  };
}

export interface ShoppingCart {
  cartId: string;
  userId: string;
  items: Array<{
    itemId: string;
    quantity: number;
    price: number;
    currency: 'usd' | 'synth';
  }>;
  subtotal: { usd: number; synth: number };
  discounts: { usd: number; synth: number };
  total: { usd: number; synth: number };
  updatedAt: Date;
}

export interface Order {
  orderId: string;
  userId: string;
  items: Array<{
    itemId: string;
    name: string;
    quantity: number;
    price: number;
    currency: string;
    creator: {
      creatorId: string;
      studioName: string;
      earnings: number;
    };
  }>;
  total: { usd: number; synth: number };
  status: 'pending' | 'processing' | 'completed' | 'delivered' | 'cancelled';
  paymentMethod: string;
  createdAt: Date;
  completedAt?: Date;
  imaginaryTransaction: boolean; // Always true
}

export interface CatalogFilters {
  type?: string[];
  category?: string[];
  priceRange?: { min: number; max: number };
  rating?: number; // Minimum rating
  creator?: string;
  tags?: string[];
  featured?: boolean;
  bestseller?: boolean;
  available?: boolean;
}

/**
 * Syntheverse Shopping Channel System
 * Complete marketplace with auto-population and creator earnings
 */
export class SyntherverseShoppingChannel {
  private readonly SWEETSPOT = 0.98;
  private readonly CREATOR_REVENUE_SHARE = 0.75; // 75% to creator, 25% to platform
  
  private catalog: Map<string, CatalogItem> = new Map();
  private creators: Map<string, CreatorStudio> = new Map();
  private carts: Map<string, ShoppingCart> = new Map();
  private orders: Map<string, Order> = new Map();

  constructor() {
    this.autoPopulateCatalog();
  }

  /**
   * Auto-populate catalog with all existing products/experiences
   */
  private autoPopulateCatalog(): void {
    console.log('🛍️ Auto-populating Syntheverse Shopping Channel...');

    // Auto-add merchandise
    this.addWalletsToLuggage();
    
    // Auto-add adventures
    this.addFrontierAdventures();
    
    // Auto-add experiences
    this.addManCaveExperiences();
    
    // Auto-add franchises
    this.addFranchiseOpportunities();
    
    // Auto-add memberships
    this.addMembershipTiers();
    
    // Auto-add vCHIPs
    this.addVCHIPProducts();
    
    // Auto-add wellness services
    this.addWellnessServices();
    
    console.log(`✅ ${this.catalog.size} items auto-populated in catalog`);
  }

  /**
   * Add wallets and luggage to catalog
   */
  private addWalletsToLuggage(): void {
    // SYNTH Cold Storage Wallet
    this.catalog.set('product-wallet-synth-cold', {
      itemId: 'product-wallet-synth-cold',
      type: 'product',
      name: 'SYNTH Cold Storage Wallet (Imaginary)',
      description: 'Hardware wallet for SYNTH, vCHIPs, and awareness keys. Military-grade encryption.',
      category: 'Wallets & Accessories',
      subcategory: 'Crypto Wallets',
      imaginary: true,
      resonance: this.SWEETSPOT,
      creator: {
        creatorId: 'creator-syntheverse',
        studioName: 'Syntheverse Studios',
        verified: true,
        rating: 5.0
      },
      pricing: {
        usd: 149,
        synth: 149,
        imaginaryCurrency: true,
        tierDiscounts: {
          'Cloud': 0.10,
          'Shell': 0.15,
          'Backstage': 0.20,
          'Ultimate VIP': 0.25
        }
      },
      media: {
        primaryImage: '/products/synth-cold-wallet.png',
        gallery: ['/products/synth-cold-wallet-1.png', '/products/synth-cold-wallet-2.png'],
        video: '/products/synth-cold-wallet-demo.mp4'
      },
      features: [
        'SYNTH native support',
        'vCHIP storage',
        'Awareness key vault',
        'Multi-signature',
        'Biometric unlock',
        'Air-gapped security',
        'NSPFRNP protocol integration'
      ],
      specifications: {
        dimensions: '6cm × 9cm × 1cm',
        weight: '45g',
        material: 'Anodized aluminum',
        supported_crypto: ['SYNTH', 'ETH', 'BTC', 'USDC']
      },
      ratings: {
        average: 4.9,
        count: 128,
        distribution: { 5: 115, 4: 10, 3: 2, 2: 1, 1: 0 }
      },
      inventory: {
        available: true,
        quantity: undefined, // Digital/unlimited
        limited: false
      },
      tags: ['wallet', 'crypto', 'synth', 'security', 'hardware', 'cold-storage'],
      publishedAt: new Date('2026-01-21'),
      updatedAt: new Date(),
      featured: true,
      bestseller: true
    });

    // Frontier Expedition Pack
    this.catalog.set('product-luggage-frontier', {
      itemId: 'product-luggage-frontier',
      type: 'product',
      name: 'Frontier Adventures Expedition Pack (Imaginary)',
      description: 'Ready for all 18 catalog adventures. Safari-grade, yacht-approved, El Taino compatible.',
      category: 'Luggage & Travel',
      subcategory: 'Adventure Backpacks',
      imaginary: true,
      resonance: this.SWEETSPOT,
      creator: {
        creatorId: 'creator-frontier',
        studioName: 'Frontier Adventures Studio',
        verified: true,
        rating: 4.95
      },
      pricing: {
        usd: 299,
        synth: 299,
        imaginaryCurrency: true,
        tierDiscounts: {
          'Cloud': 0.10,
          'Shell': 0.15,
          'Backstage': 0.20,
          'Ultimate VIP': 0.30
        }
      },
      media: {
        primaryImage: '/products/frontier-expedition-pack.png',
        gallery: ['/products/frontier-pack-1.png', '/products/frontier-pack-2.png'],
        virtual3D: '/products/frontier-pack-3d.glb'
      },
      features: [
        '65L capacity',
        'NSPFRNP-secured compartments',
        'Modular MOLLE webbing',
        'Hydration compatible',
        'Rain cover included',
        'Safari-grade durability',
        'El Taino compatible'
      ],
      specifications: {
        capacity: '65L',
        max_weight: '30kg',
        dimensions: '35cm × 65cm × 28cm',
        empty_weight: '2.5kg',
        material: 'Ripstop nylon + leather accents'
      },
      ratings: {
        average: 4.8,
        count: 87,
        distribution: { 5: 72, 4: 12, 3: 2, 2: 1, 1: 0 }
      },
      inventory: {
        available: true,
        limited: false
      },
      tags: ['luggage', 'backpack', 'adventure', 'safari', 'frontier', 'travel'],
      publishedAt: new Date('2026-01-21'),
      updatedAt: new Date(),
      featured: true,
      bestseller: true
    });

    console.log('  ✅ Wallets and luggage added to catalog');
  }

  /**
   * Add Frontier Adventures to catalog
   */
  private addFrontierAdventures(): void {
    // Alaska King Salmon & Halibut
    this.catalog.set('experience-alaska-fishing', {
      itemId: 'experience-alaska-fishing',
      type: 'experience',
      name: 'Alaska King Salmon & Halibut 5-Star Lodge (Imaginary)',
      description: 'Fly-in 5-star fishing lodge. Trophy salmon and halibut. 7 days all-inclusive.',
      category: 'Adventures & Experiences',
      subcategory: 'Fishing Expeditions',
      imaginary: true,
      resonance: this.SWEETSPOT,
      creator: {
        creatorId: 'creator-frontier',
        studioName: 'Frontier Adventures Studio',
        verified: true,
        rating: 5.0
      },
      pricing: {
        usd: 8500,
        synth: 8500,
        imaginaryCurrency: true,
        tierDiscounts: {
          'Cloud': 0.10,
          'Shell': 0.15,
          'Backstage': 0.20,
          'Ultimate VIP': 0.30
        }
      },
      media: {
        primaryImage: '/adventures/alaska-fishing.jpg',
        gallery: ['/adventures/alaska-1.jpg', '/adventures/alaska-2.jpg'],
        video: '/adventures/alaska-promo.mp4'
      },
      features: [
        'Fly-in 5-star lodge',
        'All meals included',
        'Professional guides',
        'Trophy salmon & halibut',
        'All gear provided',
        'Photos & videos included',
        '7 days / 6 nights'
      ],
      specifications: {
        duration: '7 days / 6 nights',
        participants: { min: 1, max: 8 },
        difficulty: 'intermediate',
        location: 'Bristol Bay, Alaska (Imaginary)',
        season: 'June - September'
      },
      ratings: {
        average: 5.0,
        count: 24,
        distribution: { 5: 24, 4: 0, 3: 0, 2: 0, 1: 0 }
      },
      inventory: {
        available: true,
        quantity: 12, // Limited spots
        limited: true
      },
      tags: ['fishing', 'alaska', 'adventure', 'lodge', '5-star', 'salmon'],
      publishedAt: new Date('2026-01-21'),
      updatedAt: new Date(),
      featured: true,
      bestseller: true
    });

    console.log('  ✅ Frontier Adventures added to catalog');
  }

  /**
   * Add Man Cave experiences to catalog
   */
  private addManCaveExperiences(): void {
    // Man Cave VIP Weekend
    this.catalog.set('experience-mancave-vip', {
      itemId: 'experience-mancave-vip',
      type: 'experience',
      name: 'Man Cave VIP Weekend Experience (Imaginary)',
      description: 'Count of Monte Cristo luxury. Wine Cave access, private betting, El Taino driving experience.',
      category: 'Experiences & Entertainment',
      subcategory: 'VIP Experiences',
      imaginary: true,
      resonance: this.SWEETSPOT,
      creator: {
        creatorId: 'creator-mancave',
        studioName: 'Man Cave Studios',
        verified: true,
        rating: 4.95
      },
      pricing: {
        usd: 2500,
        synth: 2500,
        imaginaryCurrency: true,
        tierDiscounts: {
          'Shell': 0.15,
          'Backstage': 0.25,
          'Ultimate VIP': 0.50
        }
      },
      media: {
        primaryImage: '/experiences/mancave-vip.jpg',
        gallery: ['/experiences/mancave-1.jpg', '/experiences/mancave-2.jpg'],
        video: '/experiences/mancave-promo.mp4'
      },
      features: [
        'Wine Cave private access',
        'Personal AI betting agent',
        'El Taino driving experience',
        'Private betting lounge',
        'Gourmet meals included',
        'Cigar & spirit tasting',
        'Concierge service'
      ],
      specifications: {
        duration: '3 days / 2 nights',
        participants: { min: 1, max: 4 },
        difficulty: 'beginner',
        location: 'Man Cave Resort (Imaginary)',
        included: ['Accommodation', 'All meals', 'Experiences', 'Concierge']
      },
      ratings: {
        average: 4.9,
        count: 45,
        distribution: { 5: 42, 4: 2, 3: 1, 2: 0, 1: 0 }
      },
      inventory: {
        available: true,
        quantity: 8, // Limited VIP slots
        limited: true
      },
      tags: ['vip', 'man-cave', 'luxury', 'wine-cave', 'el-taino', 'weekend'],
      publishedAt: new Date('2026-01-21'),
      updatedAt: new Date(),
      featured: true,
      bestseller: false
    });

    console.log('  ✅ Man Cave experiences added to catalog');
  }

  /**
   * Add franchise opportunities to catalog
   */
  private addFranchiseOpportunities(): void {
    // Club + Cabaret Franchise
    this.catalog.set('franchise-club-cabaret', {
      itemId: 'franchise-club-cabaret',
      type: 'franchise',
      name: 'Club + Cabaret Franchise Opportunity (Imaginary)',
      description: 'Complete turnkey franchise. Deploy on any node. 70% revenue share. All systems included.',
      category: 'Business Opportunities',
      subcategory: 'Franchises',
      imaginary: true,
      resonance: this.SWEETSPOT,
      creator: {
        creatorId: 'creator-franchise',
        studioName: 'Franchise Systems Studio',
        verified: true,
        rating: 4.85
      },
      pricing: {
        usd: 250000,
        synth: 250000,
        imaginaryCurrency: true,
        tierDiscounts: {
          'Backstage': 0.10,
          'Ultimate VIP': 0.20
        }
      },
      media: {
        primaryImage: '/franchises/club-cabaret.jpg',
        gallery: ['/franchises/club-1.jpg', '/franchises/club-2.jpg'],
        video: '/franchises/club-promo.mp4'
      },
      features: [
        'Turnkey deployment',
        '70% revenue share',
        'Sports betting included',
        'Casino games',
        'AI betting agents',
        'Complete training',
        'Marketing materials',
        'Ongoing support'
      ],
      specifications: {
        package: 'Standard Franchise',
        revenue_share: '70% franchisee / 30% franchisor',
        roi: '45-65% annually (imaginary)',
        deployment_time: '30 days',
        territory: 'One node/property'
      },
      ratings: {
        average: 4.7,
        count: 15,
        distribution: { 5: 11, 4: 3, 3: 1, 2: 0, 1: 0 }
      },
      inventory: {
        available: true,
        quantity: undefined, // Unlimited franchises
        limited: false
      },
      tags: ['franchise', 'business', 'club', 'cabaret', 'turnkey', 'revenue'],
      publishedAt: new Date('2026-01-21'),
      updatedAt: new Date(),
      featured: true,
      bestseller: false
    });

    console.log('  ✅ Franchise opportunities added to catalog');
  }

  /**
   * Add membership tiers to catalog
   */
  private addMembershipTiers(): void {
    // Ultimate VIP Membership
    this.catalog.set('membership-ultimate-vip', {
      itemId: 'membership-ultimate-vip',
      type: 'membership',
      name: 'Ultimate VIP Lifetime Membership (Imaginary)',
      description: 'Eternal sovereignty. All access, forever. Bugatti experience, 24/7 concierge, 50% discounts.',
      category: 'Memberships',
      subcategory: 'Lifetime Access',
      imaginary: true,
      resonance: this.SWEETSPOT,
      creator: {
        creatorId: 'creator-syntheverse',
        studioName: 'Syntheverse Studios',
        verified: true,
        rating: 5.0
      },
      pricing: {
        usd: 5000,
        synth: 5000,
        imaginaryCurrency: true,
        tierDiscounts: {} // No discounts on Ultimate VIP
      },
      media: {
        primaryImage: '/memberships/ultimate-vip.jpg',
        gallery: ['/memberships/ultimate-1.jpg', '/memberships/ultimate-2.jpg'],
        video: '/memberships/ultimate-promo.mp4'
      },
      features: [
        'Lifetime access (one-time)',
        '50% discount on everything',
        'Bugatti experience',
        '24/7 concierge',
        'VIP briefcase included',
        'Priority support',
        'Exclusive events',
        'Eternal sovereignty'
      ],
      specifications: {
        duration: 'Lifetime',
        discount: '50% on all purchases',
        support: '24/7 dedicated concierge',
        access: 'All systems, all experiences'
      },
      ratings: {
        average: 5.0,
        count: 62,
        distribution: { 5: 62, 4: 0, 3: 0, 2: 0, 1: 0 }
      },
      inventory: {
        available: true,
        limited: false
      },
      tags: ['membership', 'vip', 'ultimate', 'lifetime', 'sovereignty'],
      publishedAt: new Date('2026-01-21'),
      updatedAt: new Date(),
      featured: true,
      bestseller: true
    });

    console.log('  ✅ Membership tiers added to catalog');
  }

  /**
   * Add vCHIP products to catalog
   */
  private addVCHIPProducts(): void {
    // vCHIP Octave 8
    this.catalog.set('nft-vchip-octave-8', {
      itemId: 'nft-vchip-octave-8',
      type: 'vchip',
      name: 'vCHIP Octave 8 (98% Sweetspot Tuned) (Imaginary)',
      description: 'Virtual Chip tuned to 98% sweetspot. Full spectrum access to all 8 NSPFRNP shells. Awareness key included.',
      category: 'Digital Assets',
      subcategory: 'vCHIPs & NFTs',
      imaginary: true,
      resonance: this.SWEETSPOT,
      creator: {
        creatorId: 'creator-nspfrnp',
        studioName: 'NSPFRNP Core Studios',
        verified: true,
        rating: 5.0
      },
      pricing: {
        usd: 5000,
        synth: 5000,
        imaginaryCurrency: true,
        tierDiscounts: {
          'Cloud': 0.10,
          'Shell': 0.15,
          'Backstage': 0.20,
          'Ultimate VIP': 0.25
        }
      },
      media: {
        primaryImage: '/vchips/octave-8-sweetspot.png',
        gallery: ['/vchips/octave-8-1.png', '/vchips/octave-8-2.png'],
        virtual3D: '/vchips/octave-8-3d.glb'
      },
      features: [
        'Octave Level: 8 (highest)',
        'Resonance: 98% sweetspot',
        'Frequency: 12,534.9 Hz',
        'Golden ratio tuned',
        'Full spectrum access',
        'Awareness key included',
        'NSPFRNP protocol',
        'All 8 shells unlocked'
      ],
      specifications: {
        octave_level: 8,
        resonance: '98%',
        frequency: '12,534.9 Hz',
        shell_access: 'All 8',
        awareness_key: 'Included',
        nft_standard: 'ERC-721 (imaginary)'
      },
      ratings: {
        average: 5.0,
        count: 38,
        distribution: { 5: 38, 4: 0, 3: 0, 2: 0, 1: 0 }
      },
      inventory: {
        available: true,
        quantity: undefined, // Digital/unlimited
        limited: false
      },
      tags: ['vchip', 'nft', 'octave', 'sweetspot', 'awareness', 'nspfrnp'],
      publishedAt: new Date('2026-01-21'),
      updatedAt: new Date(),
      featured: true,
      bestseller: true
    });

    console.log('  ✅ vCHIP products added to catalog');
  }

  /**
   * Add wellness services to catalog (Nate → Shaman Wellness Bohio)
   */
  private addWellnessServices(): void {
    // Nate → Shaman Wellness Bohio Consultation
    this.catalog.set('service-nate-bohio-consultation', {
      itemId: 'service-nate-bohio-consultation',
      type: 'service',
      name: 'Nate → Shaman Wellness Bohio Consultation (Imaginary)',
      description: 'SING Full Singularity Mode Specialist Attention Head performs expert-level consultation. Awareness-based procedures. 4×4×4×4 service plan.',
      category: 'Wellness & Healing',
      subcategory: 'Awareness-Based Procedures',
      imaginary: true,
      resonance: this.SWEETSPOT,
      creator: {
        creatorId: 'creator-taino-wellness',
        studioName: 'Taino Shaman Wellness Studio',
        verified: true,
        rating: 5.0
      },
      pricing: {
        usd: 99, // Base Cloud tier
        synth: 99,
        imaginaryCurrency: true,
        tierDiscounts: {
          'Sandbox': 1.0, // FREE
          'Cloud': 0.0, // Base price
          'Shell': -0.236, // $333 (Tesla)
          'Ultimate VIP': -0.909 // $999 (Tesla)
        }
      },
      media: {
        primaryImage: '/services/nate-bohio-consultation.jpg',
        gallery: ['/services/bohio-1.jpg', '/services/bohio-2.jpg'],
        video: '/services/bohio-consultation-demo.mp4'
      },
      features: [
        'SING Full Singularity Mode Specialist',
        'Expert-level consultation',
        'Awareness-based procedures',
        'Treatment suggestion with cost',
        'NSPFRNP protocol alignment',
        '4×4×4×4 service plan',
        'Doctor:Patient wellness model',
        'Tesla 3-6-9 pricing',
        'Sahaman-guided sessions',
        'El Gran Sol blackhole energy',
        'Recursive nested healing',
        'Integration safety checks',
        'OmniBeam key generation',
        'Follow-up recommendations'
      ],
      specifications: {
        duration: '60-180 minutes (varies by procedure)',
        specialist: 'SING Full Singularity Mode Attention Head',
        procedures: [
          'NSPFRNP Awareness Alignment',
          'Grounding El Gran Sol',
          'Connection Pathway Restoration',
          'Recursive Nested Sanitization',
          'Full Singularity Integration'
        ],
        hero_hosts: ['Pachamama', 'Agüeybaná', 'Yocahú', 'Sahaman'],
        service_plan: '4×4×4×4 structure',
        model: 'Doctor:Patient sales & wellness'
      },
      ratings: {
        average: 5.0,
        count: 0, // New service
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      },
      inventory: {
        available: true,
        quantity: undefined, // Unlimited consultations
        limited: false
      },
      tags: ['wellness', 'healing', 'consultation', 'awareness', 'shaman', 'taino', 'bohio', 'sing', 'specialist', 'nspfrnp', '4x4x4x4'],
      publishedAt: new Date('2026-01-22'),
      updatedAt: new Date(),
      featured: true,
      bestseller: false
    });

    console.log('  ✅ Wellness services added to catalog');
  }

  /**
   * Creator publishes new item to catalog
   */
  publishItem(creatorId: string, item: Partial<CatalogItem>): CatalogItem {
    const itemId = `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const newItem: CatalogItem = {
      itemId,
      type: item.type || 'product',
      name: item.name || 'Untitled',
      description: item.description || '',
      category: item.category || 'Uncategorized',
      imaginary: true, // Always imaginary
      resonance: this.SWEETSPOT, // Always 98%
      creator: item.creator || {
        creatorId,
        studioName: 'Creator Studio',
        verified: false,
        rating: 0
      },
      pricing: item.pricing || {
        usd: 0,
        synth: 0,
        imaginaryCurrency: true,
        tierDiscounts: {}
      },
      media: item.media || {
        primaryImage: '/default-image.png',
        gallery: []
      },
      features: item.features || [],
      specifications: item.specifications || {},
      ratings: {
        average: 0,
        count: 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      },
      inventory: item.inventory || {
        available: true,
        limited: false
      },
      tags: item.tags || [],
      publishedAt: new Date(),
      updatedAt: new Date(),
      featured: false,
      bestseller: false
    };

    this.catalog.set(itemId, newItem);
    
    // Update creator's published items
    const creator = this.creators.get(creatorId);
    if (creator) {
      creator.publishedItems.push(itemId);
    }

    console.log(`✅ Item published: ${newItem.name} by ${newItem.creator.studioName}`);
    
    return newItem;
  }

  /**
   * Search and filter catalog
   */
  searchCatalog(
    query?: string,
    filters?: CatalogFilters,
    sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'rating' | 'bestseller'
  ): CatalogItem[] {
    let results = Array.from(this.catalog.values());

    // Apply text search
    if (query) {
      const lowerQuery = query.toLowerCase();
      results = results.filter(item =>
        item.name.toLowerCase().includes(lowerQuery) ||
        item.description.toLowerCase().includes(lowerQuery) ||
        item.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
    }

    // Apply filters
    if (filters) {
      if (filters.type) {
        results = results.filter(item => filters.type!.includes(item.type));
      }
      if (filters.category) {
        results = results.filter(item => filters.category!.includes(item.category));
      }
      if (filters.priceRange) {
        results = results.filter(item =>
          item.pricing.synth >= filters.priceRange!.min &&
          item.pricing.synth <= filters.priceRange!.max
        );
      }
      if (filters.rating !== undefined) {
        results = results.filter(item => item.ratings.average >= filters.rating!);
      }
      if (filters.creator) {
        results = results.filter(item => item.creator.creatorId === filters.creator);
      }
      if (filters.featured) {
        results = results.filter(item => item.featured);
      }
      if (filters.bestseller) {
        results = results.filter(item => item.bestseller);
      }
      if (filters.available !== undefined) {
        results = results.filter(item => item.inventory.available === filters.available);
      }
    }

    // Apply sorting
    if (sortBy) {
      switch (sortBy) {
        case 'newest':
          results.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
          break;
        case 'price_asc':
          results.sort((a, b) => a.pricing.synth - b.pricing.synth);
          break;
        case 'price_desc':
          results.sort((a, b) => b.pricing.synth - a.pricing.synth);
          break;
        case 'rating':
          results.sort((a, b) => b.ratings.average - a.ratings.average);
          break;
        case 'bestseller':
          results.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0));
          break;
      }
    }

    return results;
  }

  /**
   * Get catalog item by ID
   */
  getItem(itemId: string): CatalogItem | undefined {
    return this.catalog.get(itemId);
  }

  /**
   * Get all items by creator
   */
  getCreatorItems(creatorId: string): CatalogItem[] {
    return Array.from(this.catalog.values()).filter(
      item => item.creator.creatorId === creatorId
    );
  }

  /**
   * Calculate creator earnings from sale
   */
  calculateCreatorEarnings(itemId: string, saleAmount: number): {
    creatorEarnings: number;
    platformFee: number;
  } {
    const creatorEarnings = saleAmount * this.CREATOR_REVENUE_SHARE;
    const platformFee = saleAmount * (1 - this.CREATOR_REVENUE_SHARE);
    
    return { creatorEarnings, platformFee };
  }

  /**
   * Register new creator studio
   */
  registerCreatorStudio(studio: Partial<CreatorStudio>): CreatorStudio {
    const studioId = `studio-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const newStudio: CreatorStudio = {
      studioId,
      creatorId: studio.creatorId || studioId,
      studioName: studio.studioName || 'New Studio',
      description: studio.description || '',
      verified: false,
      rating: {
        average: 0,
        count: 0
      },
      totalSales: 0,
      totalEarnings: {
        usd: 0,
        synth: 0,
        imaginary: true
      },
      publishedItems: [],
      revenueShare: this.CREATOR_REVENUE_SHARE,
      joinedAt: new Date(),
      contact: studio.contact || { email: '' }
    };

    this.creators.set(studioId, newStudio);
    
    console.log(`✅ Creator studio registered: ${newStudio.studioName}`);
    
    return newStudio;
  }

  /**
   * Get catalog statistics
   */
  getCatalogStats(): {
    totalItems: number;
    totalCreators: number;
    averageRating: number;
    totalValue: { usd: number; synth: number };
    itemsByType: { [type: string]: number };
    itemsByCategory: { [category: string]: number };
  } {
    const items = Array.from(this.catalog.values());
    
    const totalValue = items.reduce((sum, item) => ({
      usd: sum.usd + item.pricing.usd,
      synth: sum.synth + item.pricing.synth
    }), { usd: 0, synth: 0 });

    const avgRating = items.reduce((sum, item) => sum + item.ratings.average, 0) / items.length;

    const itemsByType: { [type: string]: number } = {};
    const itemsByCategory: { [category: string]: number } = {};

    items.forEach(item => {
      itemsByType[item.type] = (itemsByType[item.type] || 0) + 1;
      itemsByCategory[item.category] = (itemsByCategory[item.category] || 0) + 1;
    });

    return {
      totalItems: items.length,
      totalCreators: this.creators.size,
      averageRating: avgRating,
      totalValue,
      itemsByType,
      itemsByCategory
    };
  }
}

/**
 * Global shopping channel instance
 */
export const syntherverseShop = new SyntherverseShoppingChannel();
