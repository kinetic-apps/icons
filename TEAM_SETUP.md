# Team Setup - @kinetic-apps Packages

## Quick Setup (One Command)

Run this command to set up access to all @kinetic-apps npm packages:

```bash
curl -fsSL https://raw.githubusercontent.com/kinetic-apps/kinetic-icons/main/scripts/setup-kinetic-packages.sh | bash
```

This script will:
1. Install GitHub CLI if needed (macOS/Linux)
2. Log you in to GitHub (if needed)
3. Verify you're in the kinetic-apps organization
4. Configure npm to use @kinetic-apps packages

## What It Does

After running the setup script, you can use any @kinetic-apps package in any project:

```bash
npm install @kinetic-apps/icons
npm install @kinetic-apps/any-other-package
```

No per-project setup needed!

## Manual Setup (Alternative)

If you prefer to set up manually:

1. Install GitHub CLI: https://cli.github.com
2. Login: `gh auth login -s read:packages`
3. Configure npm:
   ```bash
   echo "@kinetic-apps:registry=https://npm.pkg.github.com" >> ~/.npmrc
   echo "//npm.pkg.github.com/:_authToken=$(gh auth token)" >> ~/.npmrc
   ```

## Requirements

- You must be a member of the kinetic-apps GitHub organization
- macOS or Linux (Windows users should use WSL or manual setup)
- npm, yarn, or pnpm installed

## Troubleshooting

If you get "permission denied":
- Make sure you're part of the kinetic-apps organization on GitHub
- Re-run the setup script
- Contact a team admin if issues persist