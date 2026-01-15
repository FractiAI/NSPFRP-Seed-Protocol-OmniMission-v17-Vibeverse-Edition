/**
 * Free Cloud Deploy UI Port
 * User interface for AI-assisted free cloud deployment
 */

import { DeploymentPlatform, CloudDeploymentConfig } from '../types/index.js';

export interface FreeCloudDeployUIProps {
  protocolId: string;
  protocolName: string;
  availablePlatforms: DeploymentPlatform[];
  aiAssisted: boolean;
  onDeploy: (platform: DeploymentPlatform, config: CloudDeploymentConfig) => Promise<void>;
  onAIAssist: () => Promise<void>;
}

export interface DeploymentStatus {
  platform: DeploymentPlatform;
  status: 'idle' | 'selecting' | 'creating-account' | 'connecting' | 'deploying' | 'active' | 'failed';
  url?: string;
  message?: string;
  progress?: number;
}

export class FreeCloudDeployUI {
  private protocolId: string;
  private protocolName: string;
  private availablePlatforms: DeploymentPlatform[];
  private aiAssisted: boolean;
  private deployments: Map<DeploymentPlatform, DeploymentStatus>;
  private onDeploy: (platform: DeploymentPlatform, config: CloudDeploymentConfig) => Promise<void>;
  private onAIAssist: () => Promise<void>;

  constructor(props: FreeCloudDeployUIProps) {
    this.protocolId = props.protocolId;
    this.protocolName = props.protocolName;
    this.availablePlatforms = props.availablePlatforms;
    this.aiAssisted = props.aiAssisted;
    this.deployments = new Map();
    this.onDeploy = props.onDeploy;
    this.onAIAssist = props.onAIAssist;

    // Initialize deployment statuses
    this.availablePlatforms.forEach(platform => {
      this.deployments.set(platform, {
        platform,
        status: 'idle'
      });
    });
  }

  /**
   * Render UI component
   */
  render(): string {
    return `
      <div class="nspfrp-free-cloud-deploy-ui next-octave">
        ${this.renderHeader()}
        ${this.renderAIAssistButton()}
        ${this.renderPlatformGrid()}
        ${this.renderDeploymentStatus()}
        ${this.renderDeployButtons()}
      </div>
    `;
  }

  /**
   * Render header
   */
  private renderHeader(): string {
    return `
      <div class="deploy-header">
        <h2>🌐 Free Cloud Deploy: ${this.protocolName}</h2>
        <p class="protocol-id">Protocol ID: ${this.protocolId}</p>
        <p class="ai-status">${this.aiAssisted ? '✅ AI-Assisted Mode Active' : '⚠️ AI-Assisted Mode Inactive'}</p>
      </div>
    `;
  }

  /**
   * Render AI Assist button
   */
  private renderAIAssistButton(): string {
    return `
      <div class="ai-assist-section">
        <button 
          class="ai-assist-button next-octave"
          onclick="window.nspfrpFreeCloudDeployUI.requestAIAssist()"
          data-ai-assisted="${this.aiAssisted}">
          <span class="ai-icon">🤖</span>
          <span class="ai-text">AI Assist: Auto-Select & Deploy</span>
          <span class="ai-badge">Next Octave</span>
        </button>
        <div class="ai-assist-info">
          <p>AI will automatically:</p>
          <ul>
            <li>✅ Select optimal platform (no-account preferred)</li>
            <li>✅ Create accounts when needed (via GitHub OAuth)</li>
            <li>✅ Handle all connection & authentication</li>
            <li>✅ Deploy to multiple platforms simultaneously</li>
            <li>✅ Generate deployment buttons</li>
          </ul>
        </div>
      </div>
    `;
  }

