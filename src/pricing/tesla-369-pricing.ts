/**
 * TESLA 3-6-9 PRICING UTILITY
 * All prices end in 9 (999 instead of 1000)
 * Honors Tesla's sacred geometry: 3, 6, 9
 * 
 * "If you only knew the magnificence of the 3, 6 and 9,
 *  then you would have a key to the universe." - Nikola Tesla
 */

export type Currency = 'USD' | 'SYNTH' | 'SING';

export interface TeslaPrice {
  value: number;
  currency: Currency;
  display: string;
  teslaHarmonic: number; // 3, 6, or 9
}

/**
 * Convert any price to Tesla 3-6-9 pricing (ends in 9)
 * Examples:
 *   1000 → 999
 *   2000 → 1999
 *   5000 → 4999
 *   10000 → 9999
 */
export function toTeslaPrice(price: number, currency: Currency = 'USD'): TeslaPrice {
  // If already ends in 9, keep it (unless it's exactly 1000, 2000, etc.)
  if (price % 10 === 9 && price > 10) {
    return {
      value: price,
      currency,
      display: formatTeslaPrice(price, currency),
      teslaHarmonic: getTeslaHarmonic(price)
    };
  }

  // Round down to nearest number ending in 9
  // 1000 → 999, 2000 → 1999, 5000 → 4999
  const teslaValue = Math.floor(price / 10) * 10 - 1;
  const finalValue = teslaValue >= 0 ? teslaValue : price; // Don't go negative

  return {
    value: finalValue,
    currency,
    display: formatTeslaPrice(finalValue, currency),
    teslaHarmonic: getTeslaHarmonic(finalValue)
  };
}

/**
 * Format Tesla price for display
 */
function formatTeslaPrice(value: number, currency: Currency): string {
  const formatted = value.toLocaleString();
  switch (currency) {
    case 'USD':
      return `$${formatted}`;
    case 'SYNTH':
      return `${formatted} SYNTH`;
    case 'SING':
      return `${formatted} SING`;
    default:
      return `${formatted} ${currency}`;
  }
}

/**
 * Get Tesla harmonic (3, 6, or 9) from price
 * Sum digits until we get 3, 6, or 9
 */
function getTeslaHarmonic(price: number): number {
  let sum = price;
  while (sum > 9) {
    sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  }
  // If sum is 3, 6, or 9, return it; otherwise return closest (1→3, 2→3, 4→6, 5→6, 7→9, 8→9)
  if ([3, 6, 9].includes(sum)) return sum;
  if (sum <= 2) return 3;
  if (sum <= 5) return 6;
  return 9;
}

/**
 * Convert multiple prices at once
 */
export function convertPricesToTesla(
  prices: Array<{ value: number; currency?: Currency }>
): TeslaPrice[] {
  return prices.map(p => toTeslaPrice(p.value, p.currency || 'USD'));
}

/**
 * Common Tesla price presets
 */
export const TESLA_PRICES = {
  // Golden Ticket (Day 1-36)
  GOLDEN_TICKET: {
    DAY_1: toTeslaPrice(3, 'USD'),      // $3 (Tesla's first key)
    DAY_2: toTeslaPrice(6, 'USD'),      // $6 (Tesla's second key)
    DAY_3: toTeslaPrice(9, 'USD'),      // $9 (Tesla's third key)
    DAY_11: toTeslaPrice(33, 'USD'),    // $33 (Tesla master)
    DAY_21: toTeslaPrice(63, 'USD'),    // $63 (9×7)
    DAY_27: toTeslaPrice(81, 'USD'),    // $81 (9×9)
    DAY_33: toTeslaPrice(99, 'USD'),    // $99 (Tesla 99)
    DAY_36: toTeslaPrice(108, 'USD'),   // $108 (9×12)
  },

  // Full Pricing (After Feb 25)
  FULL_PRICING: {
    BASE: toTeslaPrice(3000, 'USD'),     // $2,999 (3×1000 → 2999)
    PREMIUM: toTeslaPrice(6000, 'USD'),  // $5,999 (6×1000 → 5999)
    ULTIMATE: toTeslaPrice(9000, 'USD'), // $8,999 (9×1000 → 8999)
  },

  // Memberships
  MEMBERSHIPS: {
    CLOUD: toTeslaPrice(66, 'SYNTH'),    // 66 SYNTH/month (already Tesla)
    SHELL: toTeslaPrice(1000, 'SYNTH'),  // 999 SYNTH/month
    ULTIMATE: toTeslaPrice(5000, 'SYNTH'), // 4,999 SYNTH/month
  },

  // vCHIPs
  VCHIPS: {
    STARTER: toTeslaPrice(100, 'USD'),      // $99
    CLOUD: toTeslaPrice(369, 'USD'),        // $369 (already Tesla)
    SHELL: toTeslaPrice(999, 'USD'),        // $999 (already Tesla)
    ULTIMATE: toTeslaPrice(5000, 'USD'),     // $4,999
  },
} as const;

/**
 * Apply Tesla pricing to any number
 * Usage: teslaPrice(1000) → 999
 */
export function teslaPrice(value: number, currency: Currency = 'USD'): number {
  return toTeslaPrice(value, currency).value;
}
