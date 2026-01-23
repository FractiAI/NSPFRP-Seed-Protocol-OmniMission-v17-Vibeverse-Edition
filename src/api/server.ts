/**
 * Express Server for Post-Singularity Game Launch API
 * VibeCloud Platform
 */

import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createStripeLaunchAPI } from './stripe-launch-api.js';
import { createAuthAPI } from './auth-api.js';
import { unifiedVChipPortfolioWallet } from '../integration/unified-vchip-portfolio-wallet.js';
import { fiveStarTravelPackageSystem } from '../travel/5-star-travel-package-system.js';

export interface ServerConfig {
  port: number;
  stripeSecretKey: string;
  openingDate: number;
  corsOrigin?: string;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  redirectUrl?: string;
}

export class PostSingularityServer {
  private app: Express;
  private config: ServerConfig;

  constructor(config: ServerConfig) {
    this.app = express();
    this.config = config;
    this.setupMiddleware();
    this.setupRoutes();
  }

  /**
   * Setup middleware
   */
  private setupMiddleware(): void {
    // Security
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "https://js.stripe.com"],
          frameSrc: ["'self'", "https://js.stripe.com"],
          connectSrc: ["'self'", "https://api.stripe.com"]
        }
      }
    }));

    // CORS
    this.app.use(cors({
      origin: this.config.corsOrigin || '*',
      credentials: true
    }));

    // JSON parsing
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Static files
    this.app.use(express.static('interfaces'));
  }

  /**
   * Setup routes
   */
  private setupRoutes(): void {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        timestamp: Date.now(),
        platform: 'VibeCloud',
        game: 'Post-Singularity'
      });
    });

    // Auth API (Google OAuth)
    if (this.config.supabaseUrl && this.config.supabaseAnonKey) {
      const authAPI = createAuthAPI({
        supabaseUrl: this.config.supabaseUrl,
        supabaseAnonKey: this.config.supabaseAnonKey,
        redirectUrl: this.config.redirectUrl || `http://localhost:${this.config.port}/auth/callback`
      });
      this.app.use('/api/auth', authAPI);
    }

    // Stripe Launch API
    const stripeLaunchAPI = createStripeLaunchAPI(
      this.config.stripeSecretKey,
      this.config.openingDate
    );
    this.app.use('/api/launch', stripeLaunchAPI);

    // Auth pages
    this.app.get('/login', (req, res) => {
      res.sendFile('auth-login.html', { root: 'interfaces' });
    });

    this.app.get('/auth/callback', (req, res) => {
      res.sendFile('auth-callback.html', { root: 'interfaces' });
    });

    this.app.get('/dashboard', (req, res) => {
      res.sendFile('dashboard.html', { root: 'interfaces' });
    });

    // Serve main launch page
    this.app.get('/', (req, res) => {
      res.sendFile('index.html', { root: '.' });
    });

    // Serve floating catalog
    this.app.get('/catalog', (req, res) => {
      res.sendFile('floating-catalog-icon.html', { root: 'interfaces' });
    });

    // Snap Pad · VibePad console (floating iPad, mic, snap mode)
    this.app.get('/snap-pad', (req, res) => {
      res.sendFile('snap-pad-vibepad-console.html', { root: 'interfaces' });
    });

    // Ultimate VIP Popup Landing (with button to Vibesphere console)
    this.app.get('/ultimate-vip-popup', (req, res) => {
      res.sendFile('ultimate-vip-popup-landing.html', { root: 'interfaces' });
    });

    // Ultimate VIP Creator Chairman Console (Vibesphere)
    this.app.get('/vibesphere', (req, res) => {
      res.sendFile('ultimate-vip-chairman-creator-console.html', { root: 'interfaces' });
    });

    // Nate → Shaman Wellness Bohio (button + popup)
    this.app.get('/nate-bohio', (req, res) => {
      res.sendFile('nate-shaman-wellness-bohio-button.html', { root: 'interfaces' });
    });

    // Interactive AI Consultation (Nate → Bohio) - Interactive session like other NSPFRNP experiences
    this.app.get('/nate-bohio-consultation', (req, res) => {
      res.sendFile('nate-bohio-interactive-consultation.html', { root: 'interfaces' });
    });

    // Reception Kiosk (Nate → Bohio)
    this.app.get('/reception-kiosk', (req, res) => {
      res.sendFile('reception-kiosk-nate-bohio.html', { root: 'interfaces' });
    });

    // Portfolio & Wallet Dashboard
    this.app.get('/portfolio', (req, res) => {
      res.sendFile('portfolio-wallet-dashboard.html', { root: 'interfaces' });
    });

    // 5-Star Travel Package Booking
    this.app.get('/travel', (req, res) => {
      res.sendFile('5-star-travel-package-booking.html', { root: 'interfaces' });
    });

    // Travel Package API endpoints
    this.setupTravelPackageAPI();

    // Portfolio & Wallet API endpoints
    this.setupPortfolioWalletAPI();

    // Success page
    this.app.get('/success', (req, res) => {
      res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Purchase Successful - Post-Singularity Game</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
              background: linear-gradient(135deg, #000000 0%, #1a0033 50%, #000000 100%);
              color: #ffffff;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              padding: 20px;
            }
            .success-container {
              background: rgba(255, 255, 255, 0.05);
              backdrop-filter: blur(20px);
              border: 3px solid rgba(0, 255, 0, 0.5);
              border-radius: 30px;
              padding: 60px 40px;
              text-align: center;
              max-width: 600px;
            }
            h1 {
              font-size: 3em;
              color: #00ff00;
              margin-bottom: 20px;
            }
            p {
              font-size: 1.2em;
              line-height: 1.8;
              color: #ccc;
              margin: 20px 0;
            }
            .button {
              display: inline-block;
              margin-top: 30px;
              padding: 15px 40px;
              background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
              color: #000;
              text-decoration: none;
              border-radius: 50px;
              font-weight: bold;
              font-size: 1.2em;
            }
          </style>
        </head>
        <body>
          <div class="success-container">
            <h1>✅ Purchase Successful!</h1>
            <p>Welcome to Post-Singularity Game on VibeCloud!</p>
            <p>Your vCHIP is being deployed automatically. You'll receive an email with your access details shortly.</p>
            <p><strong>🔑 AWARENESS KEY:</strong> If you purchased OCTANE tier, your Awareness Key has been delivered automatically.</p>
            <a href="/" class="button">Go to Dashboard</a>
          </div>
        </body>
        </html>
      `);
    });

    // Cancel page
    this.app.get('/cancel', (req, res) => {
      res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Purchase Cancelled - Post-Singularity Game</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
              background: linear-gradient(135deg, #000000 0%, #1a0033 50%, #000000 100%);
              color: #ffffff;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              padding: 20px;
            }
            .cancel-container {
              background: rgba(255, 255, 255, 0.05);
              backdrop-filter: blur(20px);
              border: 3px solid rgba(255, 165, 0, 0.5);
              border-radius: 30px;
              padding: 60px 40px;
              text-align: center;
              max-width: 600px;
            }
            h1 {
              font-size: 3em;
              color: #FFA500;
              margin-bottom: 20px;
            }
            p {
              font-size: 1.2em;
              line-height: 1.8;
              color: #ccc;
              margin: 20px 0;
            }
            .button {
              display: inline-block;
              margin-top: 30px;
              padding: 15px 40px;
              background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
              color: #000;
              text-decoration: none;
              border-radius: 50px;
              font-weight: bold;
              font-size: 1.2em;
            }
          </style>
        </head>
        <body>
          <div class="cancel-container">
            <h1>Purchase Cancelled</h1>
            <p>No worries! You can still start with Sandbox tier for FREE forever.</p>
            <p>When you're ready, we'll be here.</p>
            <a href="/" class="button">Return to Home</a>
          </div>
        </body>
        </html>
      `);
    });
  }

  /**
   * GET /vchips - Get all available vCHIPs
   */
  private getVCHIPs(req: Request, res: Response): void {
    try {
      const vchips = this.deploymentSystem.getAllVCHIPs();
      res.json({
        success: true,
        vchips
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * POST /deploy/vchip - Deploy vCHIP
   */
  private async deployVCHIP(req: Request, res: Response): Promise<void> {
    try {
      const { stationId, vchipId, target, accessLevel, autoExecute } = req.body;

      if (!stationId || !vchipId || !target) {
        res.status(400).json({
          success: false,
          error: 'stationId, vchipId, and target are required'
        });
        return;
      }

      const result = await this.deploymentSystem.deployVCHIP(
        stationId,
        vchipId,
        target,
        accessLevel || 'admin',
        autoExecute !== false
      );

      res.json({
        success: true,
        result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * POST /deploy/all - Deploy all vCHIPs
   */
  private async deployAll(req: Request, res: Response): Promise<void> {
    try {
      const { owner } = req.body;

      if (!owner) {
        res.status(400).json({
          success: false,
          error: 'owner is required'
        });
        return;
      }

      const status = await this.deployer.deployAllNow(owner);

      res.json({
        success: true,
        status,
        message: '🎉 All vCHIPs deployed successfully!'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * POST /webhook/stripe - Handle Stripe webhooks
   */
  private async handleStripeWebhook(req: Request, res: Response): Promise<void> {
    try {
      const event = req.body;

      if (event.type === 'checkout.session.completed') {
        const result = await this.launch.handlePaymentSuccess(event.data.object.id);
        
        // If OCTANE tier, check for Awareness Key delivery
        if (event.data.object.metadata?.tier === 'octane') {
          console.log('✅ OCTANE purchase completed with Awareness Key');
        }

        res.json({
          success: true,
          received: true,
          result
        });
      } else {
        res.json({
          success: true,
          received: true
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * GET /awareness-key/:email - Get Awareness Key status
   */
  private getAwarenessKeyStatus(req: Request, res: Response): void {
    try {
      const { email } = req.params;
      const hasKey = this.awarenessKeyDelivery.hasActiveAwarenessKey(email);
      const key = this.awarenessKeyDelivery.getAwarenessKey(email);
      const deliveries = this.awarenessKeyDelivery.getUserDeliveries(email);

      res.json({
        success: true,
        hasActiveKey: hasKey,
        key,
        deliveries
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Setup Travel Package API endpoints
   */
  private setupTravelPackageAPI(): void {
    // Get all destinations
    this.app.get('/api/travel/destinations', (req, res) => {
      try {
        const destinations = fiveStarTravelPackageSystem.getAllDestinations();
        res.json({ success: true, destinations });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Get destination by ID
    this.app.get('/api/travel/destination/:id', (req, res) => {
      try {
        const destinations = fiveStarTravelPackageSystem.getAllDestinations();
        const destination = destinations.find(d => d.id === req.params.id);
        
        if (!destination) {
          return res.status(404).json({
            success: false,
            error: 'Destination not found'
          });
        }
        
        res.json({ success: true, destination });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Get available hero hosts
    this.app.get('/api/travel/hero-hosts', (req, res) => {
      try {
        const { HERO_HOSTS } = require('../mission-craft/welcome-console.js');
        const heroHosts = Object.values(HERO_HOSTS);
        res.json({ success: true, heroHosts });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Get all star plans
    this.app.get('/api/travel/star-plans', (req, res) => {
      try {
        const starPlans = fiveStarTravelPackageSystem.getAllStarPlans();
        res.json({ success: true, starPlans });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Get star plan by rating
    this.app.get('/api/travel/star-plan/:stars', (req, res) => {
      try {
        const stars = parseInt(req.params.stars);
        if (stars < 1 || stars > 5) {
          return res.status(400).json({
            success: false,
            error: 'Star rating must be between 1 and 5'
          });
        }
        const starPlan = fiveStarTravelPackageSystem.getStarPlan(stars as any);
        if (!starPlan) {
          return res.status(404).json({
            success: false,
            error: 'Star plan not found'
          });
        }
        res.json({ success: true, starPlan });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Create travel package
    this.app.post('/api/travel/create-package', async (req, res) => {
      try {
        const { owner, destinationId, heroHostName, customizations, tier } = req.body;
        
        const travelPackage = await fiveStarTravelPackageSystem.createTravelPackage(
          owner,
          destinationId,
          heroHostName,
          customizations,
          tier
        );
        
        res.json({ success: true, package: travelPackage });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Deliver travel package (vCHIP + Golden Key)
    this.app.post('/api/travel/deliver/:packageId', async (req, res) => {
      try {
        const { packageId } = req.params;
        const result = await fiveStarTravelPackageSystem.deliverTravelPackage(packageId);
        res.json({ success: true, ...result });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Get package by ID
    this.app.get('/api/travel/package/:id', (req, res) => {
      try {
        const travelPackage = fiveStarTravelPackageSystem.getPackage(req.params.id);
        
        if (!travelPackage) {
          return res.status(404).json({
            success: false,
            error: 'Travel package not found'
          });
        }
        
        res.json({ success: true, package: travelPackage });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Get packages by owner
    this.app.get('/api/travel/packages/:owner', (req, res) => {
      try {
        const packages = fiveStarTravelPackageSystem.getPackagesByOwner(req.params.owner);
        res.json({ success: true, packages, count: packages.length });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });
  }

  /**
   * Setup Portfolio & Wallet API endpoints
   */
  private setupPortfolioWalletAPI(): void {
    // Get portfolio for owner
    this.app.get('/api/portfolio/:owner', async (req, res) => {
      try {
        const { owner } = req.params;
        const portfolio = await unifiedVChipPortfolioWallet.getPortfolio(owner);
        
        if (!portfolio) {
          // Initialize if doesn't exist
          const newPortfolio = await unifiedVChipPortfolioWallet.initializePortfolio(owner);
          return res.json({ success: true, portfolio: newPortfolio });
        }
        
        res.json({ success: true, portfolio });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Initialize portfolio
    this.app.post('/api/portfolio/:owner/initialize', async (req, res) => {
      try {
        const { owner } = req.params;
        const { identityData } = req.body;
        const portfolio = await unifiedVChipPortfolioWallet.initializePortfolio(owner, identityData);
        res.json({ success: true, portfolio });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Burn vCHIP for portfolio
    this.app.post('/api/portfolio/:owner/burn-vchip', async (req, res) => {
      try {
        const { owner } = req.params;
        const { chairmanStationId } = req.body;
        const vchip = await unifiedVChipPortfolioWallet.burnVChipForPortfolio(owner, chairmanStationId);
        const portfolio = await unifiedVChipPortfolioWallet.getPortfolio(owner);
        res.json({ success: true, vchip, portfolio });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Burn awareness key for portfolio
    this.app.post('/api/portfolio/:owner/burn-key', async (req, res) => {
      try {
        const { owner } = req.params;
        const { keyType, octaveAccess } = req.body;
        const key = await unifiedVChipPortfolioWallet.burnAwarenessKeyForPortfolio(
          owner,
          keyType || 'dual',
          octaveAccess || [1, 2, 3, 4, 5, 6, 7, 8]
        );
        const portfolio = await unifiedVChipPortfolioWallet.getPortfolio(owner);
        res.json({ success: true, key, portfolio });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Complete burn operation (vCHIP + Key)
    this.app.post('/api/portfolio/:owner/burn-complete', async (req, res) => {
      try {
        const { owner } = req.params;
        const { chairmanStationId } = req.body;
        const result = await unifiedVChipPortfolioWallet.completeBurnOperation(owner, chairmanStationId);
        res.json({ success: true, ...result });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Update portfolio
    this.app.put('/api/portfolio/:owner', async (req, res) => {
      try {
        const { owner } = req.params;
        const updates = req.body;
        const portfolio = await unifiedVChipPortfolioWallet.updatePortfolio(owner, updates);
        res.json({ success: true, portfolio });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Get all portfolios (admin)
    this.app.get('/api/portfolios', (req, res) => {
      try {
        const portfolios = unifiedVChipPortfolioWallet.getAllPortfolios();
        res.json({ success: true, portfolios, count: portfolios.length });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });
  }

  /**
   * Start server
   */
  async start(): Promise<void> {
    return new Promise((resolve) => {
      this.app.listen(this.config.port, () => {
        console.log('🚀 Post-Singularity Game Launch Server Started');
        console.log(`📍 Port: ${this.config.port}`);
        console.log(`🌐 Platform: VibeCloud (Not SpinCloud)`);
        console.log(`💰 Pricing: $1/SYNTH opening day, then $1/SYNTH/day`);
        console.log(`🔑 AWARENESS KEY: Included in all OCTANE purchases/leases`);
        console.log(`\n✅ Server is ready for Stripe launch!`);
        resolve();
      });
    });
  }

  /**
   * Go live - activate launch
   */
  async goLive(): Promise<void> {
    await this.launch.goLive();
    console.log('🎉 POST-SINGULARITY GAME IS NOW LIVE!');
  }
}

/**
 * Create and start server
 */
export async function startServer(config: ServerConfig): Promise<PostSingularityServer> {
  const server = new PostSingularityServer(config);
  await server.start();
  return server;
}
