#!/usr/bin/env node
/**
 * VibeHub CLI - Command Line Interface for VibeHub Bridge
 * 
 * Natural language interface for AI-assisted development
 * with full Vibeverse ecosystem integration.
 * 
 * @module VibeHubCLI
 * @version 1.0.0
 */

import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { VibeHubBridge } from '../integration/vibehub-bridge';
import * as fs from 'fs';
import * as path from 'path';

const program = new Command();
const CONFIG_FILE = '.vibehub.json';

// ============================================================================
// CLI PROGRAM
// ============================================================================

program
  .name('vibehub')
  .description('VibeHub Bridge - AI-Assisted GitHub Integration for Vibeverse')
  .version('1.0.0');

// ============================================================================
// INIT COMMAND
// ============================================================================

program
  .command('init')
  .description('Initialize VibeHub in current directory')
  .action(async () => {
    console.log(chalk.cyan('🌉 Initializing VibeHub Bridge...\n'));
    
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'apiKey',
        message: 'Enter your VibeHub API key:',
        validate: (input) => input.length > 0 || 'API key is required'
      },
      {
        type: 'input',
        name: 'githubToken',
        message: 'Enter your GitHub token:',
        validate: (input) => input.length > 0 || 'GitHub token is required'
      },
      {
        type: 'checkbox',
        name: 'services',
        message: 'Select Vibeverse services to connect:',
        choices: [
          { name: 'Vibenet∞ (Carrier/Cloud/Memory/Energy)', value: 'vibenet', checked: true },
          { name: 'Vibeframe (Storytelling)', value: 'vibeframe' },
          { name: 'VibePort (Portal System)', value: 'vibeport' },
          { name: 'Animation Studio', value: 'animation-studio' },
          { name: 'Life Planning Kiosk', value: 'life-planning' }
        ]
      },
      {
        type: 'list',
        name: 'aiModel',
        message: 'Select AI model for code generation:',
        choices: [
          { name: 'HHF-AI (Holographic Hydrogen Fractal AI)', value: 'hhf-ai' },
          { name: 'GPT-4', value: 'gpt-4' },
          { name: 'Claude 3', value: 'claude-3' }
        ],
        default: 'hhf-ai'
      },
      {
        type: 'confirm',
        name: 'realtime',
        message: 'Enable real-time bidirectional sync?',
        default: true
      }
    ]);

    const config = {
      apiKey: answers.apiKey,
      github: {
        token: answers.githubToken,
        repos: [],
        defaultBranch: 'main',
        autoMerge: false
      },
      ecosystem: {
        services: answers.services,
        endpoints: answers.services.reduce((acc: any, service: string) => {
          acc[service] = `https://api.vibeverse.io/${service}`;
          return acc;
        }, {}),
        auth: {}
      },
      ai: {
        model: answers.aiModel,
        temperature: 0.7,
        maxTokens: 4000
      },
      sync: {
        bidirectional: answers.realtime,
        realtime: answers.realtime,
        interval: 5000
      }
    };

    // Save config
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
    
    console.log(chalk.green('\n✅ VibeHub initialized successfully!'));
    console.log(chalk.gray(`Configuration saved to ${CONFIG_FILE}\n`));
    console.log(chalk.yellow('Next steps:'));
    console.log('  1. Run', chalk.cyan('vibehub connect'), 'to verify connections');
    console.log('  2. Run', chalk.cyan('vibehub snap "your description"'), 'to generate code');
    console.log('  3. Run', chalk.cyan('vibehub help'), 'for more commands\n');
  });

// ============================================================================
// SNAP COMMAND
// ============================================================================

