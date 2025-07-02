import chalk from 'chalk';
import { loadConfig } from '../config.js';
import { clearCache } from '../clearCache.js';

export async function clearCacheCommand(): Promise<void> {
  console.log(chalk.blue('🧹 Starting Work Zone cache clear process...'));
  console.log();

  try {
    const config = loadConfig();
    console.log(chalk.green('✅ Configuration loaded successfully'));
    console.log(chalk.gray(`   Subdomain: ${config.subdomain}`));
    console.log(chalk.gray(`   Subaccount ID: ${config.subaccountId}`));
    console.log();

    await clearCache(config);
  } catch (error) {
    console.error(chalk.red('❌ Error:'));
    console.error(chalk.red(`   ${error instanceof Error ? error.message : 'Unknown error'}`));
    
    if (error instanceof Error && error.message.includes('Configuration file not found')) {
      console.log();
      console.log(chalk.yellow('💡 Hint: Run "workzonetools init" first to set up your configuration'));
    }
    
    process.exit(1);
  }
} 