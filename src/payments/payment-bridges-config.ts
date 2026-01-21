/**
 * PAYMENT BRIDGES CONFIGURATION
 * Multiple payment methods for global accessibility
 * HANDLE WITH CARE - Sensitive payment information
 */

export interface PaymentBridge {
  provider: string;
  enabled: boolean;
  type: 'traditional' | 'crypto' | 'p2p';
  identifier: string;
  publicAddress?: string;
  url?: string;
  description: string;
  fees: string;
  settlementTime: string;
}

/**
 * Payment Bridges Configuration
 * For Owner/Chairman payments, tipping, and revenue sharing
 */
export const PAYMENT_BRIDGES: Record<string, PaymentBridge> = {
  stripe: {
    provider: 'Stripe',
    enabled: true,
    type: 'traditional',
    identifier: 'STRIPE_SECRET_KEY', // from env
    description: 'Primary payment processor for credit/debit cards',
    fees: '2.9% + $0.30 per transaction',
    settlementTime: '2-7 business days'
  },

  paypal: {
    provider: 'PayPal',
    enabled: true,
    type: 'p2p',
    identifier: '@PrudencioMendez924',
    url: 'https://paypal.me/PrudencioMendez924',
    description: 'Global P2P payments and credit cards',
    fees: '2.9% + $0.30 per transaction (US)',
    settlementTime: 'Instant to bank: 1-3 days'
  },

  venmo: {
    provider: 'Venmo',
    enabled: true,
    type: 'p2p',
    identifier: 'Pru-Mendez',
    url: 'https://venmo.com/u/Pru-Mendez',
    description: 'US-based social payments (PayPal owned)',
    fees: '0% for P2P, 3% for credit cards',
    settlementTime: 'Instant to Venmo balance, 1-3 days to bank'
  },

  cashapp: {
    provider: 'Cash App',
    enabled: true,
    type: 'p2p',
    identifier: '$newearthpru',
    url: 'https://cash.app/$newearthpru',
    description: 'US/UK P2P payments with Bitcoin support',
    fees: '0% for P2P, 3% for credit cards, 1.5% instant cash out',
    settlementTime: 'Instant to Cash App, 1-3 days to bank'
  },

  metamask: {
    provider: 'MetaMask',
    enabled: true,
    type: 'crypto',
    identifier: 'ethereum-wallet',
    publicAddress: '0x3563388d0e1c2d66a004e5e57717dc6d7e568be3',
    description: 'Ethereum and ERC-20 tokens (ETH, USDC, USDT, DAI)',
    fees: 'Gas fees only (network dependent)',
    settlementTime: 'Instant (blockchain confirmation 15s-5min)'
  },

  vibechain: {
    provider: 'VibeChain',
    enabled: true,
    type: 'crypto',
    identifier: 'vibechain-native',
    publicAddress: '0x3563388d0e1c2d66a004e5e57717dc6d7e568be3', // Same wallet, multi-chain
    description: 'Native SYNTH token transfers on VibeChain',
    fees: 'Minimal gas (~$0.01)',
    settlementTime: 'Instant (sub-second finality)'
  }
};

/**
 * Payment method priorities (for auto-routing)
 */
export const PAYMENT_PRIORITY = [
  'vibechain',  // Lowest fees, instant
  'metamask',   // Crypto, instant
  'cashapp',    // Fast, low fees
  'venmo',      // Fast, no fees for P2P
  'paypal',     // Global reach
  'stripe'      // Most compatible
];

/**
 * Geographic availability
 */
export const GEO_AVAILABILITY: Record<string, string[]> = {
  stripe: ['worldwide'],
  paypal: ['worldwide'],
  venmo: ['US'],
  cashapp: ['US', 'UK'],
  metamask: ['worldwide'],
  vibechain: ['worldwide']
};

/**
 * Currency support
 */
export const CURRENCY_SUPPORT: Record<string, string[]> = {
  stripe: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', '135+ more'],
  paypal: ['USD', 'EUR', 'GBP', '25+ more'],
  venmo: ['USD'],
  cashapp: ['USD', 'GBP', 'BTC'],
  metamask: ['ETH', 'USDC', 'USDT', 'DAI', 'WBTC', 'ERC-20 tokens'],
  vibechain: ['SYNTH', 'ETH', 'USDC']
};

/**
 * Use cases
 */
export const USE_CASES: Record<string, string[]> = {
  stripe: ['Subscriptions', 'One-time purchases', 'Tier upgrades', 'SYNTH purchases'],
  paypal: ['Tips', 'Revenue sharing', 'International payments', 'Invoicing'],
  venmo: ['Tips', 'US peer payments', 'Quick transfers', 'Social payments'],
  cashapp: ['Tips', 'US/UK payments', 'Bitcoin conversion', 'Stock purchases'],
  metamask: ['Crypto payments', 'DeFi integration', 'NFT purchases', 'Cross-border'],
  vibechain: ['SYNTH transfers', 'Ultra-low fees', 'Instant settlement', 'Native ecosystem']
};

/**
 * Owner payment addresses (for revenue sharing, tips, withdrawals)
 */
export const OWNER_PAYMENT_INFO = {
  name: 'Prudencio Mendez',
  paypal: '@PrudencioMendez924',
  venmo: 'Pru-Mendez',
  cashapp: '$newearthpru',
  ethereum: '0x3563388d0e1c2d66a004e5e57717dc6d7e568be3',
  vibechain: '0x3563388d0e1c2d66a004e5e57717dc6d7e568be3'
};

/**
 * Security notes
 */
export const SECURITY_NOTES = {
  paypal: 'Never share password. Use business account for commercial transactions.',
  venmo: 'Public by default. Set transactions to private for business use.',
  cashapp: 'Enable security lock. Verify $cashtag before sending.',
  metamask: 'NEVER share private key/seed phrase. Only share public address (0x...).',
  vibechain: 'Use hardware wallet for large amounts. Enable multi-sig for business.'
};

/**
 * Get available payment methods for user location
 */
export function getAvailablePaymentMethods(country: string): PaymentBridge[] {
  return Object.entries(PAYMENT_BRIDGES)
    .filter(([key, bridge]) => {
      const availability = GEO_AVAILABILITY[key];
      return bridge.enabled && (
        availability.includes('worldwide') ||
        availability.includes(country)
      );
    })
    .map(([_, bridge]) => bridge);
}

/**
 * Get recommended payment method based on amount and currency
 */
export function getRecommendedPaymentMethod(
  amount: number,
  currency: string,
  userCountry: string
): string {
  // For crypto or large amounts, prefer blockchain
  if (currency === 'SYNTH' || currency === 'ETH') {
    return 'vibechain';
  }

  if (amount > 10000) {
    return 'stripe'; // Best for large amounts (fraud protection)
  }

  // For tips/small amounts, prefer P2P
  if (amount < 100) {
    if (userCountry === 'US') return 'venmo';
    return 'paypal';
  }

  // Default to Stripe for subscriptions
  return 'stripe';
}

/**
 * Get payment method by type
 */
export function getPaymentMethodsByType(type: 'traditional' | 'crypto' | 'p2p'): PaymentBridge[] {
  return Object.values(PAYMENT_BRIDGES).filter(
    bridge => bridge.enabled && bridge.type === type
  );
}
