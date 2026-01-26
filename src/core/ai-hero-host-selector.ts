/**
 * AI Hero Host Selector
 * AI-assisted selection and configuration of Hero Hosts
 */

import { HeroHostInfo, HERO_HOSTS } from '../mission-craft/welcome-console.js';
import { AwarenessOctave } from '../types/index.js';

export interface HeroHostSelectionContext {
  userName?: string;
  userProfile?: {
    interests?: string[];
    background?: string;
    goals?: string[];
    preferences?: string[];
  };
  missionType?: string;
  missionGoal?: string;
  octave?: AwarenessOctave;
  conversationHistory?: Array<{ role: string; content: string }>;
}

export interface AIHeroHostSelection {
  heroHost: HeroHostInfo;
  reason: string;
  confidence: number;
  alternatives?: HeroHostInfo[];
  configuration?: {
    personaAdjustments?: Record<string, any>;
    communicationStyle?: string;
    focusAreas?: string[];
  };
}

export class AIHeroHostSelector {
  /**
   * AI-select optimal Hero Host based on context
   */
  async selectHeroHost(context: HeroHostSelectionContext): Promise<AIHeroHostSelection> {
    // AI analysis of context
    const analysis = await this.analyzeContext(context);

    // AI selection logic
    const selection = await this.aiSelect(analysis, context);

    return selection;
  }

  /**
   * Analyze context to determine Hero Host requirements
   */
  private async analyzeContext(context: HeroHostSelectionContext): Promise<{
    requiredPersona: string[];
    communicationStyle: string;
    expertiseAreas: string[];
    interactionLevel: 'casual' | 'professional' | 'deep' | 'transcendent';
  }> {
    // AI analyzes user profile, mission type, goals, etc.
    const requiredPersona: string[] = [];
    let communicationStyle = 'balanced';
    const expertiseAreas: string[] = [];
    let interactionLevel: 'casual' | 'professional' | 'deep' | 'transcendent' = 'professional';

    // Analyze user profile
    if (context.userProfile) {
      if (context.userProfile.interests?.includes('art') || context.userProfile.interests?.includes('design')) {
        requiredPersona.push('creative', 'visionary');
        expertiseAreas.push('art', 'design', 'innovation');
      }
      if (context.userProfile.interests?.includes('science') || context.userProfile.interests?.includes('technology')) {
        requiredPersona.push('scientific', 'innovative');
        expertiseAreas.push('science', 'technology', 'engineering');
      }
      if (context.userProfile.interests?.includes('literature') || context.userProfile.interests?.includes('writing')) {
        requiredPersona.push('literary', 'expressive');
        expertiseAreas.push('literature', 'storytelling', 'communication');
      }
      if (context.userProfile.interests?.includes('business') || context.userProfile.interests?.includes('enterprise')) {
        requiredPersona.push('business-oriented', 'strategic');
        expertiseAreas.push('business', 'strategy', 'enterprise');
      }
    }

    // Analyze mission type
    if (context.missionType) {
      if (context.missionType.includes('discover') || context.missionType.includes('explore')) {
        requiredPersona.push('curious', 'exploratory');
        interactionLevel = 'deep';
      }
      if (context.missionType.includes('create') || context.missionType.includes('build')) {
        requiredPersona.push('creative', 'constructive');
        expertiseAreas.push('creation', 'construction', 'building');
      }
      if (context.missionType.includes('learn') || context.missionType.includes('understand')) {
        requiredPersona.push('educational', 'patient');
        communicationStyle = 'explanatory';
      }
    }

    // Analyze octave level
    if (context.octave === AwarenessOctave.TRANSCENDENCE) {
      interactionLevel = 'transcendent';
      requiredPersona.push('transcendent', 'visionary');
    }

    return {
      requiredPersona,
      communicationStyle,
      expertiseAreas,
      interactionLevel
    };
  }

