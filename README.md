# workzonetools

A TypeScript CLI tool for managing SAP Work Zone HTML5 content provider cache refresh.

## Features

- 🚀 Easy initialization with interactive prompts or CLI flags
- 🧹 One-command cache clearing for Work Zone HTML5 content
- 🔒 Secure configuration storage with proper file permissions
- 🤖 CI/CD friendly with non-interactive mode support
- 🎨 Beautiful colored output with progress indicators
- ⚡ Modern ES modules for better performance and compatibility

## Installation

### Global Installation (Recommended)

```bash
npm install -g workzonetools
```

## Usage

### 1. Initialize Configuration

#### Interactive Mode (Recommended for first-time setup)

```bash
workzonetools init
```

This will prompt you for all required configuration values:
- Client ID
- Client Secret (hidden input)
- User ID
- User Password (hidden input)
- XSUAA URL
- Work Zone Host
- Subdomain
- Subaccount ID

#### Non-Interactive Mode (CI/CD)

```bash
workzonetools init \
  --client-id "your-client-id" \
  --client-secret "your-client-secret" \
  --user-id "your-user-id" \
  --password "your-password" \
  --xsuaa-url "https://<subdomain>.authentication.<region>.hana.ondemand.com" \
  --workzone-host "<subdomain>.dt.launchpad.cfapps.<region>.hana.ondemand.com" \
  --subdomain "your-subdomain" \
  --subaccount-id "097b595f-58a6-49c8-ba53-ab10c62d8bcb"
```

### 2. Clear Cache

```bash
workzonetools clear_cache
```

This command will:
1. Load your saved configuration
2. Obtain an OAuth access token from XSUAA
3. Call the Work Zone API to clear the HTML5 content provider cache
4. Display success or error messages with colored output

### 3. Check Status

```bash
workzonetools status
```

Shows whether your configuration is set up and ready to use.

## Configuration

Configuration is stored in `~/.workzonetools/config.json` with secure file permissions (600 on Unix systems).

Example configuration file:
```json
{
  "clientId": "your-client-id",
  "clientSecret": "your-client-secret",
  "userId": "your-user-id",
  "password": "your-password",
  "xsuaaUrl": "https://<subdomain>.authentication.<region>.hana.ondemand.com",
  "workzoneHost": "<subdomain>.dt.launchpad.cfapps.<region>.hana.ondemand.com",
  "subdomain": "your-subdomain",
  "subaccountId": "097b595f-58a6-49c8-ba53-ab10c62d8bcb"
}
```

## CI/CD Usage

### GitHub Actions Example

```yaml
name: Clear Work Zone Cache
on:
  push:
    branches: [main]

jobs:
  clear-cache:
    runs-on: ubuntu-latest
    steps:
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
             - name: Install workzonetools
         run: npm install -g workzonetools
       
       - name: Initialize workzonetools
                  run: |
           workzonetools init \
             --client-id "${{ secrets.SAP_CLIENT_ID }}" \
             --client-secret "${{ secrets.SAP_CLIENT_SECRET }}" \
             --user-id "${{ secrets.SAP_USER_ID }}" \
             --password "${{ secrets.SAP_PASSWORD }}" \
             --xsuaa-url "${{ secrets.SAP_XSUAA_URL }}" \
             --workzone-host "${{ secrets.SAP_WORKZONE_HOST }}" \
             --subdomain "${{ secrets.SAP_SUBDOMAIN }}" \
             --subaccount-id "${{ secrets.SAP_SUBACCOUNT_ID }}"
      
             - name: Clear Work Zone cache
         run: workzonetools clear_cache
```

### Jenkins Pipeline Example

```groovy
pipeline {
    agent any
    
    stages {
        stage('Clear Work Zone Cache') {
            steps {
                script {
                                         sh '''
                         npm install -g workzonetools
                         
                                                  workzonetools init \
                           --client-id "${SAP_CLIENT_ID}" \
                           --client-secret "${SAP_CLIENT_SECRET}" \
                           --user-id "${SAP_USER_ID}" \
                           --password "${SAP_PASSWORD}" \
                           --xsuaa-url "${SAP_XSUAA_URL}" \
                           --workzone-host "${SAP_WORKZONE_HOST}" \
                           --subdomain "${SAP_SUBDOMAIN}" \
                           --subaccount-id "${SAP_SUBACCOUNT_ID}"
                                                 
                         workzonetools clear_cache
                    '''
                }
            }
        }
    }
}
```

## API Details

### OAuth Token Request
- **Endpoint**: `${xsuaaUrl}/oauth/token`
- **Method**: POST
- **Grant Type**: password (Resource Owner Password Credentials)
- **Content-Type**: application/x-www-form-urlencoded
- **Parameters**: client_id, client_secret, username, password

### Work Zone Cache Clear Request
- **Endpoint**: `https://<workzoneHost>/semantic/entity/provider/html5`
- **Method**: POST
- **Content-Type**: application/json
- **Authorization**: Bearer token
- **Body**:
  ```json
  {
    "providerId": "saas_approuter",
    "contentAdditionMode": "manual",
    "subdomain": "<your-subdomain>",
    "subaccountId": "<your-subaccount-id>"
  }
  ```

## Development

### Prerequisites
- Node.js >= 16.0.0
- npm or yarn

### Setup
```bash
git clone <repository-url>
cd workzonetools
npm install
```

### Scripts
- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Run the built CLI
- `npm run dev` - Run with ts-node for development
- `npm run prepare` - Build before publishing

### Project Structure
```
workzonetools/
├── src/
│   ├── commands/
│   │   ├── init.ts          # Init command implementation
│   │   └── clearCache.ts    # Clear cache command implementation
│   ├── types.ts             # TypeScript type definitions
│   ├── config.ts            # Configuration management
│   ├── clearCache.ts        # Cache clearing logic
│   └── index.ts             # CLI entry point
├── dist/                    # Built JavaScript files
├── package.json
├── tsconfig.json
└── README.md
```

## Error Handling

The tool provides detailed error messages for common issues:
- Missing configuration file
- Invalid OAuth credentials
- Network connectivity issues
- API response errors
- Invalid configuration values

## Security

- Configuration files are created with restrictive permissions (600 on Unix)
- Client secrets are masked during interactive input
- No sensitive information is logged to console

## License

MIT License - see LICENSE file for details. 