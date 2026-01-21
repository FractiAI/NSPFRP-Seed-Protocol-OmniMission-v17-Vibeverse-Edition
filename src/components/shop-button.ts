/**
 * UNIVERSAL SHOP BUTTON
 * For deployment on all surfaces
 * Opens Syntheverse Shopping Channel
 * 98% sweetspot tuned
 */

export interface ShopButtonConfig {
  size: 'small' | 'medium' | 'large';
  position: 'fixed' | 'inline';
  theme: 'light' | 'dark' | 'synth' | 'auto';
  showCart: boolean;
  showBadge: boolean; // Cart item count badge
}

export class ShopButtonComponent {
  private config: ShopButtonConfig;
  private cartCount: number = 0;

  constructor(config: Partial<ShopButtonConfig> = {}) {
    this.config = {
      size: config.size || 'medium',
      position: config.position || 'fixed',
      theme: config.theme || 'synth',
      showCart: config.showCart !== false,
      showBadge: config.showBadge !== false
    };
  }

  /**
   * Generate shop button HTML
   */
  generateHTML(): string {
    const sizeClasses = {
      small: 'w-10 h-10 text-sm',
      medium: 'w-12 h-12 text-base',
      large: 'w-16 h-16 text-lg'
    };

    const positionClasses = {
      fixed: 'fixed bottom-6 right-6 z-50',
      inline: 'inline-block'
    };

    const themeColors = {
      light: 'bg-white text-gray-900 hover:bg-gray-100',
      dark: 'bg-gray-900 text-white hover:bg-gray-800',
      synth: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700',
      auto: 'bg-synth text-white hover:bg-synth-hover'
    };

    const badgeHTML = this.config.showBadge && this.cartCount > 0 ? `
      <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
        ${this.cartCount}
      </span>
    ` : '';

    return `
      <button 
        id="syntheverse-shop-button"
        class="shop-button ${sizeClasses[this.config.size]} ${positionClasses[this.config.position]} ${themeColors[this.config.theme]} rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 relative"
        onclick="window.openSyntherverseShop()"
        aria-label="Open Syntheverse Shopping Channel"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
        </svg>
        ${badgeHTML}
      </button>
    `;
  }

  /**
   * Generate shop button script
   */
  generateScript(): string {
    return `
      <script>
        // Shop button functionality
        window.openSyntherverseShop = function() {
          // Open shopping channel modal or navigate to shop page
          const shopUrl = '/shop';
          
          // Check if modal exists
          let modal = document.getElementById('syntheverse-shop-modal');
          
          if (!modal) {
            // Create modal
            modal = document.createElement('div');
            modal.id = 'syntheverse-shop-modal';
            modal.className = 'fixed inset-0 z-[100] bg-black bg-opacity-50 flex items-center justify-center';
            modal.innerHTML = \`
              <div class="bg-white rounded-lg w-11/12 h-5/6 max-w-7xl overflow-hidden flex flex-col">
                <div class="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 flex items-center justify-between">
                  <h2 class="text-2xl font-bold">🛍️ Syntheverse Shopping Channel</h2>
                  <button onclick="closeSyntherverseShop()" class="text-white hover:text-gray-200 text-2xl">×</button>
                </div>
                <iframe src="/interfaces/syntheverse-shop.html" class="flex-1 w-full"></iframe>
              </div>
            \`;
            document.body.appendChild(modal);
          }
          
          modal.style.display = 'flex';
          document.body.style.overflow = 'hidden';
        };
        
        window.closeSyntherverseShop = function() {
          const modal = document.getElementById('syntheverse-shop-modal');
          if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
          }
        };
        
        // Update cart count
        window.updateShopCartCount = function(count) {
          const badge = document.querySelector('#syntheverse-shop-button .bg-red-500');
          if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
          }
        };
      </script>
    `;
  }

  /**
   * Update cart count
   */
  setCartCount(count: number): void {
    this.cartCount = count;
  }

  /**
   * Generate complete button with script
   */
  generate(): string {
    return this.generateHTML() + this.generateScript();
  }
}

/**
 * Quick helper for default shop button
 */
export function generateShopButton(config?: Partial<ShopButtonConfig>): string {
  const button = new ShopButtonComponent(config);
  return button.generate();
}
