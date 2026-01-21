/**
 * CONSCIOUSNESS EXPERIENCE MENU
 * Cigars, vape pens, and expanded consciousness offerings
 * Tableside service at Club + Cabaret with BBHE symbol mapping
 * 
 * ⚠️ LEGAL DISCLAIMER: Many substances listed are controlled and illegal in most jurisdictions.
 * This system is for conceptual/creative purposes in jurisdictions where legal or for harm reduction education.
 * Always comply with local laws. Consult medical professionals. Use harm reduction practices.
 */

export type ExperienceCategory = 
  | 'cigars' | 'vape-pens' | 'cannabis' | 'psilocybin' 
  | 'natural-entheogens' | 'research-compounds';

export type BBHESymbol = 
  | '∞' | '○' | '◐' | '●' | '△' | '▽' | '◇' | '⬡' 
  | '⊕' | '⊗' | '☉' | '☽';

export interface ConsciousnessOffering {
  offeringId: string;
  name: string;
  category: ExperienceCategory;
  bbheSymbol: BBHESymbol;
  strain?: string;
  potency: 'mild' | 'moderate' | 'strong' | 'heroic';
  duration: string;
  description: string;
  effects: string[];
  safetyRating: number; // 1-10
  price: number; // SYNTH
  availability: 'legal' | 'decriminalized' | 'illegal' | 'varies';
  legalStatus: string;
}

export interface SafetyProtocol {
  substanceId: string;
  contraindications: string[];
  drugInteractions: string[];
  medicalScreening: boolean;
  setAndSetting: string[];
  integrationSupport: boolean;
  emergencyProtocol: string;
}

export interface ExperienceOrder {
  orderId: string;
  userId: string;
  userName: string;
  offeringId: string;
  location: 'club' | 'cabaret' | 'wine-cave' | 'private-suite';
  tableNumber?: string;
  safetyAcknowledged: boolean;
  medicalScreening: boolean;
  companionPresent: boolean;
  timestamp: Date;
  status: 'pending' | 'prepared' | 'delivered' | 'complete';
}

/**
 * Consciousness Experience Menu System
 */
export class ConsciousnessMenuSystem {
  private offerings: Map<string, ConsciousnessOffering> = new Map();
  private safetyProtocols: Map<string, SafetyProtocol> = new Map();
  private orders: Map<string, ExperienceOrder> = new Map();

  constructor() {
    this.initializeMenu();
    this.initializeSafetyProtocols();
  }

