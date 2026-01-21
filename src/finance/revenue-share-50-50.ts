/**
 * 50/50 REVENUE SHARING SYSTEM
 * Fair split with all partners, creators, and channels
 * No fees on revenue payouts - partners keep their full 50%
 */

export interface RevenueChannel {
  id: string;
  name: string;
  type: 'referral' | 'content' | 'partnership' | 'affiliate' | 'creator' | 'reseller';
  description: string;
  eligibility: string[];
  revenueShare: number; // 50% for all channels
  payoutMinimum: number; // in SYNTH
  payoutFrequency: 'instant' | 'daily' | 'weekly' | 'monthly';
}

export interface RevenueShareTransaction {
  id: string;
  channelId: string;
  partnerId: string;
  partnerEmail: string;
  transactionType: string;
  grossAmount: number; // Total transaction amount
  platformFee: number; // Transaction fees collected
  netRevenue: number; // After fees
  platformShare: number; // 50% to platform
  partnerShare: number; // 50% to partner
  currency: 'SYNTH' | 'USD';
  timestamp: Date;
  status: 'pending' | 'paid' | 'failed';
  paymentMethod?: string;
  paymentDetails?: any;
}

export interface PartnerAccount {
  partnerId: string;
  email: string;
  name: string;
  channels: string[]; // Which revenue channels they're active in
  tier: 'sandbox' | 'cloud' | 'octane' | 'shell' | 'ultimate';
  totalEarned: number; // All-time SYNTH earned
  pendingPayout: number; // Unpaid SYNTH
  lifetimeReferrals: number;
  activeReferrals: number;
  paymentMethods: {
    paypal?: string;
    venmo?: string;
    cashapp?: string;
    ethereum?: string;
    vibechain?: string;
  };
  joinedDate: Date;
  lastPayoutDate?: Date;
}

/**
 * Revenue Sharing Channels
 * All channels split 50/50 - Fair for everyone
 */
export const REVENUE_CHANNELS: Record<string, RevenueChannel> = {
  referral: {
    id: 'referral',
    name: 'Referral Program',
    type: 'referral',
    description: 'Earn 50% of all revenue from users you refer',
    eligibility: ['Anyone can refer', 'Unlimited referrals', 'Lifetime tracking'],
    revenueShare: 50,
    payoutMinimum: 10, // 10 SYNTH minimum
    payoutFrequency: 'weekly'
  },

  content_creator: {
    id: 'content_creator',
    name: 'Content Creator',
    type: 'creator',
    description: 'Create content about Vibeverse, earn 50% of conversions',
    eligibility: ['YouTube creators', 'Bloggers', 'Social media influencers', 'Podcasters'],
    revenueShare: 50,
    payoutMinimum: 25,
    payoutFrequency: 'weekly'
  },

  affiliate: {
    id: 'affiliate',
    name: 'Affiliate Partner',
    type: 'affiliate',
    description: 'Promote Vibeverse products, earn 50% commission',
    eligibility: ['Marketing professionals', 'Website owners', 'Email lists'],
    revenueShare: 50,
    payoutMinimum: 50,
    payoutFrequency: 'weekly'
  },

  reseller: {
    id: 'reseller',
    name: 'Reseller Program',
    type: 'reseller',
    description: 'Sell Vibeverse tiers to businesses, keep 50%',
    eligibility: ['Sales professionals', 'Business consultants', 'Agencies'],
    revenueShare: 50,
    payoutMinimum: 100,
    payoutFrequency: 'daily'
  },

  strategic_partner: {
    id: 'strategic_partner',
    name: 'Strategic Partnership',
    type: 'partnership',
    description: 'Long-term partnership deals, 50% revenue share',
    eligibility: ['Established businesses', 'Technology partners', 'Enterprise clients'],
    revenueShare: 50,
    payoutMinimum: 500,
    payoutFrequency: 'instant'
  },

  white_label: {
    id: 'white_label',
    name: 'White Label Partner',
    type: 'partnership',
    description: 'Rebrand and sell under your name, 50% ongoing',
    eligibility: ['Software companies', 'Agencies', 'Platform owners'],
    revenueShare: 50,
    payoutMinimum: 1000,
    payoutFrequency: 'instant'
  },

  ai_host: {
    id: 'ai_host',
    name: 'AI Host / Companion',
    type: 'creator',
    description: 'AI personas that help users, earn 50% of tips',
    eligibility: ['AI developers', 'Character creators', 'Voice actors'],
    revenueShare: 50,
    payoutMinimum: 10,
    payoutFrequency: 'weekly'
  },

  experience_host: {
    id: 'experience_host',
    name: 'Experience Host',
    type: 'creator',
    description: 'Host adventures/experiences, earn 50% of bookings',
    eligibility: ['Adventure guides', 'Property owners', 'Event organizers'],
    revenueShare: 50,
    payoutMinimum: 50,
    payoutFrequency: 'daily'
  },

  property_owner: {
    id: 'property_owner',
    name: 'Property Owner',
    type: 'creator',
    description: 'Rent Cloud/Shell properties, keep 50%',
    eligibility: ['Property owners', 'Real estate investors'],
    revenueShare: 50,
    payoutMinimum: 25,
    payoutFrequency: 'daily'
  },

  business_operator: {
    id: 'business_operator',
    name: 'Business Operator',
    type: 'creator',
    description: 'Run businesses on platform, 50% profit share',
    eligibility: ['Entrepreneurs', 'Business owners'],
    revenueShare: 50,
    payoutMinimum: 50,
    payoutFrequency: 'weekly'
  }
};

