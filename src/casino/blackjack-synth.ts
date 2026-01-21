/**
 * BLACKJACK WITH SYNTH CASINO CHIPS
 * Classic 21 game using SYNTH as chips
 * Full casino experience on nodes
 */

export type Card = {
  suit: '♠️' | '♥️' | '♦️' | '♣️';
  rank: 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';
  value: number; // 1-11 for Ace, 10 for face cards
};

export interface BlackjackHand {
  cards: Card[];
  value: number;
  soft: boolean; // Has usable Ace
  busted: boolean;
}

export interface BlackjackGame {
  gameId: string;
  playerId: string;
  playerEmail: string;
  betAmount: number; // SYNTH
  playerHand: BlackjackHand;
  dealerHand: BlackjackHand;
  deck: Card[];
  status: 'betting' | 'playing' | 'dealer-turn' | 'complete';
  result?: 'player-win' | 'dealer-win' | 'push' | 'blackjack';
  payout?: number;
  timestamp: Date;
}

export interface BlackjackStats {
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  pushes: number;
  blackjacks: number;
  totalWagered: number;
  totalWon: number;
  netProfit: number;
  winRate: number;
  blackjackRate: number;
}

/**
 * Blackjack Game System
 */
export class BlackjackSynthGame {
  private games: Map<string, BlackjackGame> = new Map();
  private playerStats: Map<string, BlackjackStats> = new Map();
  
  private readonly MIN_BET = 5; // 5 SYNTH minimum
  private readonly MAX_BET = 10000; // 10K SYNTH maximum
  private readonly HOUSE_EDGE = 0.5; // 0.5% house edge (fair game)

  /**
   * Create new deck
   */
  private createDeck(): Card[] {
    const suits: Card['suit'][] = ['♠️', '♥️', '♦️', '♣️'];
    const ranks: Card['rank'][] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const deck: Card[] = [];

    // Use 6 decks (standard casino)
    for (let d = 0; d < 6; d++) {
      for (const suit of suits) {
        for (const rank of ranks) {
          let value = parseInt(rank);
          if (rank === 'A') value = 11;
          if (['J', 'Q', 'K'].includes(rank)) value = 10;
          
          deck.push({ suit, rank, value });
        }
      }
    }

    // Shuffle
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    return deck;
  }

