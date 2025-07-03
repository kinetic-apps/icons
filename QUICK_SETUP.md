# Quick Setup for @kinetic-apps/icons

## For Team Members - Installing the Package

### One-Time Setup (Do this once on your machine)

```bash
# Configure npm to use GitHub Packages for @kinetic-apps
npm config set @kinetic-apps:registry https://npm.pkg.github.com

# Add your GitHub token
echo "//npm.pkg.github.com/:_authToken=$(gh auth token)" >> ~/.npmrc
```

**Note**: If you don't have GitHub CLI installed, get a token from https://github.com/settings/tokens with `read:packages` scope and replace `$(gh auth token)` with your token.

### Install the Package

After the one-time setup above, you can install in any project:

```bash
npm install @kinetic-apps/icons
```

## Verify It Works

```bash
# Check the package info
npm view @kinetic-apps/icons

# In your code
import { Icon } from '@kinetic-apps/icons';
// or
import { heart, star } from '@kinetic-apps/icons';
```

## Troubleshooting

If you get a 404 error:
1. Make sure you did the one-time setup above
2. Verify you're part of the kinetic-apps GitHub organization
3. Check your token has `read:packages` permission

If you get a 401 error:
1. Your token may have expired
2. Re-run the setup commands above