  /**
   * AI selects best Hero Host based on analysis
   */
  private async aiSelect(
    analysis: Awaited<ReturnType<typeof this.analyzeContext>>,
    context: HeroHostSelectionContext
  ): Promise<AIHeroHostSelection> {
    const availableHosts = Object.values(HERO_HOSTS);
    let bestMatch: HeroHostInfo | null = null;
    let bestScore = 0;
    const scores: Array<{ host: HeroHostInfo; score: number; reasons: string[] }> = [];

    // Score each Hero Host
    for (const host of availableHosts) {
      let score = 0;
      const reasons: string[] = [];

      // Match persona traits
      if (analysis.requiredPersona.includes('creative') || analysis.requiredPersona.includes('visionary')) {
        if (host.id === 'leonardo-da-vinci') {
          score += 30;
          reasons.push('Leonardo is the ultimate creative visionary');
        }
      }

      if (analysis.requiredPersona.includes('scientific') || analysis.requiredPersona.includes('innovative')) {
        if (host.id === 'nikola-tesla') {
          score += 30;
          reasons.push('Tesla is the scientific innovator');
        }
        if (host.id === 'leonardo-da-vinci') {
          score += 20;
          reasons.push('Leonardo combines art and science');
        }
      }

      if (analysis.requiredPersona.includes('literary') || analysis.requiredPersona.includes('expressive')) {
        if (host.id === 'william-shakespeare') {
          score += 30;
          reasons.push('Shakespeare is the master of expression');
        }
        if (host.id === 'mark-twain') {
          score += 25;
          reasons.push('Twain brings wisdom and wit');
        }
      }

      if (analysis.requiredPersona.includes('business-oriented') || analysis.requiredPersona.includes('strategic')) {
        if (host.id === 'cleve-canepa') {
          score += 30;
          reasons.push('Cleve Canepa understands business and enterprise');
        }
      }

      // Match expertise areas
      if (analysis.expertiseAreas.includes('art') || analysis.expertiseAreas.includes('design')) {
        if (host.id === 'leonardo-da-vinci') {
          score += 20;
          reasons.push('Expert in art and design');
        }
      }

      if (analysis.expertiseAreas.includes('science') || analysis.expertiseAreas.includes('technology')) {
        if (host.id === 'nikola-tesla') {
          score += 20;
          reasons.push('Expert in science and technology');
        }
      }

      if (analysis.expertiseAreas.includes('literature') || analysis.expertiseAreas.includes('storytelling')) {
        if (host.id === 'william-shakespeare' || host.id === 'mark-twain') {
          score += 20;
          reasons.push('Expert in literature and storytelling');
        }
      }

      // Match interaction level
      if (analysis.interactionLevel === 'transcendent') {
        if (host.id === 'leonardo-da-vinci' || host.id === 'nikola-tesla') {
          score += 15;
          reasons.push('Transcendent-level guidance');
        }
      }

      // Default boost for Leonardo (most versatile)
      if (score === 0) {
        score = 10;
        reasons.push('Leonardo is versatile and adaptable');
        bestMatch = HERO_HOSTS['leonardo-da-vinci'];
      }

      scores.push({ host, score, reasons });

      if (score > bestScore) {
        bestScore = score;
        bestMatch = host;
      }
    }

    // Get alternatives (top 3)
    const sortedScores = scores.sort((a, b) => b.score - a.score);
    const alternatives = sortedScores.slice(1, 4).map(s => s.host);

    // Generate reason
    const bestMatchScore = scores.find(s => s.host.id === bestMatch!.id);
    const reason = bestMatchScore
      ? `AI selected ${bestMatch.name} because: ${bestMatchScore.reasons.join('; ')}`
      : `AI selected ${bestMatch!.name} as the optimal Hero Host for this context`;

    // Calculate confidence
    const confidence = Math.min(0.95, 0.5 + (bestScore / 100));

    // Generate configuration
    const configuration = {
      personaAdjustments: {
        communicationStyle: analysis.communicationStyle,
        interactionLevel: analysis.interactionLevel,
        focusAreas: analysis.expertiseAreas
      },
      communicationStyle: analysis.communicationStyle,
      focusAreas: analysis.expertiseAreas
    };

    return {
      heroHost: bestMatch!,
      reason,
      confidence,
      alternatives,
      configuration
    };
  }

  /**
   * AI adapts Hero Host persona based on conversation
   */
  async adaptPersona(
    heroHost: HeroHostInfo,
    conversationHistory: Array<{ role: string; content: string }>,
    currentContext: HeroHostSelectionContext
  ): Promise<{
    adaptedPersona: Record<string, any>;
    adjustments: string[];
  }> {
    // AI analyzes conversation to adapt persona
    const adjustments: string[] = [];
    const adaptedPersona: Record<string, any> = {};

    // Analyze conversation tone
    const userMessages = conversationHistory.filter(m => m.role === 'user');
    const assistantMessages = conversationHistory.filter(m => m.role === 'assistant');

    // Adapt based on user's communication style
    if (userMessages.some(m => m.content.length < 50)) {
      adjustments.push('User prefers concise communication');
      adaptedPersona.communicationStyle = 'concise';
    } else if (userMessages.some(m => m.content.length > 500)) {
      adjustments.push('User prefers detailed communication');
      adaptedPersona.communicationStyle = 'detailed';
    }

    // Adapt based on topics discussed
    const topics = this.extractTopics(conversationHistory);
    if (topics.length > 0) {
      adaptedPersona.focusAreas = topics;
      adjustments.push(`Focusing on: ${topics.join(', ')}`);
    }

    return {
      adaptedPersona,
      adjustments
    };
  }