  /**
   * Initialize consciousness menu
   */
  private initializeMenu(): void {
    // CIGARS (LEGAL)
    this.offerings.set('cigar-cohiba', {
      offeringId: 'cigar-cohiba',
      name: 'Cohiba Behike ∞',
      category: 'cigars',
      bbheSymbol: '∞',
      potency: 'strong',
      duration: '60-90 minutes',
      description: 'Premium Cuban cigar mapped to infinite consciousness symbol',
      effects: ['Relaxation', 'Social lubrication', 'Contemplation'],
      safetyRating: 7,
      price: 75,
      availability: 'legal',
      legalStatus: 'Legal with age restriction (21+)'
    });

    this.offerings.set('cigar-davidoff', {
      offeringId: 'cigar-davidoff',
      name: 'Davidoff Millennium ○',
      category: 'cigars',
      bbheSymbol: '○',
      potency: 'moderate',
      duration: '45-60 minutes',
      description: 'Smooth Dominican blend mapped to wholeness symbol',
      effects: ['Smooth relaxation', 'Clarity', 'Presence'],
      safetyRating: 8,
      price: 50,
      availability: 'legal',
      legalStatus: 'Legal with age restriction (21+)'
    });

    // VAPE PENS (LEGAL where cannabis legal)
    this.offerings.set('vape-clarity', {
      offeringId: 'vape-clarity',
      name: 'Clarity Sativa ☉',
      category: 'vape-pens',
      bbheSymbol: '☉',
      strain: 'Blue Dream',
      potency: 'moderate',
      duration: '2-3 hours',
      description: 'Uplifting sativa blend for solar consciousness',
      effects: ['Energy', 'Creativity', 'Focus', 'Euphoria'],
      safetyRating: 8,
      price: 35,
      availability: 'varies',
      legalStatus: 'Legal in cannabis-legal states/countries only (21+)'
    });

    this.offerings.set('vape-lunar', {
      offeringId: 'vape-lunar',
      name: 'Lunar Indica ☽',
      category: 'vape-pens',
      bbheSymbol: '☽',
      strain: 'Granddaddy Purple',
      potency: 'strong',
      duration: '3-4 hours',
      description: 'Deep relaxation indica for lunar consciousness',
      effects: ['Deep relaxation', 'Body high', 'Sleep aid', 'Pain relief'],
      safetyRating: 8,
      price: 35,
      availability: 'varies',
      legalStatus: 'Legal in cannabis-legal states/countries only (21+)'
    });

    // CANNABIS 420 (Legal where applicable)
    this.offerings.set('cannabis-triangle', {
      offeringId: 'cannabis-triangle',
      name: 'Triangle Kush △',
      category: 'cannabis',
      bbheSymbol: '△',
      strain: 'OG Kush lineage',
      potency: 'strong',
      duration: '3-4 hours',
      description: 'Sacred geometry strain for expanded awareness',
      effects: ['Euphoria', 'Creativity', 'Social', 'Giggly'],
      safetyRating: 8,
      price: 45,
      availability: 'varies',
      legalStatus: 'Legal in cannabis-legal jurisdictions only (21+)'
    });

    // PSILOCYBIN (Decriminalized in some areas)
    this.offerings.set('psilocybin-hex', {
      offeringId: 'psilocybin-hex',
      name: 'Hexagon Harmony ⬡',
      category: 'psilocybin',
      bbheSymbol: '⬡',
      strain: 'Golden Teacher',
      potency: 'moderate',
      duration: '4-6 hours',
      description: 'Sacred mushroom for geometric consciousness exploration',
      effects: ['Visual patterns', 'Emotional release', 'Spiritual insight', 'Connection'],
      safetyRating: 6,
      price: 100,
      availability: 'decriminalized',
      legalStatus: 'Decriminalized in select cities (Oakland, Denver, etc.). Still federally illegal. Medical trials ongoing.'
    });

    this.offerings.set('psilocybin-diamond', {
      offeringId: 'psilocybin-diamond',
      name: 'Diamond Mind ◇',
      category: 'psilocybin',
      bbheSymbol: '◇',
      strain: 'Penis Envy',
      potency: 'heroic',
      duration: '6-8 hours',
      description: 'High-potency mushroom for deep consciousness work',
      effects: ['Profound insights', 'Ego dissolution', 'Mystical experience', 'Transformation'],
      safetyRating: 4,
      price: 200,
      availability: 'decriminalized',
      legalStatus: 'Decriminalized in select cities. Federally illegal. Therapeutic setting recommended.'
    });

    // DMT (Illegal most places)
    this.offerings.set('dmt-source', {
      offeringId: 'dmt-source',
      name: 'Source Code ⊕',
      category: 'natural-entheogens',
      bbheSymbol: '⊕',
      potency: 'heroic',
      duration: '15-30 minutes',
      description: 'N,N-DMT for direct source consciousness contact',
      effects: ['Breakthrough', 'Entity contact', 'Geometric visions', 'Timelessness'],
      safetyRating: 5,
      price: 150,
      availability: 'illegal',
      legalStatus: 'Schedule I controlled substance. Illegal federally and in most jurisdictions. Ceremonial use in some traditions.'
    });

    // BUFO (5-MeO-DMT) (Illegal most places)
    this.offerings.set('bufo-void', {
      offeringId: 'bufo-void',
      name: 'Void Experience ●',
      category: 'natural-entheogens',
      bbheSymbol: '●',
      potency: 'heroic',
      duration: '20-60 minutes',
      description: '5-MeO-DMT from Bufo alvarius for ego death experience',
      effects: ['Complete ego dissolution', 'Oneness', 'Void state', 'Mystical unity'],
      safetyRating: 3,
      price: 500,
      availability: 'illegal',
      legalStatus: 'Schedule I. Illegal federally. Endangered species concern. Synthetic alternatives available. Medical supervision essential.'
    });

    // LSD (Illegal)
    this.offerings.set('lsd-matrix', {
      offeringId: 'lsd-matrix',
      name: 'Matrix Vision ⊗',
      category: 'research-compounds',
      bbheSymbol: '⊗',
      potency: 'strong',
      duration: '8-12 hours',
      description: 'Classic LSD for extended consciousness exploration',
      effects: ['Visual geometry', 'Thought expansion', 'Connectedness', 'Time dilation'],
      safetyRating: 5,
      price: 75,
      availability: 'illegal',
      legalStatus: 'Schedule I controlled substance. Illegal federally and most jurisdictions. Clinical research ongoing.'
    });

    console.log(`✅ ${this.offerings.size} consciousness offerings initialized`);
  }