  /**
   * Start new game
   */
  startGame(
    playerId: string,
    playerEmail: string,
    betAmount: number
  ): BlackjackGame {
    // Validate bet
    if (betAmount < this.MIN_BET) {
      throw new Error(`Minimum bet is ${this.MIN_BET} SYNTH`);
    }
    if (betAmount > this.MAX_BET) {
      throw new Error(`Maximum bet is ${this.MAX_BET} SYNTH`);
    }

    const gameId = `BJ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const deck = this.createDeck();

    // Deal initial cards
    const playerHand: BlackjackHand = {
      cards: [deck.pop()!, deck.pop()!],
      value: 0,
      soft: false,
      busted: false
    };

    const dealerHand: BlackjackHand = {
      cards: [deck.pop()!, deck.pop()!],
      value: 0,
      soft: false,
      busted: false
    };

    // Calculate hand values
    this.calculateHandValue(playerHand);
    this.calculateHandValue(dealerHand);

    const game: BlackjackGame = {
      gameId,
      playerId,
      playerEmail,
      betAmount,
      playerHand,
      dealerHand,
      deck,
      status: 'playing',
      timestamp: new Date()
    };

    // Check for immediate blackjack
    if (playerHand.value === 21) {
      return this.handleBlackjack(game);
    }

    this.games.set(gameId, game);

    console.log(`🃏 Blackjack game started: ${betAmount} SYNTH (${gameId})`);

    return game;
  }

  /**
   * Calculate hand value
   */
  private calculateHandValue(hand: BlackjackHand): void {
    let value = 0;
    let aces = 0;

    for (const card of hand.cards) {
      value += card.value;
      if (card.rank === 'A') aces++;
    }

    // Adjust for aces
    hand.soft = false;
    while (value > 21 && aces > 0) {
      value -= 10;
      aces--;
      hand.soft = true;
    }

    if (aces > 0) hand.soft = true;

    hand.value = value;
    hand.busted = value > 21;
  }

  /**
   * Player hits
   */
  hit(gameId: string): BlackjackGame {
    const game = this.games.get(gameId);
    if (!game) throw new Error('Game not found');
    if (game.status !== 'playing') throw new Error('Cannot hit now');

    // Deal card
    const card = game.deck.pop()!;
    game.playerHand.cards.push(card);
    this.calculateHandValue(game.playerHand);

    // Check for bust
    if (game.playerHand.busted) {
      return this.endGame(game, 'dealer-win');
    }

    return game;
  }

  /**
   * Player stands
   */
  stand(gameId: string): BlackjackGame {
    const game = this.games.get(gameId);
    if (!game) throw new Error('Game not found');
    if (game.status !== 'playing') throw new Error('Cannot stand now');

    game.status = 'dealer-turn';

    // Dealer plays (must hit on 16, stand on 17)
    while (game.dealerHand.value < 17) {
      const card = game.deck.pop()!;
      game.dealerHand.cards.push(card);
      this.calculateHandValue(game.dealerHand);

      if (game.dealerHand.busted) {
        return this.endGame(game, 'player-win');
      }
    }

    // Determine winner
    if (game.playerHand.value > game.dealerHand.value) {
      return this.endGame(game, 'player-win');
    } else if (game.dealerHand.value > game.playerHand.value) {
      return this.endGame(game, 'dealer-win');
    } else {
      return this.endGame(game, 'push');
    }
  }

  /**
   * Handle blackjack (21 on first two cards)
   */
  private handleBlackjack(game: BlackjackGame): BlackjackGame {
    // Check if dealer also has blackjack
    if (game.dealerHand.value === 21) {
      return this.endGame(game, 'push');
    } else {
      return this.endGame(game, 'blackjack');
    }
  }

  /**
   * End game and calculate payout
   */
  private endGame(
    game: BlackjackGame,
    result: BlackjackGame['result']
  ): BlackjackGame {
    game.status = 'complete';
    game.result = result;

    // Calculate payout
    switch (result) {
      case 'blackjack':
        game.payout = game.betAmount * 2.5; // 3:2 payout
        break;
      case 'player-win':
        game.payout = game.betAmount * 2; // 1:1 payout
        break;
      case 'push':
        game.payout = game.betAmount; // Return bet
        break;
      case 'dealer-win':
        game.payout = 0; // Lose bet
        break;
    }

    // Update stats
    this.updateStats(game);

    console.log(`🃏 Game complete: ${result} - Payout: ${game.payout} SYNTH`);

    return game;
  }

  /**
   * Update player stats
   */
  private updateStats(game: BlackjackGame): void {
    let stats = this.playerStats.get(game.playerId);

    if (!stats) {
      stats = {
        gamesPlayed: 0,
        gamesWon: 0,
        gamesLost: 0,
        pushes: 0,
        blackjacks: 0,
        totalWagered: 0,
        totalWon: 0,
        netProfit: 0,
        winRate: 0,
        blackjackRate: 0
      };
    }

    stats.gamesPlayed++;
    stats.totalWagered += game.betAmount;
    stats.totalWon += game.payout || 0;

    if (game.result === 'blackjack') {
      stats.blackjacks++;
      stats.gamesWon++;
    } else if (game.result === 'player-win') {
      stats.gamesWon++;
    } else if (game.result === 'dealer-win') {
      stats.gamesLost++;
    } else if (game.result === 'push') {
      stats.pushes++;
    }

    stats.netProfit = stats.totalWon - stats.totalWagered;
    stats.winRate = (stats.gamesWon / stats.gamesPlayed) * 100;
    stats.blackjackRate = (stats.blackjacks / stats.gamesPlayed) * 100;

    this.playerStats.set(game.playerId, stats);
  }

  /**
   * Get game
   */
  getGame(gameId: string): BlackjackGame | undefined {
    return this.games.get(gameId);
  }

  /**
   * Get player stats
   */
  getStats(playerId: string): BlackjackStats {
    return this.playerStats.get(playerId) || {
      gamesPlayed: 0,
      gamesWon: 0,
      gamesLost: 0,
      pushes: 0,
      blackjacks: 0,
      totalWagered: 0,
      totalWon: 0,
      netProfit: 0,
      winRate: 0,
      blackjackRate: 0
    };
  }

  /**
   * Format hand for display
   */
  formatHand(hand: BlackjackHand, hideFirst: boolean = false): string {
    const cards = hideFirst 
      ? ['[??]', this.formatCard(hand.cards[1])]
      : hand.cards.map(c => this.formatCard(c));
    
    return cards.join(' ');
  }

  /**
   * Format single card
   */
  private formatCard(card: Card): string {
    return `${card.rank}${card.suit}`;
  }

  /**
   * Generate game visual
   */
  generateGameVisual(game: BlackjackGame): string {
    const dealerHidden = game.status === 'playing';
    
    return `
╔════════════════════════════════════════════════════════════════╗
║                    BLACKJACK - SYNTH CASINO                    ║
╠════════════════════════════════════════════════════════════════╣
║
║  BET: ${game.betAmount} SYNTH
║
║  DEALER'S HAND:
║    ${this.formatHand(game.dealerHand, dealerHidden)}
║    ${dealerHidden ? 'Value: ??' : `Value: ${game.dealerHand.value}`}
║
║  YOUR HAND:
║    ${this.formatHand(game.playerHand)}
║    Value: ${game.playerHand.value} ${game.playerHand.soft ? '(soft)' : ''}
║
║  STATUS: ${game.status.toUpperCase()}
${game.result ? `║  RESULT: ${game.result.toUpperCase()}\n║  PAYOUT: ${game.payout} SYNTH` : ''}
║
╚════════════════════════════════════════════════════════════════╝
`;
  }
}

/**
 * Global blackjack instance
 */
export const blackjackGame = new BlackjackSynthGame();
