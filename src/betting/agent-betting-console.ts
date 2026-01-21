/**
 * AGENT-BASED SPORTS BETTING CONSOLE
 * AI Companions help you bet smarter
 * Gamified betting experience with agents
 */

import { sportsBetting, BettingPool, Bet } from './sports-betting-pools.js';

export interface BettingAgent {
  agentId: string;
  name: string;
  personality: 'conservative' | 'aggressive' | 'analytical' | 'intuitive' | 'whale';
  sport: string; // Specialization
  winRate: number; // Historical win percentage
  totalPredictions: number;
  correctPredictions: number;
  roi: number; // Return on investment
  confidence: number; // Current confidence (0-100)
  tier: 'sandbox' | 'cloud' | 'octane' | 'shell' | 'ultimate';
  avatar: string;
  tagline: string;
  strategy: string;
}

export interface AgentPrediction {
  predictionId: string;
  agentId: string;
  poolId: string;
  outcomeId: string;
  confidence: number; // 0-100
  reasoning: string;
  suggestedBet: number; // SYNTH amount
  expectedValue: number; // EV calculation
  timestamp: Date;
  result?: 'won' | 'lost' | 'pending';
}

export interface BettingConsoleSession {
  sessionId: string;
  userId: string;
  agentId: string;
  startTime: Date;
  location: 'man-cave' | 'cabaret' | 'wine-cave' | 'ultimate-suite';
  totalBets: number;
  totalWagered: number;
  totalWon: number;
  activeBets: string[]; // Bet IDs
  agentAdvice: AgentPrediction[];
  mood: 'cautious' | 'confident' | 'hot-streak' | 'cooling-off';
}

export interface GameConsoleStats {
  level: number;
  xp: number;
  achievements: string[];
  winStreak: number;
  biggestWin: number;
  favoriteSport: string;
  preferredAgent: string;
  vipStatus: 'regular' | 'high-roller' | 'whale' | 'legend';
}

/**
 * Elite Betting Agents
 */
export const BETTING_AGENTS: Record<string, BettingAgent> = {
  // CONSERVATIVE AGENTS
  professor: {
    agentId: 'professor',
    name: 'Professor Stats',
    personality: 'analytical',
    sport: 'all',
    winRate: 58.3,
    totalPredictions: 1247,
    correctPredictions: 727,
    roi: 12.7,
    confidence: 75,
    tier: 'cloud',
    avatar: '👨‍🏫',
    tagline: 'Data-driven decisions only',
    strategy: 'Statistical analysis, value betting, bankroll management'
  },

  scout: {
    agentId: 'scout',
    name: 'The Scout',
    personality: 'analytical',
    sport: 'football',
    winRate: 62.1,
    totalPredictions: 893,
    correctPredictions: 554,
    roi: 18.4,
    confidence: 82,
    tier: 'octane',
    avatar: '🔍',
    tagline: 'I watch every game, every play',
    strategy: 'Film study, injury reports, weather conditions, insider info'
  },

  // AGGRESSIVE AGENTS
  maverick: {
    agentId: 'maverick',
    name: 'Maverick Mike',
    personality: 'aggressive',
    sport: 'all',
    winRate: 51.2,
    totalPredictions: 2134,
    correctPredictions: 1092,
    roi: 8.9,
    confidence: 88,
    tier: 'cloud',
    avatar: '🎰',
    tagline: 'High risk, high reward',
    strategy: 'Underdog hunting, live betting, parlays'
  },

  sharpshooter: {
    agentId: 'sharpshooter',
    name: 'Sharp Shooter',
    personality: 'aggressive',
    sport: 'basketball',
    winRate: 56.7,
    totalPredictions: 1567,
    correctPredictions: 889,
    roi: 15.3,
    confidence: 79,
    tier: 'octane',
    avatar: '🏹',
    tagline: 'I shoot my shot',
    strategy: 'Line shopping, closing line value, momentum plays'
  },

  // INTUITIVE AGENTS
  oracle: {
    agentId: 'oracle',
    name: 'The Oracle',
    personality: 'intuitive',
    sport: 'all',
    winRate: 59.8,
    totalPredictions: 1689,
    correctPredictions: 1010,
    roi: 16.2,
    confidence: 91,
    tier: 'shell',
    avatar: '🔮',
    tagline: 'I see patterns others miss',
    strategy: 'Trend analysis, market psychology, contrarian plays'
  },

  insider: {
    agentId: 'insider',
    name: 'The Insider',
    personality: 'intuitive',
    sport: 'mma',
    winRate: 64.5,
    totalPredictions: 734,
    correctPredictions: 473,
    roi: 22.1,
    confidence: 85,
    tier: 'shell',
    avatar: '🥋',
    tagline: 'Connected to the fight game',
    strategy: 'Fighter camps, weight cuts, mental state, matchup analysis'
  },

  // WHALE AGENTS (VIP only)
  kingpin: {
    agentId: 'kingpin',
    name: 'The Kingpin',
    personality: 'whale',
    sport: 'all',
    winRate: 61.4,
    totalPredictions: 892,
    correctPredictions: 548,
    roi: 24.7,
    confidence: 93,
    tier: 'ultimate',
    avatar: '👑',
    tagline: 'I move markets',
    strategy: 'Whale betting, line manipulation, syndicate plays, VIP intel'
  },

  phantom: {
    agentId: 'phantom',
    name: 'The Phantom',
    personality: 'whale',
    sport: 'all',
    winRate: 63.2,
    totalPredictions: 567,
    correctPredictions: 358,
    roi: 31.5,
    confidence: 88,
    tier: 'ultimate',
    avatar: '👻',
    tagline: 'Ghost money, real profits',
    strategy: 'Steam moves, sharp action, arbitrage, offshore advantages'
  }
};

