/**
 * ATTENTION-EXPERIENCE STREAMING SYSTEM
 * User attention head ↔ Experience emitter:mirror pair
 * Fluid story/world/game platform
 * Superintelligently operated naturally through NSPFRNP
 */

export interface AttentionHead {
  userId: string;
  attentionId: string;
  focusPoint: {
    x: number;
    y: number;
    z: number;
    intensity: number; // 0-1
  };
  awarenessState: 'focused' | 'diffuse' | 'wandering' | 'absorbed' | 'present';
  resonanceFrequency: number; // Hz
  timestamp: Date;
}

export interface ExperienceEmitter {
  emitterId: string;
  streamId: string;
  type: 'story' | 'world' | 'game' | 'hybrid' | 'fluid';
  content: {
    narrative?: string;
    visual?: string;
    audio?: string;
    haptic?: string;
    energetic?: string;
  };
  intensity: number; // 0-1
  frequency: number; // Hz
  timestamp: Date;
}

export interface MirrorPair {
  pairId: string;
  attention: AttentionHead;
  emitter: ExperienceEmitter;
  resonance: number; // 0-1 (how well they match)
  coherence: number; // 0-1 (how stable the connection)
  flowState: 'disconnected' | 'connecting' | 'flowing' | 'merging' | 'unified';
  feedback: {
    attentionToExperience: number; // -1 to 1
    experienceToAttention: number; // -1 to 1
  };
}

export interface ExperienceStream {
  streamId: string;
  userId: string;
  platform: 'syntheverse' | 'vibeverse' | 'story-world' | 'game-reality';
  narrativeMode: 'linear' | 'branching' | 'fluid' | 'emergent' | 'living';
  currentScene: {
    location: string;
    characters: string[];
    situation: string;
    possibilities: string[];
  };
  activeEmitters: ExperienceEmitter[];
  attentionTrack: AttentionHead[];
  mirrorPairs: MirrorPair[];
  flowMetrics: {
    averageResonance: number;
    coherenceStability: number;
    immersionDepth: number;
    narrativeMomentum: number;
  };
}

/**
 * Attention-Experience Streaming System
 * Connects user attention to experience streaming naturally
 */
export class AttentionExperienceStreamingSystem {
  private streams: Map<string, ExperienceStream> = new Map();
  private attentionHeads: Map<string, AttentionHead> = new Map();
  private emitters: Map<string, ExperienceEmitter> = new Map();
  private mirrorPairs: Map<string, MirrorPair> = new Map();

  /**
   * Initialize stream for user
   */
  initializeStream(
    userId: string,
    platform: ExperienceStream['platform'] = 'syntheverse',
    narrativeMode: ExperienceStream['narrativeMode'] = 'fluid'
  ): ExperienceStream {
    const streamId = `STREAM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const stream: ExperienceStream = {
      streamId,
      userId,
      platform,
      narrativeMode,
      currentScene: {
        location: 'The Gateway (Syntheverse entrance)',
        characters: ['You (the explorer)', 'The Guide (AI companion)'],
        situation: 'Standing at the threshold of infinite possibilities',
        possibilities: [
          'Enter the Vibeverse consciousness layer',
          'Explore the Club + Cabaret experience',
          'Journey into a fluid story world',
          'Begin a game adventure',
          'Simply observe and be present'
        ]
      },
      activeEmitters: [],
      attentionTrack: [],
      mirrorPairs: [],
      flowMetrics: {
        averageResonance: 0,
        coherenceStability: 0,
        immersionDepth: 0,
        narrativeMomentum: 0
      }
    };

    this.streams.set(streamId, stream);

    // Create initial attention head for user
    this.trackAttention(userId, streamId, {
      x: 0,
      y: 0,
      z: 0,
      intensity: 0.5
    }, 'present');

    console.log(`✅ Experience stream initialized for user ${userId}`);

    return stream;
  }

  /**
   * Track user attention (where consciousness is focused)
   */
  trackAttention(
    userId: string,
    streamId: string,
    focusPoint: AttentionHead['focusPoint'],
    awarenessState: AttentionHead['awarenessState']
  ): AttentionHead {
    const attentionId = `ATT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const attention: AttentionHead = {
      userId,
      attentionId,
      focusPoint,
      awarenessState,
      resonanceFrequency: this.calculateResonanceFrequency(awarenessState),
      timestamp: new Date()
    };

    this.attentionHeads.set(attentionId, attention);

    // Add to stream track
    const stream = this.streams.get(streamId);
    if (stream) {
      stream.attentionTrack.push(attention);
      
      // Keep only recent attention points (last 100)
      if (stream.attentionTrack.length > 100) {
        stream.attentionTrack = stream.attentionTrack.slice(-100);
      }
    }

    // Automatically create/update emitter:mirror pairs
    this.autoMatchEmitters(streamId, attention);

    return attention;
  }