  /**
   * Initialize safety protocols
   */
  private initializeSafetyProtocols(): void {
    // General protocol
    const generalProtocol: SafetyProtocol = {
      substanceId: 'all',
      contraindications: [
        'Pregnancy or breastfeeding',
        'Heart conditions',
        'Psychotic disorders',
        'Severe anxiety/depression',
        'Liver/kidney disease',
        'High blood pressure (for some substances)'
      ],
      drugInteractions: [
        'SSRIs/antidepressants',
        'MAOIs',
        'Lithium',
        'Stimulants',
        'Alcohol (varies by substance)',
        'Other psychoactives'
      ],
      medicalScreening: true,
      setAndSetting: [
        'Comfortable, safe environment',
        'Trusted companions present',
        'Clear intentions set',
        'No obligations afterward',
        'Integration support available'
      ],
      integrationSupport: true,
      emergencyProtocol: 'Medical staff on call, safe space available, grounding techniques, emergency services if needed'
    };

    this.safetyProtocols.set('all', generalProtocol);

    // Bufo-specific (highest risk)
    this.safetyProtocols.set('bufo-void', {
      substanceId: 'bufo-void',
      contraindications: [
        'Heart conditions (CRITICAL)',
        'Respiratory issues',
        'Psychotic disorders',
        'Seizure history',
        'Recent trauma',
        'Not first psychedelic'
      ],
      drugInteractions: [
        'MAOIs (potentially fatal)',
        'SSRIs (reduced effect)',
        'Any heart medication',
        'Stimulants (dangerous)'
      ],
      medicalScreening: true,
      setAndSetting: [
        'Experienced sitter REQUIRED',
        'Medical screening mandatory',
        'Empty stomach',
        'Lying down position',
        'Quiet environment',
        'No interruptions'
      ],
      integrationSupport: true,
      emergencyProtocol: 'Immediate medical access. Cardiac monitoring recommended. Experienced guide mandatory. Emergency medical services on speed dial.'
    });

    console.log(`✅ Safety protocols initialized`);
  }

  /**
   * Get available offerings by category
   */
  getOfferingsByCategory(category: ExperienceCategory): ConsciousnessOffering[] {
    return Array.from(this.offerings.values())
      .filter(o => o.category === category)
      .sort((a, b) => a.price - b.price);
  }

  /**
   * Get safety protocol
   */
  getSafetyProtocol(offeringId: string): SafetyProtocol {
    // Check for specific protocol
    const specific = this.safetyProtocols.get(offeringId);
    if (specific) return specific;
    
    // Return general protocol
    return this.safetyProtocols.get('all')!;
  }

