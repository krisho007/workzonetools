#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { initCommand } from './commands/init.js';
import { clearCacheCommand } from './commands/clearCache.js';
import { configExists, getConfigPath } from './config.js';

const program = new Command();

program
  .name('wztools')
  .description('CLI tool for managing SAP Work Zone HTML5 content provider cache refresh')
  .version('1.0.0');

program
  .command('init')
  .description('Initialize wztools configuration')
  .option('--client-id <clientId>', 'OAuth client ID')
  .option('--client-secret <clientSecret>', 'OAuth client secret')
  .option('--xsuaa-url <xsuaaUrl>', 'XSUAA authentication URL')
  .option('--wz-url <wzUrl>', 'Work Zone API URL')
  .option('--subdomain <subdomain>', 'SAP subdomain')
  .option('--subaccount-id <subaccountId>', 'SAP subaccount ID')
  .action(async (options) => {
    try {
      await initCommand({
        clientId: options.clientId,
        clientSecret: options.clientSecret,
        xsuaaUrl: options.xsuaaUrl,
        wzUrl: options.wzUrl,
        subdomain: options.subdomain,
        subaccountId: options.subaccountId,
      });
    } catch (error) {
      console.error(chalk.red('❌ Initialization failed:'));
      console.error(chalk.red(`   ${error instanceof Error ? error.message : 'Unknown error'}`));
      process.exit(1);
    }
  });

program
  .command('clear_cache')
  .alias('clear-cache')
  .description('Clear Work Zone HTML5 content provider cache')
  .action(async () => {
    try {
      await clearCacheCommand();
    } catch (error) {
      console.error(chalk.red('❌ Cache clear failed:'));
      console.error(chalk.red(`   ${error instanceof Error ? error.message : 'Unknown error'}`));
      process.exit(1);
    }
  });

// Add a status command to check configuration
program
  .command('status')
  .description('Show current configuration status')
  .action(() => {
    console.log(chalk.blue('📊 wztools Status'));
    console.log();
    
    if (configExists()) {
      console.log(chalk.green('✅ Configuration file exists'));
      console.log(chalk.gray(`   Location: ${getConfigPath()}`));
      console.log();
      console.log(chalk.blue('🚀 Ready to use: wztools clear_cache'));
    } else {
      console.log(chalk.yellow('⚠️  Configuration file not found'));
      console.log();
      console.log(chalk.blue('💡 Run: wztools init'));
    }
  });

// Handle unknown commands
program.on('command:*', () => {
  console.error(chalk.red('❌ Invalid command: %s'), program.args.join(' '));
  console.log();
  console.log(chalk.blue('Available commands:'));
  console.log(chalk.gray('  wztools init        - Initialize configuration'));
  console.log(chalk.gray('  wztools clear_cache - Clear Work Zone cache'));
  console.log(chalk.gray('  wztools status      - Show configuration status'));
  console.log();
  console.log(chalk.blue('Use "wztools --help" for more information'));
  process.exit(1);
});

// Parse command line arguments
program.parse(); 