/**
 * Agent Betting Console System
 */
export class AgentBettingConsole {
  private sessions: Map<string, BettingConsoleSession> = new Map();
  private predictions: Map<string, AgentPrediction> = new Map();
  private userStats: Map<string, GameConsoleStats> = new Map();

  /**
   * Start betting session with agent
   */
  startSession(
    userId: string,
    agentId: string,
    location: BettingConsoleSession['location']
  ): BettingConsoleSession {
    const agent = BETTING_AGENTS[agentId];
    
    if (!agent) {
      throw new Error('Agent not found');
    }

    // Check location access
    this.validateLocationAccess(location, userId);

    const sessionId = `SESSION-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const session: BettingConsoleSession = {
      sessionId,
      userId,
      agentId,
      startTime: new Date(),
      location,
      totalBets: 0,
      totalWagered: 0,
      totalWon: 0,
      activeBets: [],
      agentAdvice: [],
      mood: 'cautious'
    };

    this.sessions.set(sessionId, session);

    console.log(`🎮 Betting console session started: ${agent.name} at ${location}`);
    
    return session;
  }

  /**
   * Get agent predictions for active pools
   */
  getAgentPredictions(
    agentId: string,
    sport?: string
  ): AgentPrediction[] {
    const agent = BETTING_AGENTS[agentId];
    
    if (!agent) {
      throw new Error('Agent not found');
    }

    // Get active pools
    const pools = sport 
      ? sportsBetting.getPoolsBySport(sport as any)
      : sportsBetting.getActivePools();

    const predictions: AgentPrediction[] = [];

    pools.forEach(pool => {
      // Agent analyzes pool and makes prediction
      const prediction = this.generateAgentPrediction(agent, pool);
      predictions.push(prediction);
      this.predictions.set(prediction.predictionId, prediction);
    });

    return predictions.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Generate agent prediction
   */
  private generateAgentPrediction(
    agent: BettingAgent,
    pool: BettingPool
  ): AgentPrediction {
    // Simulate agent analysis
    const outcomeIndex = Math.floor(Math.random() * pool.outcomes.length);
    const outcome = pool.outcomes[outcomeIndex];

    // Calculate confidence based on agent personality
    let confidence: number;
    switch (agent.personality) {
      case 'conservative':
        confidence = 60 + Math.random() * 15; // 60-75%
        break;
      case 'aggressive':
        confidence = 75 + Math.random() * 20; // 75-95%
        break;
      case 'analytical':
        confidence = 65 + Math.random() * 20; // 65-85%
        break;
      case 'intuitive':
        confidence = 70 + Math.random() * 25; // 70-95%
        break;
      case 'whale':
        confidence = 80 + Math.random() * 15; // 80-95%
        break;
    }

    // Suggested bet size based on confidence and agent personality
    let baseBet = 100;
    if (agent.personality === 'aggressive') baseBet = 250;
    if (agent.personality === 'whale') baseBet = 1000;
    
    const suggestedBet = baseBet * (confidence / 100);

    // Expected value calculation
    const expectedValue = (outcome.currentPayout * (confidence / 100) - 1) * 100;

    const predictionId = `PRED-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return {
      predictionId,
      agentId: agent.agentId,
      poolId: pool.poolId,
      outcomeId: outcome.outcomeId,
      confidence: Math.round(confidence),
      reasoning: this.generateReasoning(agent, pool, outcome, confidence),
      suggestedBet: Math.round(suggestedBet),
      expectedValue: Math.round(expectedValue * 10) / 10,
      timestamp: new Date(),
      result: 'pending'
    };
  }

