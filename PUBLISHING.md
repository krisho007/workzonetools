# Publishing Guide for wztools

This guide explains how to publish the wztools CLI to npm.

## Prerequisites

1. **npm account**: You need an npm account. Create one at [npmjs.com](https://www.npmjs.com/)
2. **npm login**: Login to npm in your terminal:
   ```bash
   npm login
   ```

## Pre-publishing Checklist

1. **Update version**: Update the version in `package.json`
   ```bash
   npm version patch  # for bug fixes
   npm version minor  # for new features
   npm version major  # for breaking changes
   ```

2. **Test the package locally**:
   ```bash
   npm run test
   npm pack
   ```

3. **Update repository URLs**: Make sure to update the repository URLs in `package.json`:
   ```json
   {
     "repository": {
       "type": "git",
       "url": "https://github.com/YOUR-USERNAME/wztools.git"
     },
     "bugs": {
       "url": "https://github.com/YOUR-USERNAME/wztools/issues"
     },
     "homepage": "https://github.com/YOUR-USERNAME/wztools#readme"
   }
   ```

4. **Update author information**:
   ```json
   {
     "author": "Your Name <your.email@example.com>"
   }
   ```

## Publishing Steps

### 1. Dry Run (Recommended)
Test what will be published without actually publishing:
```bash
npm publish --dry-run
```

### 2. Publish to npm
```bash
npm publish
```

### 3. Verify Publication
- Check your package on npmjs.com: `https://www.npmjs.com/package/wztools`
- Test installation: `npm install -g wztools`

## Post-Publishing

1. **Create a GitHub release** (if using GitHub):
   - Go to your repository on GitHub
   - Click "Releases" → "Create a new release"
   - Tag version: `v1.0.0`
   - Release title: `v1.0.0`
   - Describe the changes

2. **Test global installation**:
   ```bash
   npm install -g wztools
   wztools --help
   wztools status
   ```

## Updating the Package

For future updates:

1. Make your changes
2. Update version: `npm version patch/minor/major`
3. Test: `npm run test`
4. Publish: `npm publish`

## Package Scope (Optional)

If you want to publish under a scope (e.g., `@yourname/wztools`):

1. Update `package.json`:
   ```json
   {
     "name": "@yourname/wztools"
   }
   ```

2. Publish with public access:
   ```bash
   npm publish --access public
   ```

## Troubleshooting

### Package Name Already Taken
If the package name `wztools` is already taken:
1. Choose a different name (e.g., `sap-wztools`, `workzone-tools`)
2. Update the `name` field in `package.json`
3. Update the `bin` field accordingly

### Authentication Issues
```bash
npm whoami  # Check if you're logged in
npm login   # Login if needed
```

### Permission Issues
Make sure you have permission to publish the package name you're using.

## Files Included in Package

The following files are included in the npm package (as defined in `package.json` files field):
- `dist/` - Compiled JavaScript files
- `README.md` - Documentation
- `LICENSE` - License file

Files excluded (via `.npmignore`):
- `src/` - TypeScript source files
- `tsconfig.json` - TypeScript configuration
- Development files and directories

## Testing the Published Package

After publishing, test the package:

```bash
# Install globally
npm install -g wztools

# Test commands
wztools --help
wztools init --help
wztools status

# Test actual functionality (requires SAP credentials)
wztools init
wztools clear_cache
``` 