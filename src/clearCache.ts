import axios, { AxiosError } from 'axios';
import chalk from 'chalk';
import { WzToolsConfig, TokenResponse, ClearCacheRequest } from './types.js';

export async function getAccessToken(config: WzToolsConfig): Promise<string> {
  const tokenUrl = `${config.xsuaaUrl}/oauth/token`;
  
  const params = new URLSearchParams();
  params.append('grant_type', 'password');
  params.append('client_id', config.clientId);
  params.append('client_secret', config.clientSecret);
  params.append('username', config.userId);
  params.append('password', config.password);

  try {
    const response = await axios.post<TokenResponse>(tokenUrl, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response.data.access_token;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(`Failed to get access token: ${error.response?.status} ${error.response?.statusText}`);
    }
    throw new Error(`Failed to get access token: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function clearCache(config: WzToolsConfig): Promise<void> {
  console.log(chalk.blue('🔄 Getting access token...'));
  
  try {
    const accessToken = await getAccessToken(config);
    console.log(chalk.green('✅ Access token obtained successfully'));

    console.log(chalk.blue('🧹 Clearing Work Zone cache...'));

    const clearCacheRequest: ClearCacheRequest = {
      providerId: 'saas_approuter',
      contentAdditionMode: 'manual',
      subdomain: config.subdomain,
      subaccountId: config.subaccountId,
    };

    // Construct the full Work Zone URL
    const workzoneUrl = `https://${config.workzoneHost}/semantic/entity/provider/html5`;

    const response = await axios.post(workzoneUrl, clearCacheRequest, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status >= 200 && response.status < 300) {
      console.log(chalk.green('✅ Work Zone cache cleared successfully!'));
      console.log(chalk.gray(`Response: ${response.status} ${response.statusText}`));
    } else {
      console.log(chalk.yellow(`⚠️  Unexpected response: ${response.status} ${response.statusText}`));
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(chalk.red('❌ Failed to clear cache:'));
      console.error(chalk.red(`   Status: ${error.response?.status} ${error.response?.statusText}`));
      console.error(chalk.red(`   Message: ${error.message}`));
      
      if (error.response?.data) {
        console.error(chalk.red(`   Details: ${JSON.stringify(error.response.data, null, 2)}`));
      }
    } else {
      console.error(chalk.red(`❌ Failed to clear cache: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
    process.exit(1);
  }
} 