/**
 * PAYMENT BRIDGE ROUTER
 * Routes payments to appropriate provider
 * Handles multi-channel payment processing
 */

import { PAYMENT_BRIDGES, OWNER_PAYMENT_INFO, getRecommendedPaymentMethod } from './payment-bridges-config.js';

export interface PaymentRequest {
  amount: number;
  currency: string;
  recipient: 'owner' | 'user' | 'platform';
  type: 'purchase' | 'tip' | 'revenue_share' | 'withdrawal';
  userCountry?: string;
  preferredMethod?: string;
  metadata?: Record<string, any>;
}

export interface PaymentRoute {
  provider: string;
  method: string;
  address?: string;
  url?: string;
  qrCode?: string;
  instructions: string[];
  estimatedFees: string;
  estimatedTime: string;
}

export class PaymentBridgeRouter {
  /**
   * Route payment to best provider
   */
  routePayment(request: PaymentRequest): PaymentRoute {
    const { amount, currency, recipient, type, userCountry, preferredMethod } = request;

    // If user has preferred method, use it (if available)
    if (preferredMethod && PAYMENT_BRIDGES[preferredMethod]?.enabled) {
      return this.createRoute(preferredMethod, request);
    }

    // Get recommended method
    const recommendedMethod = getRecommendedPaymentMethod(
      amount,
      currency,
      userCountry || 'US'
    );

    return this.createRoute(recommendedMethod, request);
  }

  /**
   * Create payment route for specific provider
   */
  private createRoute(provider: string, request: PaymentRequest): PaymentRoute {
    const bridge = PAYMENT_BRIDGES[provider];
    
    if (!bridge) {
      throw new Error(`Payment provider ${provider} not found`);
    }

    const route: PaymentRoute = {
      provider: bridge.provider,
      method: provider,
      estimatedFees: bridge.fees,
      estimatedTime: bridge.settlementTime,
      instructions: []
    };

    // Build instructions based on provider
    switch (provider) {
      case 'stripe':
        route.instructions = this.getStripeInstructions(request);
        break;

      case 'paypal':
        route.address = OWNER_PAYMENT_INFO.paypal;
        route.url = `https://paypal.me/${OWNER_PAYMENT_INFO.paypal}/${request.amount}`;
        route.instructions = this.getPayPalInstructions(request);
        break;

      case 'venmo':
        route.address = OWNER_PAYMENT_INFO.venmo;
        route.url = `https://venmo.com/u/${OWNER_PAYMENT_INFO.venmo}?txn=pay&amount=${request.amount}&note=${encodeURIComponent(this.getPaymentNote(request))}`;
        route.instructions = this.getVenmoInstructions(request);
        break;

      case 'cashapp':
        route.address = OWNER_PAYMENT_INFO.cashapp;
        route.url = `https://cash.app/${OWNER_PAYMENT_INFO.cashapp}/${request.amount}`;
        route.instructions = this.getCashAppInstructions(request);
        break;

      case 'metamask':
      case 'vibechain':
        route.address = OWNER_PAYMENT_INFO.ethereum;
        route.instructions = this.getCryptoInstructions(request, provider);
        break;
    }

    return route;
  }

  /**
   * Get Stripe instructions
   */
  private getStripeInstructions(request: PaymentRequest): string[] {
    return [
      '1. Click "Pay with Stripe" button',
      '2. Enter your credit/debit card information',
      '3. Complete the secure checkout process',
      '4. You will receive a confirmation email',
      '5. Your purchase will be processed automatically'
    ];
  }

  /**
   * Get PayPal instructions
   */
  private getPayPalInstructions(request: PaymentRequest): string[] {
    return [
      `1. Send $${request.amount} to: ${OWNER_PAYMENT_INFO.paypal}`,
      `2. Or click this link: https://paypal.me/${OWNER_PAYMENT_INFO.paypal}/${request.amount}`,
      '3. Add note: ' + this.getPaymentNote(request),
      '4. Complete PayPal checkout',
      '5. Screenshot confirmation and email to support@vibeverse.io',
      '6. Your account will be credited within 1 hour'
    ];
  }

