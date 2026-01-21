/**
 * GOOGLE AUTHENTICATION SYSTEM
 * Sign in/Sign up with Google OAuth via Supabase
 * Vibeverse + Shell tiers with Stripe Connect integration
 * NSPFRNP Mode: Natural coordination
 */

import { createClient, SupabaseClient, User } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  tier: 'sandbox' | 'cloud' | 'octane' | 'shell' | 'ultimate';
  octave: number;
  synthBalance: number;
  stripeCustomerId?: string;
  walletAddress?: string;
  createdAt: Date;
  lastLogin: Date;
}

export interface GoogleAuthConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  redirectUrl?: string;
}

export class GoogleAuthSystem {
  private supabase: SupabaseClient;
  private redirectUrl: string;

  constructor(config: GoogleAuthConfig) {
    this.supabase = createClient(config.supabaseUrl, config.supabaseAnonKey);
    this.redirectUrl = config.redirectUrl || 'http://localhost:3000/auth/callback';
  }

  /**
   * Sign in with Google
   */
  async signInWithGoogle(): Promise<{ url: string; provider: string }> {
    const { data, error } = await this.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: this.redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        scopes: 'email profile'
      }
    });

    if (error) {
      throw new Error(`Google sign-in failed: ${error.message}`);
    }

    return {
      url: data.url,
      provider: data.provider
    };
  }

  /**
   * Sign up with Google (same as sign in with OAuth)
   */
  async signUpWithGoogle(): Promise<{ url: string; provider: string }> {
    return this.signInWithGoogle();
  }

  /**
   * Handle OAuth callback and session
   */
  async handleOAuthCallback(): Promise<AuthUser | null> {
    const { data: { session }, error } = await this.supabase.auth.getSession();

    if (error || !session) {
      throw new Error(`Failed to get session: ${error?.message || 'No session'}`);
    }

    // Create or update user in our system
    const authUser = await this.createOrUpdateUser(session.user);
    
    console.log('✅ User authenticated via Google:', authUser.email);
    return authUser;
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<AuthUser | null> {
    const { data: { session }, error } = await this.supabase.auth.getSession();

    if (error || !session) {
      return null;
    }

    return this.createOrUpdateUser(session.user);
  }

  /**
   * Sign out
   */
  async signOut(): Promise<void> {
    const { error } = await this.supabase.auth.signOut();
    
    if (error) {
      throw new Error(`Sign out failed: ${error.message}`);
    }

    console.log('✅ User signed out');
  }

  /**
   * Create or update user in database
   */
  private async createOrUpdateUser(supabaseUser: User): Promise<AuthUser> {
    const { data: existingUser, error: fetchError } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', supabaseUser.id)
      .single();

    const userData: AuthUser = {
      id: supabaseUser.id,
      email: supabaseUser.email!,
      name: supabaseUser.user_metadata.full_name || supabaseUser.user_metadata.name || supabaseUser.email!,
      avatar: supabaseUser.user_metadata.avatar_url || supabaseUser.user_metadata.picture,
      tier: existingUser?.tier || 'sandbox',
      octave: existingUser?.octave || 0,
      synthBalance: existingUser?.synth_balance || 0,
      stripeCustomerId: existingUser?.stripe_customer_id,
      walletAddress: existingUser?.wallet_address,
      createdAt: existingUser?.created_at ? new Date(existingUser.created_at) : new Date(),
      lastLogin: new Date()
    };

    if (existingUser) {
      // Update existing user
      const { error: updateError } = await this.supabase
        .from('users')
        .update({
          name: userData.name,
          avatar: userData.avatar,
          last_login: userData.lastLogin.toISOString()
        })
        .eq('id', supabaseUser.id);

      if (updateError) {
        console.warn('Failed to update user:', updateError.message);
      }
    } else {
      // Create new user with sandbox tier
      const { error: insertError } = await this.supabase
        .from('users')
        .insert({
          id: userData.id,
          email: userData.email,
          name: userData.name,
          avatar: userData.avatar,
          tier: 'sandbox',
          octave: 0,
          synth_balance: 0,
          created_at: userData.createdAt.toISOString(),
          last_login: userData.lastLogin.toISOString()
        });

      if (insertError) {
        console.warn('Failed to create user:', insertError.message);
      }
    }

    return userData;
  }

  /**
   * Update user tier (after purchase)
   */
  async updateUserTier(
    userId: string,
    tier: AuthUser['tier'],
    octave: number,
    stripeCustomerId?: string
  ): Promise<void> {
    const { error } = await this.supabase
      .from('users')
      .update({
        tier,
        octave,
        ...(stripeCustomerId && { stripe_customer_id: stripeCustomerId })
      })
      .eq('id', userId);

    if (error) {
      throw new Error(`Failed to update user tier: ${error.message}`);
    }

    console.log(`✅ User tier updated: ${tier} (Octave ${octave})`);
  }

  /**
   * Update user SYNTH balance
   */
  async updateSynthBalance(userId: string, amount: number, operation: 'add' | 'subtract' | 'set'): Promise<number> {
    const user = await this.getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    let newBalance: number;
    switch (operation) {
      case 'add':
        newBalance = user.synthBalance + amount;
        break;
      case 'subtract':
        newBalance = Math.max(0, user.synthBalance - amount);
        break;
      case 'set':
        newBalance = amount;
        break;
    }

    const { error } = await this.supabase
      .from('users')
      .update({ synth_balance: newBalance })
      .eq('id', userId);

    if (error) {
      throw new Error(`Failed to update SYNTH balance: ${error.message}`);
    }

    console.log(`✅ SYNTH balance updated: ${newBalance.toLocaleString()} SYNTH`);
    return newBalance;
  }

  /**
   * Link Stripe customer to user
   */
  async linkStripeCustomer(userId: string, stripeCustomerId: string): Promise<void> {
    const { error } = await this.supabase
      .from('users')
      .update({ stripe_customer_id: stripeCustomerId })
      .eq('id', userId);

    if (error) {
      throw new Error(`Failed to link Stripe customer: ${error.message}`);
    }

    console.log(`✅ Stripe customer linked: ${stripeCustomerId}`);
  }

  /**
   * Link wallet address to user
   */
  async linkWalletAddress(userId: string, walletAddress: string): Promise<void> {
    const { error } = await this.supabase
      .from('users')
      .update({ wallet_address: walletAddress })
      .eq('id', userId);

    if (error) {
      throw new Error(`Failed to link wallet: ${error.message}`);
    }

    console.log(`✅ Wallet linked: ${walletAddress}`);
  }

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (user: AuthUser | null) => void): void {
    this.supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`🔐 Auth state changed: ${event}`);
      
      if (session?.user) {
        const authUser = await this.createOrUpdateUser(session.user);
        callback(authUser);
      } else {
        callback(null);
      }
    });
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const { data: { session } } = await this.supabase.auth.getSession();
    return !!session;
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<AuthUser | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      email: data.email,
      name: data.name,
      avatar: data.avatar,
      tier: data.tier,
      octave: data.octave,
      synthBalance: data.synth_balance,
      stripeCustomerId: data.stripe_customer_id,
      walletAddress: data.wallet_address,
      createdAt: new Date(data.created_at),
      lastLogin: new Date(data.last_login)
    };
  }
}

