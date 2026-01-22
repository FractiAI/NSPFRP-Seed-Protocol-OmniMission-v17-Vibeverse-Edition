/**
 * DIRECT GOOGLE OAUTH IMPLEMENTATION
 * Using Google Identity Services (GIS) with direct credentials
 * Project: Syntheverse Whole Brain AI Project
 * NSPFRNP Mode: Real authentication only
 */

export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
  verified_email: boolean;
}

export interface GoogleAuthConfig {
  clientId: string;
  redirectUri?: string;
  scope?: string;
}

export interface AuthState {
  user: GoogleUser | null;
  token: string | null;
  authenticated: boolean;
}

export class DirectGoogleAuth {
  private config: GoogleAuthConfig;
  private authState: AuthState;
  private tokenClient: any;
  private listeners: Array<(state: AuthState) => void> = [];

  constructor(config: GoogleAuthConfig) {
    this.config = {
      ...config,
      redirectUri: config.redirectUri || window.location.origin,
      scope: config.scope || 'email profile openid'
    };
    
    this.authState = {
      user: null,
      token: null,
      authenticated: false
    };

    // Load Google Identity Services
    this.loadGoogleIdentityServices();
  }

  /**
   * Load Google Identity Services library
   */
  private loadGoogleIdentityServices(): void {
    if (document.getElementById('google-gsi-script')) {
      this.initializeGoogleAuth();
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-gsi-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log('✅ Google Identity Services loaded');
      this.initializeGoogleAuth();
    };
    document.head.appendChild(script);
  }

  /**
   * Initialize Google Auth after library is loaded
   */
  private initializeGoogleAuth(): void {
    if (typeof google === 'undefined' || !google.accounts) {
      setTimeout(() => this.initializeGoogleAuth(), 100);
      return;
    }

    // Initialize the Token Client for OAuth 2.0
    this.tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: this.config.clientId,
      scope: this.config.scope,
      callback: (response: any) => {
        if (response.error) {
          console.error('❌ Google Auth Error:', response.error);
          return;
        }
        
        this.handleAuthSuccess(response.access_token);
      }
    });

    // Try to restore session from localStorage
    this.restoreSession();
  }

  /**
   * Sign in with Google
   */
  async signIn(): Promise<GoogleUser> {
    return new Promise((resolve, reject) => {
      if (!this.tokenClient) {
        reject(new Error('Google Auth not initialized'));
        return;
      }

      // Override the callback for this specific signin
      const originalCallback = this.tokenClient.callback;
      this.tokenClient.callback = async (response: any) => {
        if (response.error) {
          this.tokenClient.callback = originalCallback;
          reject(new Error(response.error));
          return;
        }

        try {
          await this.handleAuthSuccess(response.access_token);
          this.tokenClient.callback = originalCallback;
          resolve(this.authState.user!);
        } catch (error) {
          this.tokenClient.callback = originalCallback;
          reject(error);
        }
      };

      // Request access token
      this.tokenClient.requestAccessToken({ prompt: 'consent' });
    });
  }

  /**
   * Handle successful authentication
   */
  private async handleAuthSuccess(accessToken: string): Promise<void> {
    try {
      // Fetch user info from Google
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }

      const userInfo: GoogleUser = await response.json();

      // Update auth state
      this.authState = {
        user: userInfo,
        token: accessToken,
        authenticated: true
      };

      // Save to localStorage
      localStorage.setItem('vibeverse_auth', JSON.stringify({
        user: userInfo,
        token: accessToken,
        timestamp: Date.now()
      }));

      console.log('✅ User authenticated:', userInfo.email);

      // Notify listeners
      this.notifyListeners();
    } catch (error) {
      console.error('❌ Failed to handle auth success:', error);
      throw error;
    }
  }

  /**
   * Sign out
   */
  signOut(): void {
    // Revoke token with Google
    if (this.authState.token && google?.accounts?.oauth2) {
      google.accounts.oauth2.revoke(this.authState.token, () => {
        console.log('✅ Google token revoked');
      });
    }

    // Clear state
    this.authState = {
      user: null,
      token: null,
      authenticated: false
    };

    // Clear localStorage
    localStorage.removeItem('vibeverse_auth');

    console.log('✅ User signed out');

    // Notify listeners
    this.notifyListeners();
  }

  /**
   * Restore session from localStorage
   */
  private async restoreSession(): Promise<void> {
    const stored = localStorage.getItem('vibeverse_auth');
    if (!stored) return;

    try {
      const data = JSON.parse(stored);
      
      // Check if token is still valid (24 hours)
      const age = Date.now() - data.timestamp;
      if (age > 24 * 60 * 60 * 1000) {
        localStorage.removeItem('vibeverse_auth');
        return;
      }

      // Verify token is still valid by making a test request
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          'Authorization': `Bearer ${data.token}`
        }
      });

      if (response.ok) {
        this.authState = {
          user: data.user,
          token: data.token,
          authenticated: true
        };
        console.log('✅ Session restored:', data.user.email);
        this.notifyListeners();
      } else {
        // Token expired or invalid
        localStorage.removeItem('vibeverse_auth');
      }
    } catch (error) {
      console.error('Failed to restore session:', error);
      localStorage.removeItem('vibeverse_auth');
    }
  }

  /**
   * Get current user
   */
  getCurrentUser(): GoogleUser | null {
    return this.authState.user;
  }

  /**
   * Get access token
   */
  getAccessToken(): string | null {
    return this.authState.token;
  }

  /**
   * Check if authenticated
   */
  isAuthenticated(): boolean {
    return this.authState.authenticated;
  }

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (state: AuthState) => void): () => void {
    this.listeners.push(callback);
    
    // Immediately call with current state
    callback(this.authState);

    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  /**
   * Notify all listeners of state change
   */
  private notifyListeners(): void {
    this.listeners.forEach(callback => callback(this.authState));
  }

  /**
   * Get user profile with additional info
   */
  async getUserProfile(): Promise<any> {
    if (!this.authState.token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${this.authState.token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    return response.json();
  }
}

/**
 * Global instance
 */
let globalAuthInstance: DirectGoogleAuth | null = null;

/**
 * Initialize Google Auth with config
 */
export function initDirectGoogleAuth(config: GoogleAuthConfig): DirectGoogleAuth {
  if (!globalAuthInstance) {
    globalAuthInstance = new DirectGoogleAuth(config);
  }
  return globalAuthInstance;
}

/**
 * Get the global auth instance
 */
export function getDirectGoogleAuth(): DirectGoogleAuth {
  if (!globalAuthInstance) {
    throw new Error('Google Auth not initialized. Call initDirectGoogleAuth() first.');
  }
  return globalAuthInstance;
}

/**
 * TypeScript declarations for Google Identity Services
 */
declare global {
  interface Window {
    google: {
      accounts: {
        oauth2: {
          initTokenClient: (config: any) => any;
          revoke: (token: string, callback: () => void) => void;
        };
        id: {
          initialize: (config: any) => void;
          renderButton: (parent: HTMLElement, options: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}
