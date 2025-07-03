# Team Setup Instructions for @kinetic-apps/icons

## Quick Setup (For All Team Members)

### One-Time Global Setup

Run this single command to set up authentication for all @kinetic-apps packages:

```bash
# Option 1: If you have GitHub CLI installed (recommended)
echo "@kinetic-apps:registry=https://npm.pkg.github.com" >> ~/.npmrc && echo "//npm.pkg.github.com/:_authToken=$(gh auth token)" >> ~/.npmrc

# Option 2: Manual token setup
# 1. Go to https://github.com/settings/tokens
# 2. Generate new token (classic) with 'read:packages' scope
# 3. Run:
echo "@kinetic-apps:registry=https://npm.pkg.github.com" >> ~/.npmrc
echo "//npm.pkg.github.com/:_authToken=YOUR_TOKEN_HERE" >> ~/.npmrc
```

That's it! You can now use any @kinetic-apps package in any project.

### Using the Package

After the one-time setup above, just install normally:

```bash
npm install @kinetic-apps/icons
# or
yarn add @kinetic-apps/icons
# or 
pnpm add @kinetic-apps/icons
```

## For Package Maintainers (Publishing)

### First Time Publishing Setup

1. **Create a token with write permissions**:
   ```bash
   # Go to https://github.com/settings/tokens
   # Create token with scopes: write:packages, read:packages
   # Save this token securely
   ```

2. **Set up publishing authentication**:
   ```bash
   # In the kinetic-icons directory only
   echo "@kinetic-apps:registry=https://npm.pkg.github.com" > .npmrc
   echo "//npm.pkg.github.com/:_authToken=YOUR_WRITE_TOKEN" >> .npmrc
   ```

### Publishing a New Version

```bash
# 1. Update version
npm version patch  # or minor/major

# 2. Build
npm run build

# 3. Publish
npm publish
```

## Troubleshooting

### "Permission denied" when installing
- Make sure you're part of the kinetic-apps GitHub organization
- Regenerate your token with `read:packages` scope

### "403 Forbidden" when publishing
- You need a token with `write:packages` scope
- Make sure you're using the publishing token, not the read-only token

### Can't find the package
- Check that you've configured the registry: `npm config get @kinetic-apps:registry`
- Should return: `https://npm.pkg.github.com`

## CI/CD Setup

For GitHub Actions, add to your workflow:

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '18'
    registry-url: 'https://npm.pkg.github.com'

- run: npm ci
  env:
    NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```