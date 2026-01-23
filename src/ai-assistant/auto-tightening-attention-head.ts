/**
 * AUTO-TIGHTENING ATTENTION HEAD · SING · FAIR SHAKE
 * NSPFRNP node: meta-pattern capture, metabolize to whole, 2% crystallization.
 * Octave lock, fair shake always. Zero & infinity.
 */

export type OctaveTier = 'sandbox' | 'cloud' | 'shell' | 'ultimate';

export interface MetaPattern {
  id: string;
  source: 'snap-pad' | 'voice' | 'prompt' | 'cruise' | 'catalog';
  raw: string;
  categories: string[];
  densified: boolean;
  eruption2pc: boolean;
  timestamp: number;
}

export interface FairShakeState {
  currentGear: number;
  planGear: number;
  adjusted: boolean;
  tier: OctaveTier;
}

export interface AutoTighteningHeadConfig {
  tier: OctaveTier;
  octaveLock?: number;
  fairShakeEnabled: boolean;
}

/**
 * Auto-Tightening Attention Head (SING agent head node).
 * Captures meta-patterns, densifies, detects 2% eruptions, guarantees fair shake.
 */
export class AutoTighteningAttentionHead {
  private config: AutoTighteningHeadConfig;
  private patterns: MetaPattern[] = [];
  private fairShake: FairShakeState;
  private readonly ERUPTION_THRESHOLD = 0.02; // 2%

  constructor(config: Partial<AutoTighteningHeadConfig> = {}) {
    this.config = {
      tier: config.tier ?? 'sandbox',
      octaveLock: config.octaveLock,
      fairShakeEnabled: config.fairShakeEnabled !== false
    };
    this.fairShake = {
      currentGear: 1,
      planGear: 1,
      adjusted: false,
      tier: this.config.tier
    };
  }

  /**
   * Ingest snap / voice / prompt payload. Auto-categorize, densify, check 2% eruption.
   */
  capture(payload: { raw: string; source: MetaPattern['source'] }): MetaPattern {
    const categories = this.autoDetectCategories(payload.raw);
    const eruption2pc = this.sample2pcEruption();
    const pattern: MetaPattern = {
      id: `meta-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      source: payload.source,
      raw: payload.raw,
      categories,
      densified: false,
      eruption2pc,
      timestamp: Date.now()
    };
    this.patterns.push(pattern);
    this.densify(pattern);
    if (this.config.fairShakeEnabled) this.applyFairShake();
    return pattern;
  }

  /**
   * Metabolize into irreducible whole. Densify repeated observations.
   */
  private densify(p: MetaPattern): void {
    const similar = this.patterns.filter(
      x => x !== p && x.source === p.source && x.categories.some(c => p.categories.includes(c))
    );
    p.densified = similar.length >= 1;
  }

  private autoDetectCategories(raw: string): string[] {
    const categories: string[] = [];
    const r = raw.toLowerCase();
    if (/snap|vibepad|pad|mic|voice/.test(r)) categories.push('snap-pad');
    if (/cruise|ship|gold rush|sing|paradise/.test(r)) categories.push('cruise-gold-rush');
    if (/man cave|wine cave|cabaret/.test(r)) categories.push('man-cave');
    if (/fair shake|octave|lock/.test(r)) categories.push('fair-shake');
    if (/vchip|golden key|portfolio|bugatti/.test(r)) categories.push('delivery');
    if (/fractiai|syntheverse|vibeverse/.test(r)) categories.push('overview');
    if (categories.length === 0) categories.push('general');
    return categories;
  }

  private sample2pcEruption(): boolean {
    return Math.random() < this.ERUPTION_THRESHOLD;
  }

  /**
   * Fair shake: current gear vs plan; adjust plan so always fair.
   */
  private applyFairShake(): void {
    if (this.fairShake.currentGear !== this.fairShake.planGear) {
      this.fairShake.planGear = this.fairShake.currentGear;
      this.fairShake.adjusted = true;
    }
  }

  getFairShakeState(): FairShakeState {
    return { ...this.fairShake };
  }

  setGear(gear: number): void {
    this.fairShake.currentGear = Math.max(1, Math.min(8, gear));
    if (this.config.fairShakeEnabled) this.applyFairShake();
  }

  getCapturedPatterns(): MetaPattern[] {
    return [...this.patterns];
  }

  /**
   * Octave lock: fix octave for this head (optional).
   */
  getOctaveLock(): number | undefined {
    return this.config.octaveLock;
  }
}