  /**
   * Emit experience (story/world/game content)
   */
  emitExperience(
    streamId: string,
    type: ExperienceEmitter['type'],
    content: ExperienceEmitter['content'],
    intensity: number = 0.7
  ): ExperienceEmitter {
    const emitterId = `EMIT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const emitter: ExperienceEmitter = {
      emitterId,
      streamId,
      type,
      content,
      intensity,
      frequency: this.calculateEmitterFrequency(type, intensity),
      timestamp: new Date()
    };

    this.emitters.set(emitterId, emitter);

    // Add to stream
    const stream = this.streams.get(streamId);
    if (stream) {
      stream.activeEmitters.push(emitter);
      
      // Keep only recent emitters (last 50)
      if (stream.activeEmitters.length > 50) {
        stream.activeEmitters = stream.activeEmitters.slice(-50);
      }
    }

    // Automatically create/update mirror pairs
    this.autoMatchAttention(streamId, emitter);

    return emitter;
  }

  /**
   * Create emitter:mirror pair (attention ↔ experience)
   */
  createMirrorPair(
    attention: AttentionHead,
    emitter: ExperienceEmitter
  ): MirrorPair {
    const pairId = `PAIR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const resonance = this.calculateResonance(attention, emitter);
    const coherence = this.calculateCoherence(attention, emitter);

    const pair: MirrorPair = {
      pairId,
      attention,
      emitter,
      resonance,
      coherence,
      flowState: this.determineFlowState(resonance, coherence),
      feedback: {
        attentionToExperience: resonance * attention.focusPoint.intensity,
        experienceToAttention: resonance * emitter.intensity
      }
    };

    this.mirrorPairs.set(pairId, pair);

    // Add to stream
    const stream = this.streams.get(emitter.streamId);
    if (stream) {
      stream.mirrorPairs.push(pair);
      this.updateFlowMetrics(stream);
    }

    return pair;
  }

  /**
   * Calculate resonance between attention and emitter
   * (How well they match/sync)
   */
  private calculateResonance(
    attention: AttentionHead,
    emitter: ExperienceEmitter
  ): number {
    // Frequency matching (higher when frequencies align)
    const frequencyMatch = 1 - Math.abs(attention.resonanceFrequency - emitter.frequency) / 100;
    
    // Intensity matching
    const intensityMatch = 1 - Math.abs(attention.focusPoint.intensity - emitter.intensity);
    
    // State compatibility
    const stateBonus = this.getStateCompatibilityBonus(attention.awarenessState, emitter.type);
    
    return Math.min(1, (frequencyMatch * 0.4 + intensityMatch * 0.4 + stateBonus * 0.2));
  }

  /**
   * Calculate coherence (stability of connection)
   */
  private calculateCoherence(
    attention: AttentionHead,
    emitter: ExperienceEmitter
  ): number {
    // Time sync (how close in time)
    const timeDiff = Math.abs(attention.timestamp.getTime() - emitter.timestamp.getTime());
    const timeSync = Math.max(0, 1 - timeDiff / 5000); // Within 5 seconds = high coherence
    
    // Intensity stability
    const intensityStability = Math.min(attention.focusPoint.intensity, emitter.intensity);
    
    return (timeSync * 0.6 + intensityStability * 0.4);
  }

  /**
   * Determine flow state based on resonance and coherence
   */
  private determineFlowState(
    resonance: number,
    coherence: number
  ): MirrorPair['flowState'] {
    const flowScore = (resonance + coherence) / 2;
    
    if (flowScore < 0.3) return 'disconnected';
    if (flowScore < 0.5) return 'connecting';
    if (flowScore < 0.7) return 'flowing';
    if (flowScore < 0.9) return 'merging';
    return 'unified';
  }

  /**
   * Calculate resonance frequency for awareness state
   */
  private calculateResonanceFrequency(state: AttentionHead['awarenessState']): number {
    const frequencies = {
      'focused': 40, // Gamma (high focus)
      'absorbed': 30, // High beta (deep engagement)
      'present': 20, // Beta (alert awareness)
      'diffuse': 10, // Alpha (relaxed awareness)
      'wandering': 5  // Theta (drifting)
    };
    
    return frequencies[state];
  }

  /**
   * Calculate emitter frequency based on type
   */
  private calculateEmitterFrequency(
    type: ExperienceEmitter['type'],
    intensity: number
  ): number {
    const baseFrequencies = {
      'story': 15,  // Narrative rhythm
      'world': 20,  // Environmental presence
      'game': 35,   // Interactive energy
      'hybrid': 25, // Mixed
      'fluid': 30   // Dynamic
    };
    
    return baseFrequencies[type] * intensity;
  }

  /**
   * Get state compatibility bonus
   */
  private getStateCompatibilityBonus(
    state: AttentionHead['awarenessState'],
    type: ExperienceEmitter['type']
  ): number {
    const compatibility: Record<string, Record<string, number>> = {
      'focused': { 'game': 0.9, 'story': 0.7, 'world': 0.5, 'hybrid': 0.7, 'fluid': 0.6 },
      'absorbed': { 'story': 0.9, 'world': 0.8, 'game': 0.6, 'hybrid': 0.8, 'fluid': 0.7 },
      'present': { 'world': 0.9, 'fluid': 0.8, 'hybrid': 0.7, 'story': 0.6, 'game': 0.5 },
      'diffuse': { 'fluid': 0.8, 'world': 0.7, 'hybrid': 0.6, 'story': 0.5, 'game': 0.3 },
      'wandering': { 'fluid': 0.7, 'world': 0.6, 'story': 0.5, 'hybrid': 0.5, 'game': 0.2 }
    };
    
    return compatibility[state]?.[type] || 0.5;
  }