  /**
   * Render platform grid
   */
  private renderPlatformGrid(): string {
    const tier1Platforms = this.availablePlatforms.filter(p => 
      ['glitch', 'surge', 'ipfs'].includes(p)
    );
    const tier2Platforms = this.availablePlatforms.filter(p => 
      !['glitch', 'surge', 'ipfs'].includes(p)
    );

    return `
      <div class="platform-grid">
        <div class="platform-tier">
          <h3>🚀 Tier 1: No Account Required (Instant Deploy)</h3>
          <div class="platform-cards">
            ${tier1Platforms.map(platform => this.renderPlatformCard(platform, true)).join('')}
          </div>
        </div>
        <div class="platform-tier">
          <h3>⚡ Tier 2: AI-Assisted Account Creation</h3>
          <div class="platform-cards">
            ${tier2Platforms.map(platform => this.renderPlatformCard(platform, false)).join('')}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render platform card
   */
  private renderPlatformCard(platform: DeploymentPlatform, noAccount: boolean): string {
    const status = this.deployments.get(platform);
    const platformInfo = this.getPlatformInfo(platform);

    return `
      <div class="platform-card" data-platform="${platform}">
        <div class="platform-header">
          <span class="platform-icon">${platformInfo.icon}</span>
          <h4>${platformInfo.name}</h4>
          ${noAccount ? '<span class="no-account-badge">No Account</span>' : '<span class="ai-account-badge">AI Account</span>'}
        </div>
        <div class="platform-features">
          <ul>
            ${platformInfo.features.map(f => `<li>${f}</li>`).join('')}
          </ul>
        </div>
        <div class="platform-status" data-status="${status?.status || 'idle'}">
          <span class="status-indicator"></span>
          <span class="status-text">${this.getStatusText(status?.status || 'idle')}</span>
        </div>
        ${status?.url ? `<div class="platform-url"><a href="${status.url}" target="_blank">${status.url}</a></div>` : ''}
        <button 
          class="deploy-button"
          onclick="window.nspfrpFreeCloudDeployUI.deployToPlatform('${platform}')"
          ${status?.status === 'deploying' || status?.status === 'active' ? 'disabled' : ''}>
          ${status?.status === 'deploying' ? '⏳ Deploying...' : status?.status === 'active' ? '✅ Deployed' : '🚀 Deploy'}
        </button>
      </div>
    `;
  }

  /**
   * Render deployment status
   */
  private renderDeploymentStatus(): string {
    const activeDeployments = Array.from(this.deployments.values())
      .filter(d => d.status === 'deploying' || d.status === 'active');

    if (activeDeployments.length === 0) {
      return '';
    }

    return `
      <div class="deployment-status">
        <h3>📊 Active Deployments</h3>
        ${activeDeployments.map(deployment => `
          <div class="deployment-item">
            <div class="deployment-platform">${this.getPlatformInfo(deployment.platform).name}</div>
            <div class="deployment-progress">
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${deployment.progress || 0}%"></div>
              </div>
              <span class="progress-text">${deployment.progress || 0}%</span>
            </div>
            <div class="deployment-message">${deployment.message || ''}</div>
            ${deployment.url ? `<div class="deployment-url"><a href="${deployment.url}" target="_blank">${deployment.url}</a></div>` : ''}
          </div>
        `).join('')}
      </div>
    `;
  }

  /**
   * Render deploy buttons
   */
  private renderDeployButtons(): string {
    const activeDeployments = Array.from(this.deployments.values())
      .filter(d => d.status === 'active' && d.url);

    if (activeDeployments.length === 0) {
      return '';
    }

    return `
      <div class="deploy-buttons-section">
        <h3>🌐 Internet Cloud Deploy Buttons</h3>
        <div class="deploy-buttons-grid">
          ${activeDeployments.map(deployment => this.renderDeployButton(deployment)).join('')}
        </div>
        <div class="button-code">
          <h4>📋 Button Code (Copy & Paste)</h4>
          <div class="code-tabs">
            <button class="tab-button active" onclick="window.nspfrpFreeCloudDeployUI.showCodeTab('html')">HTML</button>
            <button class="tab-button" onclick="window.nspfrpFreeCloudDeployUI.showCodeTab('markdown')">Markdown</button>
          </div>
          <div class="code-content" id="button-code-content">
            ${this.renderButtonCode(activeDeployments, 'html')}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render deploy button
   */
  private renderDeployButton(deployment: DeploymentStatus): string {
    const platformInfo = this.getPlatformInfo(deployment.platform);

    return `
      <a href="${deployment.url}" 
         class="nspfrp-free-cloud-deploy-button next-octave"
         data-platform="${deployment.platform}"
         data-deployment-id="${deployment.platform}"
         data-ai-assisted="true"
         target="_blank">
        🌐 Deploy to ${platformInfo.name} (AI-Assisted)
      </a>
    `;
  }

  /**
   * Render button code
   */
  private renderButtonCode(deployments: DeploymentStatus[], format: 'html' | 'markdown'): string {
    if (format === 'html') {
      return deployments.map(deployment => {
        const platformInfo = this.getPlatformInfo(deployment.platform);
        return `
<a href="${deployment.url}" 
   class="nspfrp-free-cloud-deploy-button next-octave"
   data-platform="${deployment.platform}"
   data-deployment-id="${deployment.platform}"
   data-ai-assisted="true"
   style="
     display: inline-block;
     padding: 12px 24px;
     background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
     color: white;
     text-decoration: none;
     border-radius: 8px;
     font-weight: 600;
     box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
     transition: transform 0.2s, box-shadow 0.2s;
   "
   onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 6px 20px rgba(102, 126, 234, 0.6)';"
   onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 4px 15px rgba(102, 126, 234, 0.4)';">
  🌐 Deploy to ${platformInfo.name} (AI-Assisted)
</a>`;
      }).join('\n\n');
    } else {
      return deployments.map(deployment => {
        const platformInfo = this.getPlatformInfo(deployment.platform);
        return `[🌐 Deploy to ${platformInfo.name} (AI-Assisted)](${deployment.url})`;
      }).join('\n\n');
    }
  }

  /**
   * Get platform info
   */
  private getPlatformInfo(platform: DeploymentPlatform): {
    name: string;
    icon: string;
    features: string[];
  } {
    const platformMap: Record<DeploymentPlatform, { name: string; icon: string; features: string[] }> = {
      'glitch': { name: 'Glitch', icon: '✨', features: ['Full-stack apps', 'Auto-reload', 'Collaborative'] },
      'surge': { name: 'Surge.sh', icon: '🌊', features: ['Static sites', 'Custom domains', 'HTTPS'] },
      'ipfs': { name: 'IPFS', icon: '🌐', features: ['Decentralized', 'Permanent', 'Immutable'] },
      'vercel': { name: 'Vercel', icon: '▲', features: ['Next.js', 'Serverless', 'Edge Network'] },
      'netlify': { name: 'Netlify', icon: '🌍', features: ['JAMstack', 'Functions', 'Edge'] },
      'render': { name: 'Render', icon: '🎨', features: ['Web Services', 'Databases', 'Background Workers'] },
      'railway': { name: 'Railway', icon: '🚂', features: ['Full-stack', 'Databases', 'Cron Jobs'] },
      'fly.io': { name: 'Fly.io', icon: '✈️', features: ['Global', 'Edge', 'Fast'] },
      'aws': { name: 'AWS', icon: '☁️', features: ['Lambda', 'ECS', 'EC2'] },
      'gcp': { name: 'GCP', icon: '🔵', features: ['Cloud Run', 'App Engine', 'Functions'] },
      'azure': { name: 'Azure', icon: '🔷', features: ['App Service', 'Functions', 'Containers'] }
    };

    return platformMap[platform] || { name: platform, icon: '☁️', features: [] };
  }

  /**
   * Get status text
   */
  private getStatusText(status: DeploymentStatus['status']): string {
    const statusMap: Record<DeploymentStatus['status'], string> = {
      'idle': 'Ready to Deploy',
      'selecting': 'AI Selecting Platform...',
      'creating-account': 'AI Creating Account...',
      'connecting': 'AI Connecting...',
      'deploying': 'Deploying...',
      'active': '✅ Deployed',
      'failed': '❌ Failed'
    };

    return statusMap[status] || 'Unknown';
  }

  /**
   * Request AI assist
   */
  async requestAIAssist(): Promise<void> {
    await this.onAIAssist();
  }

  /**
   * Deploy to platform
   */
  async deployToPlatform(platform: DeploymentPlatform): Promise<void> {
    const status = this.deployments.get(platform);
    if (!status) return;

    status.status = 'deploying';
    status.progress = 0;
    status.message = 'Starting deployment...';

    try {
      const config: CloudDeploymentConfig = {
        platform,
        environment: 'production',
        config: {},
        autoScale: true
      };

      await this.onDeploy(platform, config);

      status.status = 'active';
      status.progress = 100;
      status.message = 'Deployment successful!';
    } catch (error) {
      status.status = 'failed';
      status.message = error instanceof Error ? error.message : 'Deployment failed';
    }
  }

  /**
   * Update deployment status
   */
  updateDeploymentStatus(platform: DeploymentPlatform, status: Partial<DeploymentStatus>): void {
    const currentStatus = this.deployments.get(platform);
    if (currentStatus) {
      Object.assign(currentStatus, status);
    }
  }

  /**
   * Get CSS styles
   */
  static getStyles(): string {
    return `
      <style>
        .nspfrp-free-cloud-deploy-ui {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .deploy-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .deploy-header h2 {
          font-size: 2em;
          margin-bottom: 10px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .ai-assist-section {
          margin-bottom: 30px;
          text-align: center;
        }

        .ai-assist-button {
          padding: 15px 30px;
          font-size: 1.1em;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .ai-assist-button:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
        }

        .platform-grid {
          display: grid;
          gap: 30px;
          margin-bottom: 30px;
        }

        .platform-tier h3 {
          margin-bottom: 20px;
          color: #333;
        }

        .platform-cards {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .platform-card {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 20px;
          background: white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .platform-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .platform-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 15px;
        }

        .platform-icon {
          font-size: 1.5em;
        }

        .no-account-badge, .ai-account-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.8em;
          font-weight: 600;
        }

        .no-account-badge {
          background: #4caf50;
          color: white;
        }

        .ai-account-badge {
          background: #2196f3;
          color: white;
        }

        .deploy-button {
          width: 100%;
          padding: 10px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          margin-top: 15px;
        }

        .deploy-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .nspfrp-free-cloud-deploy-button.next-octave {
          display: inline-block;
          padding: 12px 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .nspfrp-free-cloud-deploy-button.next-octave:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
        }
      </style>
    `;
  }
}