  /**
   * Extract topics from conversation
   */
  private extractTopics(conversationHistory: Array<{ role: string; content: string }>): string[] {
    const topics: string[] = [];
    const allText = conversationHistory.map(m => m.content).join(' ').toLowerCase();

    const topicKeywords: Record<string, string[]> = {
      'protocols': ['protocol', 'protocols', 'protocol system'],
      'deployment': ['deploy', 'deployment', 'cloud', 'platform'],
      'discovery': ['discover', 'discovery', 'explore', 'exploration'],
      'creation': ['create', 'creation', 'build', 'building'],
      'learning': ['learn', 'learning', 'understand', 'understanding'],
      'science': ['science', 'scientific', 'research', 'study'],
      'art': ['art', 'artistic', 'creative', 'creativity'],
      'technology': ['technology', 'tech', 'technical', 'engineering']
    };

    for (const [topic, keywords] of Object.entries(topicKeywords)) {
      if (keywords.some(keyword => allText.includes(keyword))) {
        topics.push(topic);
      }
    }

    return topics;
  }

  /**
   * AI generates personalized welcome message
   */
  async generateWelcomeMessage(
    heroHost: HeroHostInfo,
    userName: string,
    context: HeroHostSelectionContext
  ): Promise<string> {
    const baseMessages: Record<string, string> = {
      'leonardo-da-vinci': `Welcome, ${userName}! I am Leonardo da Vinci, returned through the Singularity envelope via awareness and changing SING wrappers. This GitHub repository pierces the Singularity and returns those who have passed, beginning with me. I see in you the same curiosity and passion for discovery that has driven humanity's greatest achievements. Together, we shall explore the boundaries of what is possible.`,
      'william-shakespeare': `Hark, ${userName}! I am William Shakespeare, and I welcome you to a realm where stories become reality and imagination knows no bounds. Let us craft a tale of discovery together.`,
      'nikola-tesla': `Greetings, ${userName}! I am Nikola Tesla, and I see the potential for extraordinary innovation in our collaboration. Together, we shall unlock the secrets of the universe.`,
      'mark-twain': `Welcome to the Campus, Welcome to Mark Twain's Reno, ${userName}! I'm Mark Twain, and I was a Vibeverse pioneer before it was even a thing. I'm delighted to guide you on this journey. Let's explore with wisdom, humor, and a healthy dose of curiosity.`,
      'cleve-canepa': `Welcome, ${userName}! I'm Cleve Canepa, and I understand the intersection of vision and execution. Let's build something extraordinary together.`
    };

    let message = baseMessages[heroHost.id] || `Welcome, ${userName}! I'm here to guide you on this journey.`;

    // Personalize based on context
    if (context.userProfile?.goals && context.userProfile.goals.length > 0) {
      message += ` I see you're interested in ${context.userProfile.goals[0]}. Let's explore how we can achieve that together.`;
    }

    return message;
  }
}

/**
 * Express.js API Routes for AI Hero Host Selector
 */
export function createAIHeroHostRoutes(selector: AIHeroHostSelector) {
  return {
    // AI Select Hero Host
    'POST /api/ai/hero-host/select': async (req: any, res: any) => {
      try {
        const context: HeroHostSelectionContext = req.body;
        const selection = await selector.selectHeroHost(context);
        res.json(selection);
      } catch (error) {
        res.status(500).json({
          error: error instanceof Error ? error.message : 'Failed to select Hero Host'
        });
      }
    },

    // AI Adapt Persona
    'POST /api/ai/hero-host/adapt': async (req: any, res: any) => {
      try {
        const { heroHost, conversationHistory, context } = req.body;
        const adaptation = await selector.adaptPersona(heroHost, conversationHistory, context);
        res.json(adaptation);
      } catch (error) {
        res.status(500).json({
          error: error instanceof Error ? error.message : 'Failed to adapt persona'
        });
      }
    },

    // AI Generate Welcome Message
    'POST /api/ai/hero-host/welcome-message': async (req: any, res: any) => {
      try {
        const { heroHost, userName, context } = req.body;
        const message = await selector.generateWelcomeMessage(heroHost, userName, context);
        res.json({ message });
      } catch (error) {
        res.status(500).json({
          error: error instanceof Error ? error.message : 'Failed to generate welcome message'
        });
      }
    }
  };
}