  /**
   * Generate agent reasoning
   */
  private generateReasoning(
    agent: BettingAgent,
    pool: BettingPool,
    outcome: any,
    confidence: number
  ): string {
    const reasons = [
      `Strong statistical edge on ${outcome.description}`,
      `Market is undervaluing this outcome`,
      `Historical data supports this play`,
      `Sharp money is on ${outcome.description}`,
      `Line movement indicates value here`,
      `Contrarian play with upside`,
      `Inside information points to ${outcome.description}`,
      `Perfect matchup for this outcome`,
      `Public is overweighting the other side`,
      `This is where the smart money goes`
    ];

    const personalized = {
      conservative: 'Safe play with solid fundamentals. ',
      aggressive: 'High upside opportunity. Let it ride! ',
      analytical: 'Numbers strongly favor this outcome. ',
      intuitive: 'My gut says this is the move. ',
      whale: 'This is where I'm putting serious money. '
    };

    return personalized[agent.personality] + reasons[Math.floor(Math.random() * reasons.length)];
  }

  /**
   * Place bet following agent advice
   */
  placeBetWithAgent(
    sessionId: string,
    predictionId: string,
    amount?: number
  ): Bet {
    const session = this.sessions.get(sessionId);
    const prediction = this.predictions.get(predictionId);

    if (!session || !prediction) {
      throw new Error('Invalid session or prediction');
    }

    // Use suggested amount if not provided
    const betAmount = amount || prediction.suggestedBet;

    // Place bet through main betting system
    const bet = sportsBetting.placeBet(
      prediction.poolId,
      session.userId,
      session.userId, // email placeholder
      prediction.outcomeId,
      betAmount
    );

    // Update session
    session.totalBets++;
    session.totalWagered += betAmount;
    session.activeBets.push(bet.betId);
    session.agentAdvice.push(prediction);

    // Update mood
    this.updateSessionMood(session);

    console.log(`🎮 Agent-assisted bet placed: ${betAmount} SYNTH following ${prediction.agentId}`);

    return bet;
  }

  /**
   * Update session mood
   */
  private updateSessionMood(session: BettingConsoleSession): void {
    if (session.totalBets === 0) {
      session.mood = 'cautious';
    } else if (session.totalWon > session.totalWagered * 1.5) {
      session.mood = 'hot-streak';
    } else if (session.totalWon > session.totalWagered) {
      session.mood = 'confident';
    } else {
      session.mood = 'cooling-off';
    }
  }

