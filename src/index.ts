#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { initCommand } from './commands/init.js';
import { clearCacheCommand } from './commands/clearCache.js';
import { configExists, getConfigPath } from './config.js';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read package.json to get the version
const packageJsonPath = join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
const version = packageJson.version;

const program = new Command();

program
  .name('workzonetools')
  .description('CLI tool for managing SAP Work Zone HTML5 content provider cache refresh')
  .version(version);

program
  .command('init')
  .description('Initialize workzonetools configuration')
  .option('--client-id <clientId>', 'OAuth client ID')
  .option('--client-secret <clientSecret>', 'OAuth client secret')
  .option('--user-id <userId>', 'User ID for authentication')
  .option('--password <password>', 'User password for authentication')
  .option('--xsuaa-url <xsuaaUrl>', 'XSUAA authentication URL')
  .option('--workzone-host <workzoneHost>', 'Work Zone host (e.g., <subdomain>.dt.launchpad.cfapps.<region>.hana.ondemand.com)')
  .option('--subdomain <subdomain>', 'SAP subdomain')
  .option('--subaccount-id <subaccountId>', 'SAP subaccount ID')
  .action(async (options) => {
    try {
      await initCommand({
        clientId: options.clientId,
        clientSecret: options.clientSecret,
        userId: options.userId,
        password: options.password,
        xsuaaUrl: options.xsuaaUrl,
        workzoneHost: options.workzoneHost,
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
    console.log(chalk.blue('📊 workzonetools Status'));
    console.log();
    
    if (configExists()) {
      console.log(chalk.green('✅ Configuration file exists'));
      console.log(chalk.gray(`   Location: ${getConfigPath()}`));
      console.log();
      console.log(chalk.blue('🚀 Ready to use: workzonetools clear_cache'));
    } else {
      console.log(chalk.yellow('⚠️  Configuration file not found'));
      console.log();
      console.log(chalk.blue('💡 Run: workzonetools init'));
    }
  });

// Handle unknown commands
program.on('command:*', () => {
  console.error(chalk.red('❌ Invalid command: %s'), program.args.join(' '));
  console.log();
  console.log(chalk.blue('Available commands:'));
  console.log(chalk.gray('  workzonetools init        - Initialize configuration'));
  console.log(chalk.gray('  workzonetools clear_cache - Clear Work Zone cache'));
  console.log(chalk.gray('  workzonetools status      - Show configuration status'));
  console.log();
  console.log(chalk.blue('Use "workzonetools --help" for more information'));
  process.exit(1);
});

// Parse command line arguments
program.parse(); 