/**
 * PARTNERS API
 * Handle reseller, influencer, and affiliate applications
 * Process sign-ups and manage partner accounts
 */

import { Router, Request, Response } from 'express';
import { revenueShareSystem } from '../finance/revenue-share-50-50.js';

export interface PartnerApplication {
  name: string;
  email: string;
  phone?: string;
  partnerType: 'reseller' | 'influencer' | 'affiliate';
  website?: string;
  audience?: string;
  strategy: string;
  payoutMethod: 'paypal' | 'venmo' | 'cashapp' | 'ethereum' | 'vibechain';
  payoutAddress: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: Date;
  approvedDate?: Date;
  referralCode?: string;
}

export function createPartnersAPI(): Router {
  const router = Router();

  /**
   * POST /api/partners/apply
   * Submit partner application
   */
  router.post('/apply', async (req: Request, res: Response) => {
    try {
      const {
        name,
        email,
        phone,
        partnerType,
        website,
        audience,
        strategy,
        payoutMethod,
        payoutAddress
      } = req.body;

      // Validate required fields
      if (!name || !email || !partnerType || !strategy || !payoutMethod || !payoutAddress) {
        res.status(400).json({
          success: false,
          error: 'Missing required fields'
        });
        return;
      }

      // Generate referral code
      const referralCode = generateReferralCode(name, email);

      // Create application
      const application: PartnerApplication = {
        name,
        email,
        phone,
        partnerType,
        website,
        audience,
        strategy,
        payoutMethod,
        payoutAddress,
        status: partnerType === 'affiliate' ? 'approved' : 'pending', // Auto-approve affiliates
        appliedDate: new Date(),
        approvedDate: partnerType === 'affiliate' ? new Date() : undefined,
        referralCode
      };

      // Save to database (in production)
      // await saveApplication(application);

      // Send confirmation email (in production)
      // await sendConfirmationEmail(application);

      console.log('✅ Partner application received:', application);

      res.json({
        success: true,
        message: partnerType === 'affiliate' 
          ? 'Welcome! Your referral link is ready.'
          : 'Application submitted! We\'ll review within 24 hours.',
        referralCode,
        referralLink: `https://vibeverse.io?ref=${referralCode}`,
        status: application.status
      });

    } catch (error) {
      console.error('Partner application error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Application failed'
      });
    }
  });

  /**
   * GET /api/partners/status/:email
   * Check application status
   */
  router.get('/status/:email', async (req: Request, res: Response) => {
    try {
      const { email } = req.params;

      // Fetch from database (in production)
      // const application = await getApplicationByEmail(email);

      // Mock response
      res.json({
        success: true,
        status: 'approved',
        referralCode: 'DEMO123',
        referralLink: `https://vibeverse.io?ref=DEMO123`,
        earnings: {
          total: 1234.56,
          pending: 234.56,
          thisMonth: 456.78
        }
      });

    } catch (error) {
      console.error('Status check error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Status check failed'
      });
    }
  });

  /**
   * GET /api/partners/dashboard/:referralCode
   * Get partner dashboard data
   */
  router.get('/dashboard/:referralCode', async (req: Request, res: Response) => {
    try {
      const { referralCode } = req.params;

      // Fetch partner data (in production)
      // const partner = await getPartnerByReferralCode(referralCode);
      // const transactions = await getPartnerTransactions(partner.id);

      // Mock dashboard data
      const dashboardData = {
        partner: {
          name: 'Demo Partner',
          email: 'partner@example.com',
          type: 'reseller',
          tier: 'gold',
          joinedDate: new Date('2026-01-01')
        },
        earnings: {
          today: 123.45,
          thisWeek: 678.90,
          thisMonth: 2345.67,
          allTime: 12345.67,
          pendingPayout: 456.78
        },
        referrals: {
          total: 50,
          active: 42,
          inactive: 8,
          conversionRate: 35.5
        },
        topChannels: [
          { channelId: 'reseller', name: 'Reseller', earnings: 8000, percent: 64.7 },
          { channelId: 'referral', name: 'Referral', earnings: 3000, percent: 24.3 },
          { channelId: 'affiliate', name: 'Affiliate', earnings: 1345.67, percent: 10.9 }
        ],
        nextPayout: {
          amount: 456.78,
          date: new Date(Date.now() + 86400000 * 3), // 3 days from now
          method: 'paypal'
        }
      };

      res.json({
        success: true,
        dashboard: dashboardData
      });

    } catch (error) {
      console.error('Dashboard error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Dashboard load failed'
      });
    }
  });

  /**
   * POST /api/partners/payout
   * Request manual payout
   */
  router.post('/payout', async (req: Request, res: Response) => {
    try {
      const { partnerId, amount, payoutMethod } = req.body;

      if (!partnerId || !amount || !payoutMethod) {
        res.status(400).json({
          success: false,
          error: 'Missing required fields'
        });
        return;
      }

      // Process payout
      const result = await revenueShareSystem.processPayout(
        partnerId,
        amount,
        payoutMethod
      );

      res.json({
        success: true,
        payout: result
      });

    } catch (error) {
      console.error('Payout error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Payout failed'
      });
    }
  });

  return router;
}

/**
 * Generate unique referral code
 */
function generateReferralCode(name: string, email: string): string {
  const namePart = name.replace(/\s+/g, '').substring(0, 4).toUpperCase();
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${namePart}${randomPart}`;
}