/**
 * Revenue Share Calculator
 */
export class RevenueShare5050System {
  /**
   * Calculate 50/50 split for transaction
   */
  calculateSplit(
    grossAmount: number,
    transactionFee: number,
    channelId: string
  ): {
    gross: number;
    fee: number;
    netRevenue: number;
    platformShare: number;
    partnerShare: number;
    splitPercent: number;
  } {
    const channel = REVENUE_CHANNELS[channelId];
    
    if (!channel) {
      throw new Error(`Unknown revenue channel: ${channelId}`);
    }

    // Net revenue after fees
    const netRevenue = grossAmount - transactionFee;
    
    // 50/50 split
    const splitPercent = channel.revenueShare;
    const partnerShare = (netRevenue * splitPercent) / 100;
    const platformShare = netRevenue - partnerShare;

    return {
      gross: grossAmount,
      fee: transactionFee,
      netRevenue,
      platformShare,
      partnerShare,
      splitPercent
    };
  }

  /**
   * Record revenue share transaction
   */
  recordTransaction(
    channelId: string,
    partnerId: string,
    partnerEmail: string,
    grossAmount: number,
    transactionFee: number,
    transactionType: string
  ): RevenueShareTransaction {
    const split = this.calculateSplit(grossAmount, transactionFee, channelId);

    const transaction: RevenueShareTransaction = {
      id: `RST-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      channelId,
      partnerId,
      partnerEmail,
      transactionType,
      grossAmount: split.gross,
      platformFee: split.fee,
      netRevenue: split.netRevenue,
      platformShare: split.platformShare,
      partnerShare: split.partnerShare,
      currency: 'SYNTH',
      timestamp: new Date(),
      status: 'pending'
    };

    return transaction;
  }

  /**
   * Get partner earnings summary
   */
  getPartnerEarnings(partnerId: string, transactions: RevenueShareTransaction[]): {
    totalEarned: number;
    pendingPayout: number;
    paidOut: number;
    transactionCount: number;
    averageEarning: number;
    channels: Record<string, number>;
  } {
    const partnerTransactions = transactions.filter(t => t.partnerId === partnerId);
    
    const totalEarned = partnerTransactions.reduce((sum, t) => sum + t.partnerShare, 0);
    const pendingPayout = partnerTransactions
      .filter(t => t.status === 'pending')
      .reduce((sum, t) => sum + t.partnerShare, 0);
    const paidOut = partnerTransactions
      .filter(t => t.status === 'paid')
      .reduce((sum, t) => sum + t.partnerShare, 0);

    // Earnings by channel
    const channels: Record<string, number> = {};
    partnerTransactions.forEach(t => {
      channels[t.channelId] = (channels[t.channelId] || 0) + t.partnerShare;
    });

    return {
      totalEarned,
      pendingPayout,
      paidOut,
      transactionCount: partnerTransactions.length,
      averageEarning: totalEarned / partnerTransactions.length || 0,
      channels
    };
  }

  /**
   * Process payout to partner
   */
  async processPayout(
    partnerId: string,
    amount: number,
    paymentMethod: 'paypal' | 'venmo' | 'cashapp' | 'ethereum' | 'vibechain'
  ): Promise<{
    success: boolean;
    payoutId: string;
    amount: number;
    fee: number; // Always 0 for revenue payouts
    netAmount: number;
    paymentMethod: string;
    estimatedArrival: string;
  }> {
    // Revenue payouts are ALWAYS fee-free
    const fee = 0;
    const netAmount = amount;

    const payoutId = `PAYOUT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Estimated arrival times by payment method
    const arrivalTimes = {
      paypal: '1-2 business days',
      venmo: 'Instant to 30 minutes',
      cashapp: 'Instant to 30 minutes',
      ethereum: '15 seconds to 5 minutes',
      vibechain: 'Instant (<1 second)'
    };

    return {
      success: true,
      payoutId,
      amount,
      fee,
      netAmount,
      paymentMethod,
      estimatedArrival: arrivalTimes[paymentMethod]
    };
  }

  /**
   * Check if partner qualifies for payout
   */
  canPayout(
    pendingAmount: number,
    channelId: string
  ): { canPayout: boolean; reason?: string; minimumNeeded?: number } {
    const channel = REVENUE_CHANNELS[channelId];
    
    if (!channel) {
      return { canPayout: false, reason: 'Invalid channel' };
    }

    if (pendingAmount < channel.payoutMinimum) {
      return {
        canPayout: false,
        reason: `Minimum payout is ${channel.payoutMinimum} SYNTH`,
        minimumNeeded: channel.payoutMinimum - pendingAmount
      };
    }

    return { canPayout: true };
  }

  /**
   * Get all channels partner is eligible for
   */
  getEligibleChannels(partnerTier: string): RevenueChannel[] {
    // All tiers eligible for all channels
    return Object.values(REVENUE_CHANNELS);
  }

  /**
   * Calculate lifetime value of partner
   */
  calculatePartnerLTV(
    totalEarned: number,
    referralCount: number,
    averageReferralValue: number
  ): {
    currentValue: number;
    projectedYearlyValue: number;
    lifetimeValue: number;
    roi: number;
  } {
    // Partner's current value (what they've earned)
    const currentValue = totalEarned;
    
    // Projected yearly value (based on current rate)
    const projectedYearlyValue = averageReferralValue * referralCount * 12;
    
    // Lifetime value (3-year projection)
    const lifetimeValue = projectedYearlyValue * 3;
    
    // ROI for platform (revenue generated vs revenue shared)
    const roi = (currentValue * 2) / currentValue; // 2x because 50/50 split

    return {
      currentValue,
      projectedYearlyValue,
      lifetimeValue,
      roi
    };
  }
}

/**
 * Partner Dashboard Data
 */
export interface PartnerDashboard {
  partner: PartnerAccount;
  earnings: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    allTime: number;
    pendingPayout: number;
  };
  referrals: {
    total: number;
    active: number;
    inactive: number;
    conversionRate: number;
  };
  topChannels: Array<{
    channelId: string;
    name: string;
    earnings: number;
    percent: number;
  }>;
  recentTransactions: RevenueShareTransaction[];
  nextPayout: {
    amount: number;
    date: Date;
    method: string;
  };
}