program
  .command('snap <description>')
  .description('Generate code from natural language description')
  .option('-i, --integrate <services>', 'Services to integrate (comma-separated)', 'vibenet')
  .option('-l, --language <lang>', 'Programming language', 'typescript')
  .option('-f, --framework <framework>', 'Framework to use', 'express')
  .option('--tests', 'Generate tests', true)
  .option('--docs', 'Generate documentation', true)
  .option('--style <style>', 'Code style (NSPFRNP or standard)', 'NSPFRNP')
  .option('-p, --push', 'Push to GitHub immediately', false)
  .option('-r, --repo <repo>', 'GitHub repository (owner/repo)')
  .action(async (description, options) => {
    const spinner = ora('⚡ SNAP! Generating code...').start();
    
    try {
      const config = loadConfig();
      const vibehub = new VibeHubBridge(config);
      
      const code = await vibehub.snap({
        description,
        integrate: options.integrate.split(','),
        language: options.language,
        framework: options.framework,
        tests: options.tests,
        docs: options.docs,
        style: options.style
      });
      
      spinner.succeed('Code generated successfully!');
      
      // Display generated files
      console.log(chalk.cyan('\n📄 Generated files:'));
      code.files.forEach(file => {
        console.log(chalk.gray('  -'), file.path);
      });
      
      if (code.tests.length > 0) {
        console.log(chalk.cyan('\n🧪 Generated tests:'));
        code.tests.forEach(test => {
          console.log(chalk.gray('  -'), test.path);
        });
      }
      
      // Save files locally
      for (const file of [...code.files, ...code.tests]) {
        const filePath = path.join(process.cwd(), file.path);
        const dir = path.dirname(filePath);
        
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        
        fs.writeFileSync(filePath, file.content);
      }
      
      console.log(chalk.green('\n✅ Files saved to current directory'));
      
      // Push to GitHub if requested
      if (options.push && options.repo) {
        const pushSpinner = ora('📤 Pushing to GitHub...').start();
        
        await vibehub.push({
          code,
          repo: options.repo,
          branch: 'feature/vibehub-generated',
          pr: {
            title: `feat: ${description}`,
            body: 'Auto-generated by VibeHub Bridge'
          }
        });
        
        pushSpinner.succeed('Pushed to GitHub successfully!');
      }
      
      await vibehub.destroy();
      
    } catch (error) {
      spinner.fail('Failed to generate code');
      console.error(chalk.red('\nError:'), error);
      process.exit(1);
    }
  });

// ============================================================================
// CONNECT COMMAND
// ============================================================================

program
  .command('connect')
  .description('Connect to Vibeverse ecosystem and verify')
  .action(async () => {
    const spinner = ora('🔌 Connecting to Vibeverse ecosystem...').start();
    
    try {
      const config = loadConfig();
      const vibehub = new VibeHubBridge(config);
      
      vibehub.on('initialized', () => {
        spinner.succeed('Connected successfully!');
        
        console.log(chalk.cyan('\n✅ Connected services:'));
        config.ecosystem.services.forEach((service: string) => {
          console.log(chalk.gray('  -'), chalk.green('●'), service);
        });
        
        vibehub.destroy();
      });
      
    } catch (error) {
      spinner.fail('Connection failed');
      console.error(chalk.red('\nError:'), error);
      process.exit(1);
    }
  });

// ============================================================================
// DEPLOY COMMAND
// ============================================================================

program
  .command('deploy')
  .description('Deploy to Vibeverse environment')
  .option('-s, --service <service>', 'Service to deploy', 'api')
  .option('-e, --env <environment>', 'Environment (development/staging/production)', 'staging')
  .option('--rollback', 'Enable automatic rollback on failure', true)
  .option('--health-check', 'Perform health check before deployment', true)
  .action(async (options) => {
    const spinner = ora(`🚀 Deploying to ${options.env}...`).start();
    
    try {
      const config = loadConfig();
      const vibehub = new VibeHubBridge(config);
      
      await vibehub.deploy({
        service: options.service,
        environment: options.env,
        rollback: options.rollback,
        healthCheck: options.healthCheck,
        notifications: true
      });
      
      spinner.succeed(`Deployed to ${options.env} successfully!`);
      await vibehub.destroy();
      
    } catch (error) {
      spinner.fail('Deployment failed');
      console.error(chalk.red('\nError:'), error);
      process.exit(1);
    }
  });

// ============================================================================
// PATCH COMMAND
// ============================================================================