  /**
   * Get Venmo instructions
   */
  private getVenmoInstructions(request: PaymentRequest): string[] {
    return [
      `1. Open Venmo app or web`,
      `2. Search for: ${OWNER_PAYMENT_INFO.venmo}`,
      `3. Send $${request.amount}`,
      '4. Add note: ' + this.getPaymentNote(request),
      '5. Screenshot confirmation',
      '6. Email screenshot to support@vibeverse.io',
      '7. Your account will be credited within 15 minutes'
    ];
  }

  /**
   * Get Cash App instructions
   */
  private getCashAppInstructions(request: PaymentRequest): string[] {
    return [
      `1. Open Cash App`,
      `2. Search for: ${OWNER_PAYMENT_INFO.cashapp}`,
      `3. Send $${request.amount}`,
      '4. Add note: ' + this.getPaymentNote(request),
      '5. Screenshot confirmation',
      '6. Email screenshot to support@vibeverse.io',
      '7. Your account will be credited within 15 minutes'
    ];
  }

  /**
   * Get crypto instructions
   */
  private getCryptoInstructions(request: PaymentRequest, provider: string): string[] {
    const address = OWNER_PAYMENT_INFO.ethereum;
    const currency = provider === 'vibechain' ? 'SYNTH' : 'ETH/USDC';

    return [
      `1. Open your Web3 wallet (MetaMask, etc.)`,
      `2. Send ${request.amount} ${currency} to:`,
      `   ${address}`,
      '3. VERIFY ADDRESS CAREFULLY - transactions are irreversible',
      `4. Add transaction memo: ${this.getPaymentNote(request)}`,
      '5. Wait for blockchain confirmation (~15 seconds to 5 minutes)',
      '6. Copy transaction hash',
      '7. Email transaction hash to support@vibeverse.io',
      '8. Your account will be credited after confirmation'
    ];
  }

  /**
   * Generate payment note/memo
   */
  private getPaymentNote(request: PaymentRequest): string {
    const parts: string[] = [];
    
    if (request.metadata?.email) {
      parts.push(`Email: ${request.metadata.email}`);
    }
    
    if (request.metadata?.userId) {
      parts.push(`User: ${request.metadata.userId}`);
    }
    
    parts.push(`Type: ${request.type}`);
    
    if (request.metadata?.orderId) {
      parts.push(`Order: ${request.metadata.orderId}`);
    }

    return parts.join(' | ');
  }

  /**
   * Get all available payment methods for user
   */
  getAvailableMethods(userCountry: string = 'US'): string[] {
    return Object.entries(PAYMENT_BRIDGES)
      .filter(([key, bridge]) => {
        if (!bridge.enabled) return false;
        
        // Check geographic availability
        const availability = {
          stripe: ['worldwide'],
          paypal: ['worldwide'],
          venmo: ['US'],
          cashapp: ['US', 'UK'],
          metamask: ['worldwide'],
          vibechain: ['worldwide']
        }[key] || [];

        return availability.includes('worldwide') || availability.includes(userCountry);
      })
      .map(([key]) => key);
  }

  /**
   * Verify payment manually (for P2P methods)
   */
  async verifyManualPayment(
    provider: string,
    confirmationDetails: {
      transactionId?: string;
      screenshot?: string;
      email: string;
      amount: number;
    }
  ): Promise<{ verified: boolean; message: string }> {
    // In production, this would integrate with each provider's API
    // For now, return pending verification
    
    return {
      verified: false,
      message: `Manual verification required. Support team will process within 1 hour. Confirmation ID: ${Date.now()}`
    };
  }

  /**
   * Generate QR code for payment (for P2P/crypto)
   */
  generateQRCode(route: PaymentRoute): string {
    // In production, use a QR code library
    // For now, return data URL placeholder
    
    if (route.url) {
      return `data:qr-code-url,${encodeURIComponent(route.url)}`;
    }
    
    if (route.address) {
      return `data:qr-code-address,${route.address}`;
    }

    return '';
  }
}

/**
 * Global instance
 */
export const paymentBridgeRouter = new PaymentBridgeRouter();