/**
 * Revenue Share Examples
 */
export const REVENUE_SHARE_EXAMPLES = {
  referral: {
    scenario: 'You refer a friend who buys Shell tier (1,000 SYNTH/month)',
    calculation: {
      gross: 1000,
      fee: 25.25,
      netRevenue: 974.75,
      platformShare: 487.38,
      yourShare: 487.38,
      recurring: true,
      monthlyEarning: 487.38,
      yearlyEarning: 5848.56
    }
  },

  content_creator: {
    scenario: 'Your YouTube video converts 10 Cloud tier signups (66 SYNTH/month each)',
    calculation: {
      gross: 660,
      fee: 18.90,
      netRevenue: 641.10,
      platformShare: 320.55,
      yourShare: 320.55,
      recurring: true,
      monthlyEarning: 320.55,
      yearlyEarning: 3846.60
    }
  },

  reseller: {
    scenario: 'You sell 5 Ultimate tier packages (5,000 SYNTH/month each)',
    calculation: {
      gross: 25000,
      fee: 500, // Capped at 100 SYNTH per transaction × 5
      netRevenue: 24500,
      platformShare: 12250,
      yourShare: 12250,
      recurring: true,
      monthlyEarning: 12250,
      yearlyEarning: 147000
    }
  },

  ai_host: {
    scenario: 'Your AI companion receives 100 SYNTH in tips from users',
    calculation: {
      gross: 100,
      fee: 1.55, // 1.5% + 0.05 SYNTH for tips
      netRevenue: 98.45,
      platformShare: 49.23,
      yourShare: 49.23,
      recurring: false
    }
  }
};

/**
 * Global instance
 */
export const revenueShareSystem = new RevenueShare5050System();