  /**
   * Place order (with safety checks)
   */
  placeOrder(
    userId: string,
    userName: string,
    offeringId: string,
    location: ExperienceOrder['location'],
    tableNumber: string,
    safetyAcknowledged: boolean,
    medicalScreening: boolean
  ): ExperienceOrder {
    const offering = this.offerings.get(offeringId);
    
    if (!offering) {
      throw new Error('Offering not found');
    }

    // Safety check
    if (!safetyAcknowledged) {
      throw new Error('Must acknowledge safety information');
    }

    // Medical screening for high-risk substances
    if (offering.safetyRating <= 5 && !medicalScreening) {
      throw new Error('Medical screening required for this substance');
    }

    const orderId = `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const order: ExperienceOrder = {
      orderId,
      userId,
      userName,
      offeringId,
      location,
      tableNumber,
      safetyAcknowledged,
      medicalScreening,
      companionPresent: true, // Always recommended
      timestamp: new Date(),
      status: 'pending'
    };

    this.orders.set(orderId, order);

    console.log(`✅ Order placed: ${offering.name} for ${userName}`);

    return order;
  }

  /**
   * Get all offerings
   */
  getAllOfferings(): ConsciousnessOffering[] {
    return Array.from(this.offerings.values())
      .sort((a, b) => a.category.localeCompare(b.category));
  }

  /**
   * Get legal offerings only
   */
  getLegalOfferings(): ConsciousnessOffering[] {
    return Array.from(this.offerings.values())
      .filter(o => o.availability === 'legal')
      .sort((a, b) => a.price - b.price);
  }
}

/**
 * Harm reduction guidelines
 */
export const HARM_REDUCTION_GUIDELINES = {
  general: [
    'Start with lowest dose',
    'Test substances if possible',
    'Have trusted sitter present',
    'Stay hydrated',
    'Avoid mixing substances',
    'Know your source',
    'Safe environment crucial',
    'Integration afterward'
  ],
  
  psychedelics: [
    'Set clear intentions',
    'Comfortable setting essential',
    'Empty calendar next day',
    'No driving for 24+ hours',
    'Trusted guide recommended',
    'Integration support after',
    'Journal your experience',
    'Respect the substance'
  ],

  cannabis: [
    'Start low, go slow',
    'Avoid driving or operating machinery',
    'Stay hydrated, have snacks',
    'Safe, comfortable environment',
    'CBD can reduce anxiety',
    'Know your tolerance'
  ]
};

/**
 * Global consciousness menu instance
 */
export const consciousnessMenu = new ConsciousnessMenuSystem();

/**
 * LEGAL DISCLAIMER
 */
export const LEGAL_DISCLAIMER = `
⚠️ IMPORTANT LEGAL DISCLAIMER ⚠️

Many substances offered in this menu are controlled substances that are illegal 
in most jurisdictions. This system is provided for:

1. Creative/conceptual purposes in fictional universes
2. Harm reduction education where substances may be encountered
3. Jurisdictions where substances are legal/decriminalized
4. Medical/therapeutic contexts with proper licensing

LEGAL WARNINGS:
- Cannabis: Legal in some US states/countries, illegal federally in US
- Psilocybin: Decriminalized in select US cities, illegal federally
- LSD: Schedule I controlled substance, illegal in most jurisdictions
- DMT/5-MeO-DMT: Schedule I controlled substance, illegal in most jurisdictions
- Always verify local laws before possession, use, or distribution
- Penalties for controlled substances can include imprisonment and fines

MEDICAL WARNINGS:
- All psychoactive substances carry risks
- Pre-existing conditions may be contraindicated
- Drug interactions can be dangerous or fatal
- Medical screening recommended for all, required for some
- Emergency medical access essential
- Consult healthcare provider before use

SAFETY REQUIREMENTS:
- Must be 21+ years old (or legal age in jurisdiction)
- Medical screening for high-risk substances
- Trusted sitter/companion present
- Safe, controlled environment
- No driving or operating machinery
- Integration support recommended
- Emergency protocols in place

USE AT YOUR OWN RISK. This system does not constitute medical advice, 
legal counsel, or recommendation to use controlled substances.
`;