/**
 * Global instance
 */
let googleAuthSystem: GoogleAuthSystem | null = null;

export function initGoogleAuth(config: GoogleAuthConfig): GoogleAuthSystem {
  googleAuthSystem = new GoogleAuthSystem(config);
  return googleAuthSystem;
}

export function getGoogleAuth(): GoogleAuthSystem {
  if (!googleAuthSystem) {
    throw new Error('Google Auth not initialized. Call initGoogleAuth() first.');
  }
  return googleAuthSystem;
}

/**
 * Supabase SQL schema for users table
 * 
 * CREATE TABLE users (
 *   id UUID PRIMARY KEY REFERENCES auth.users(id),
 *   email TEXT UNIQUE NOT NULL,
 *   name TEXT NOT NULL,
 *   avatar TEXT,
 *   tier TEXT NOT NULL DEFAULT 'sandbox',
 *   octave INTEGER NOT NULL DEFAULT 0,
 *   synth_balance BIGINT NOT NULL DEFAULT 0,
 *   stripe_customer_id TEXT,
 *   wallet_address TEXT,
 *   created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 *   last_login TIMESTAMPTZ NOT NULL DEFAULT NOW()
 * );
 * 
 * CREATE INDEX idx_users_email ON users(email);
 * CREATE INDEX idx_users_stripe_customer ON users(stripe_customer_id);
 */