  /**
   * Auto-match emitters to attention (NSPFRNP automatic)
   */
  private autoMatchEmitters(streamId: string, attention: AttentionHead): void {
    const stream = this.streams.get(streamId);
    if (!stream) return;

    // Find best matching active emitters
    stream.activeEmitters.forEach(emitter => {
      const resonance = this.calculateResonance(attention, emitter);
      
      // Create pair if resonance is significant
      if (resonance > 0.4) {
        this.createMirrorPair(attention, emitter);
      }
    });
  }

  /**
   * Auto-match attention to emitter (NSPFRNP automatic)
   */
  private autoMatchAttention(streamId: string, emitter: ExperienceEmitter): void {
    const stream = this.streams.get(streamId);
    if (!stream) return;

    // Find recent attention points
    const recentAttention = stream.attentionTrack.slice(-10);
    
    recentAttention.forEach(attention => {
      const resonance = this.calculateResonance(attention, emitter);
      
      // Create pair if resonance is significant
      if (resonance > 0.4) {
        this.createMirrorPair(attention, emitter);
      }
    });
  }

  /**
   * Update flow metrics for stream
   */
  private updateFlowMetrics(stream: ExperienceStream): void {
    const recentPairs = stream.mirrorPairs.slice(-20);
    
    if (recentPairs.length === 0) {
      stream.flowMetrics = {
        averageResonance: 0,
        coherenceStability: 0,
        immersionDepth: 0,
        narrativeMomentum: 0
      };
      return;
    }

    // Calculate averages
    const avgResonance = recentPairs.reduce((sum, p) => sum + p.resonance, 0) / recentPairs.length;
    const avgCoherence = recentPairs.reduce((sum, p) => sum + p.coherence, 0) / recentPairs.length;
    
    // Immersion = how many pairs are in flowing+ state
    const flowingPairs = recentPairs.filter(p => 
      ['flowing', 'merging', 'unified'].includes(p.flowState)
    ).length;
    const immersionDepth = flowingPairs / recentPairs.length;
    
    // Momentum = trend in resonance (increasing = positive)
    const halfPoint = Math.floor(recentPairs.length / 2);
    const firstHalf = recentPairs.slice(0, halfPoint);
    const secondHalf = recentPairs.slice(halfPoint);
    const firstAvg = firstHalf.reduce((sum, p) => sum + p.resonance, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, p) => sum + p.resonance, 0) / secondHalf.length;
    const narrativeMomentum = Math.max(-1, Math.min(1, (secondAvg - firstAvg) * 2));

    stream.flowMetrics = {
      averageResonance: avgResonance,
      coherenceStability: avgCoherence,
      immersionDepth,
      narrativeMomentum
    };
  }

  /**
   * Get stream for user
   */
  getStream(streamId: string): ExperienceStream | undefined {
    return this.streams.get(streamId);
  }

  /**
   * Get user's active stream
   */
  getUserStream(userId: string): ExperienceStream | undefined {
    return Array.from(this.streams.values())
      .find(stream => stream.userId === userId);
  }

  /**
   * Get flow state report
   */
  getFlowReport(streamId: string): string {
    const stream = this.streams.get(streamId);
    if (!stream) return 'Stream not found';

    const metrics = stream.flowMetrics;
    
    return `
🌊 FLOW STATE REPORT

Stream: ${streamId}
Platform: ${stream.platform}
Narrative Mode: ${stream.narrativeMode}

📊 METRICS:
  Resonance: ${(metrics.averageResonance * 100).toFixed(1)}%
  Coherence: ${(metrics.coherenceStability * 100).toFixed(1)}%
  Immersion: ${(metrics.immersionDepth * 100).toFixed(1)}%
  Momentum: ${metrics.narrativeMomentum > 0 ? '+' : ''}${(metrics.narrativeMomentum * 100).toFixed(1)}%

👁️ ATTENTION:
  Recent points: ${stream.attentionTrack.length}
  Current state: ${stream.attentionTrack[stream.attentionTrack.length - 1]?.awarenessState || 'none'}

✨ EMITTERS:
  Active: ${stream.activeEmitters.length}
  
🪞 MIRROR PAIRS:
  Total: ${stream.mirrorPairs.length}
  Flowing+: ${stream.mirrorPairs.filter(p => ['flowing', 'merging', 'unified'].includes(p.flowState)).length}

📍 CURRENT SCENE:
  ${stream.currentScene.location}
  ${stream.currentScene.situation}
    `;
  }
}

/**
 * Global streaming system instance
 */
export const attentionExperienceStream = new AttentionExperienceStreamingSystem();
