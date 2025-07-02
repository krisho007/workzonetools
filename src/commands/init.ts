import inquirer from 'inquirer';
import chalk from 'chalk';
import { saveConfig } from '../config.js';
import { WzToolsConfig, InitOptions } from '../types.js';

export async function initCommand(options: InitOptions): Promise<void> {
  console.log(chalk.blue('🚀 Initializing wztools configuration...'));
  console.log();

  const config: WzToolsConfig = {
    clientId: '',
    clientSecret: '',
    xsuaaUrl: '',
    wzUrl: '',
    subdomain: '',
    subaccountId: '',
  };

  // If all options are provided via CLI flags, use them directly
  if (options.clientId && options.clientSecret && options.xsuaaUrl && 
      options.wzUrl && options.subdomain && options.subaccountId) {
    
    config.clientId = options.clientId;
    config.clientSecret = options.clientSecret;
    config.xsuaaUrl = options.xsuaaUrl;
    config.wzUrl = options.wzUrl;
    config.subdomain = options.subdomain;
    config.subaccountId = options.subaccountId;
    
    console.log(chalk.green('✅ Using provided CLI options'));
  } else {
    // Interactive prompts for missing values
    console.log(chalk.yellow('📝 Please provide the following configuration values:'));
    console.log();

    const questions = [
      {
        type: 'input',
        name: 'clientId',
        message: 'Client ID:',
        default: options.clientId,
        validate: (input: string) => input.trim() !== '' || 'Client ID is required',
      },
      {
        type: 'password',
        name: 'clientSecret',
        message: 'Client Secret:',
        default: options.clientSecret,
        validate: (input: string) => input.trim() !== '' || 'Client Secret is required',
        mask: '*',
      },
      {
        type: 'input',
        name: 'xsuaaUrl',
        message: 'XSUAA URL (e.g., https://...authentication.sap.hana.ondemand.com):',
        default: options.xsuaaUrl,
        validate: (input: string) => {
          if (input.trim() === '') return 'XSUAA URL is required';
          if (!input.startsWith('https://')) return 'XSUAA URL must start with https://';
          return true;
        },
      },
      {
        type: 'input',
        name: 'wzUrl',
        message: 'Work Zone URL (e.g., https://.../semantic/entity/provider/html5):',
        default: options.wzUrl,
        validate: (input: string) => {
          if (input.trim() === '') return 'Work Zone URL is required';
          if (!input.startsWith('https://')) return 'Work Zone URL must start with https://';
          return true;
        },
      },
      {
        type: 'input',
        name: 'subdomain',
        message: 'Subdomain:',
        default: options.subdomain,
        validate: (input: string) => input.trim() !== '' || 'Subdomain is required',
      },
      {
        type: 'input',
        name: 'subaccountId',
        message: 'Subaccount ID:',
        default: options.subaccountId,
        validate: (input: string) => input.trim() !== '' || 'Subaccount ID is required',
      },
    ];

    const answers = await inquirer.prompt(questions);
    Object.assign(config, answers);
  }

  try {
    saveConfig(config);
    console.log();
    console.log(chalk.green('✅ Configuration saved successfully!'));
    console.log(chalk.gray(`   Config file: ~/.wztools/config.json`));
    console.log();
    console.log(chalk.blue('🎉 You can now run: wztools clear_cache'));
  } catch (error) {
    console.error(chalk.red('❌ Failed to save configuration:'));
    console.error(chalk.red(`   ${error instanceof Error ? error.message : 'Unknown error'}`));
    process.exit(1);
  }
} 