  /**
   * Validate location access
   */
  private validateLocationAccess(
    location: BettingConsoleSession['location'],
    userId: string
  ): void {
    // Man Cave: Open to all
    if (location === 'man-cave') return;

    // Cabaret: Cloud tier+
    if (location === 'cabaret') {
      // Check tier (would integrate with user system)
      return;
    }

    // Wine Cave: Shell tier+ (VIP/Whale access)
    if (location === 'wine-cave') {
      // Check Shell/Ultimate tier
      return;
    }

    // Ultimate Suite: Ultimate tier only
    if (location === 'ultimate-suite') {
      // Check Ultimate tier
      return;
    }
  }

  /**
   * Get console stats
   */
  getConsoleStats(userId: string): GameConsoleStats {
    let stats = this.userStats.get(userId);

    if (!stats) {
      stats = {
        level: 1,
        xp: 0,
        achievements: [],
        winStreak: 0,
        biggestWin: 0,
        favoriteSport: 'football',
        preferredAgent: 'professor',
        vipStatus: 'regular'
      };
      this.userStats.set(userId, stats);
    }

    return stats;
  }

  /**
   * Award XP for betting activity
   */
  awardXP(userId: string, amount: number, reason: string): void {
    const stats = this.getConsoleStats(userId);
    stats.xp += amount;

    // Level up check
    const newLevel = Math.floor(stats.xp / 1000) + 1;
    if (newLevel > stats.level) {
      stats.level = newLevel;
      console.log(`🎮 Level up! Now level ${newLevel}`);
    }

    // VIP status update
    if (stats.xp >= 50000) stats.vipStatus = 'legend';
    else if (stats.xp >= 20000) stats.vipStatus = 'whale';
    else if (stats.xp >= 5000) stats.vipStatus = 'high-roller';
  }

  /**
   * Get available agents by tier
   */
  getAvailableAgents(userTier: string): BettingAgent[] {
    const tierOrder = ['sandbox', 'cloud', 'octane', 'shell', 'ultimate'];
    const tierLevel = tierOrder.indexOf(userTier);

    return Object.values(BETTING_AGENTS)
      .filter(agent => tierOrder.indexOf(agent.tier) <= tierLevel)
      .sort((a, b) => b.winRate - a.winRate);
  }

  /**
   * Get leaderboard
   */
  getLeaderboard(): Array<{
    userId: string;
    level: number;
    xp: number;
    vipStatus: string;
    biggestWin: number;
  }> {
    return Array.from(this.userStats.entries())
      .map(([userId, stats]) => ({
        userId,
        level: stats.level,
        xp: stats.xp,
        vipStatus: stats.vipStatus,
        biggestWin: stats.biggestWin
      }))
      .sort((a, b) => b.xp - a.xp)
      .slice(0, 100);
  }
}

/**
 * Achievements
 */
export const BETTING_ACHIEVEMENTS = {
  first_bet: {
    id: 'first_bet',
    name: 'First Timer',
    description: 'Place your first bet',
    xp: 100,
    icon: '🎲'
  },
  first_win: {
    id: 'first_win',
    name: 'Beginner\'s Luck',
    description: 'Win your first bet',
    xp: 250,
    icon: '💰'
  },
  hot_streak_3: {
    id: 'hot_streak_3',
    name: 'On Fire',
    description: 'Win 3 bets in a row',
    xp: 500,
    icon: '🔥'
  },
  hot_streak_10: {
    id: 'hot_streak_10',
    name: 'Unstoppable',
    description: 'Win 10 bets in a row',
    xp: 2000,
    icon: '🚀'
  },
  whale_bet: {
    id: 'whale_bet',
    name: 'Whale Status',
    description: 'Place a bet of 5,000+ SYNTH',
    xp: 1000,
    icon: '🐋'
  },
  underdog_win: {
    id: 'underdog_win',
    name: 'Underdog Hunter',
    description: 'Win a bet with 3x+ odds',
    xp: 750,
    icon: '🏹'
  },
  wine_cave_access: {
    id: 'wine_cave_access',
    name: 'VIP Access',
    description: 'Get invited to the wine cave',
    xp: 3000,
    icon: '🍷'
  }
};

/**
 * Global instance
 */
export const agentBettingConsole = new AgentBettingConsole();
