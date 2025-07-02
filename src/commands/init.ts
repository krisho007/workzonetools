import inquirer from 'inquirer';
import chalk from 'chalk';
import { saveConfig } from '../config.js';
import { WzToolsConfig, InitOptions } from '../types.js';

export async function initCommand(options: InitOptions): Promise<void> {
  console.log(chalk.blue('🚀 Initializing workzonetools configuration...'));
  console.log();

  const config: WzToolsConfig = {
    clientId: '',
    clientSecret: '',
    userId: '',
    password: '',
    xsuaaUrl: '',
    workzoneHost: '',
    subdomain: '',
    subaccountId: '',
  };

  // If all options are provided via CLI flags, use them directly
  if (options.clientId && options.clientSecret && options.userId && options.password && 
      options.xsuaaUrl && options.workzoneHost && options.subdomain && options.subaccountId) {
    
    config.clientId = options.clientId;
    config.clientSecret = options.clientSecret;
    config.userId = options.userId;
    config.password = options.password;
    config.xsuaaUrl = options.xsuaaUrl;
    config.workzoneHost = options.workzoneHost;
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
        name: 'userId',
        message: 'User ID:',
        default: options.userId,
        validate: (input: string) => input.trim() !== '' || 'User ID is required',
      },
      {
        type: 'password',
        name: 'password',
        message: 'User Password:',
        default: options.password,
        validate: (input: string) => input.trim() !== '' || 'User Password is required',
        mask: '*',
      },
      {
        type: 'input',
        name: 'xsuaaUrl',
        message: 'XSUAA URL (e.g., https://<subdomain>.authentication.<region>.hana.ondemand.com):',
        default: options.xsuaaUrl,
        validate: (input: string) => {
          if (input.trim() === '') return 'XSUAA URL is required';
          if (!input.startsWith('https://')) return 'XSUAA URL must start with https://';
          return true;
        },
      },
      {
        type: 'input',
        name: 'workzoneHost',
        message: 'Work Zone Host (e.g., <subdomain>.dt.launchpad.cfapps.<region>.hana.ondemand.com):',
        default: options.workzoneHost,
        validate: (input: string) => {
          if (input.trim() === '') return 'Work Zone Host is required';
          if (input.startsWith('https://') || input.startsWith('http://')) {
            return 'Please provide only the hostname without protocol (e.g., <subdomain>.dt.launchpad.cfapps.<region>.hana.ondemand.com)';
          }
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
    console.log(chalk.gray(`   Config file: ~/.workzonetools/config.json`));
    console.log();
    console.log(chalk.blue('🎉 You can now run: workzonetools clear_cache'));
  } catch (error) {
    console.error(chalk.red('❌ Failed to save configuration:'));
    console.error(chalk.red(`   ${error instanceof Error ? error.message : 'Unknown error'}`));
    process.exit(1);
  }
} 