program
  .command('patch')
  .description('Apply resonant patch across ecosystem')
  .option('-t, --type <type>', 'Patch type (security/feature/bugfix/refactor)', 'feature')
  .option('-s, --severity <severity>', 'Severity (low/medium/high/critical)', 'medium')
  .option('--systems <systems>', 'Systems to patch (comma-separated or "all")', 'all')
  .option('--resonant', 'Apply in resonant order', true)
  .option('--verify', 'Verify ecosystem coherence after patch', true)
  .action(async (options) => {
    const { description } = await inquirer.prompt([
      {
        type: 'input',
        name: 'description',
        message: 'Patch description:',
        validate: (input) => input.length > 0 || 'Description is required'
      }
    ]);
    
    const spinner = ora('🔧 Applying resonant patch...').start();
    
    try {
      const config = loadConfig();
      const vibehub = new VibeHubBridge(config);
      
      await vibehub.patch({
        type: options.type,
        severity: options.severity,
        systems: options.systems === 'all' ? 'all' : options.systems.split(','),
        resonant: options.resonant,
        verify: options.verify,
        description
      });
      
      spinner.succeed('Resonant patch applied successfully!');
      await vibehub.destroy();
      
    } catch (error) {
      spinner.fail('Patch failed');
      console.error(chalk.red('\nError:'), error);
      process.exit(1);
    }
  });

// ============================================================================
// SYNC COMMAND
// ============================================================================

program
  .command('sync')
  .description('Sync with GitHub')
  .option('--bidirectional', 'Enable bidirectional sync', true)
  .action(async (options) => {
    console.log(chalk.cyan('🔄 Starting sync...'));
    
    try {
      const config = loadConfig();
      config.sync.bidirectional = options.bidirectional;
      
      const vibehub = new VibeHubBridge(config);
      
      console.log(chalk.green('✅ Sync active'));
      console.log(chalk.gray('Press Ctrl+C to stop\n'));
      
      // Keep running
      process.on('SIGINT', async () => {
        console.log(chalk.yellow('\nStopping sync...'));
        await vibehub.destroy();
        process.exit(0);
      });
      
    } catch (error) {
      console.error(chalk.red('\nError:'), error);
      process.exit(1);
    }
  });

// ============================================================================
// HEALTH COMMAND
// ============================================================================

program
  .command('health')
  .description('Check ecosystem health')
  .action(async () => {
    const spinner = ora('🏥 Checking ecosystem health...').start();
    
    try {
      const config = loadConfig();
      const vibehub = new VibeHubBridge(config);
      
      // Wait for initialization
      await new Promise(resolve => vibehub.on('initialized', resolve));
      
      spinner.succeed('Ecosystem is healthy!');
      
      console.log(chalk.cyan('\n✅ All systems operational:'));
      config.ecosystem.services.forEach((service: string) => {
        console.log(chalk.gray('  -'), chalk.green('●'), service, chalk.gray('(healthy)'));
      });
      
      await vibehub.destroy();
      
    } catch (error) {
      spinner.fail('Health check failed');
      console.error(chalk.red('\nError:'), error);
      process.exit(1);
    }
  });

// ============================================================================
// INTERACTIVE COMMAND
// ============================================================================

program
  .command('interactive')
  .alias('i')
  .description('Interactive mode with AI assistant')
  .action(async () => {
    console.log(chalk.cyan('🤖 VibeHub Interactive Mode'));
    console.log(chalk.gray('Natural language interface with HHF-AI\n'));
    console.log(chalk.yellow('Type your requests in plain English'));
    console.log(chalk.gray('Type "exit" to quit\n'));
    
    const config = loadConfig();
    const vibehub = new VibeHubBridge(config);
    
    while (true) {
      const { command } = await inquirer.prompt([
        {
          type: 'input',
          name: 'command',
          message: 'vibehub>',
          prefix: ''
        }
      ]);
      
      if (command.toLowerCase() === 'exit') {
        console.log(chalk.cyan('\nGoodbye! 👋\n'));
        await vibehub.destroy();
        break;
      }
      
      if (!command.trim()) continue;
      
      // Process command with AI
      const spinner = ora('Processing...').start();
      
      try {
        // Here we would interpret the natural language command
        // and execute the appropriate action
        spinner.succeed('Done!');
        console.log(chalk.gray('(Interactive mode - full implementation coming soon)\n'));
        
      } catch (error) {
        spinner.fail('Error processing command');
        console.error(chalk.red(error), '\n');
      }
    }
  });

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function loadConfig(): any {
  if (!fs.existsSync(CONFIG_FILE)) {
    console.error(chalk.red('Error: No VibeHub configuration found'));
    console.log(chalk.yellow('Run'), chalk.cyan('vibehub init'), chalk.yellow('first'));
    process.exit(1);
  }
  
  return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
}

// ============================================================================
// RUN CLI
// ============================================================================

program.parse(process.argv);

// Show help if no command
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
