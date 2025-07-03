# Publishing Guide - @kineticapps/icons

This guide explains how to publish the @kineticapps/icons package to GitHub Packages and set up access for the team.

## Overview

The package is configured to publish to GitHub Packages (private npm registry) under the @kineticapps organization scope. This allows all team members with repository access to install and use the package.

## Publishing the Package

### Prerequisites

1. You need write access to the kinetic-icons repository
2. A GitHub Personal Access Token with `write:packages` permission

### Step 1: Set up GitHub Token

```bash
# Create a personal access token at: https://github.com/settings/tokens
# Select scopes: write:packages, read:packages, delete:packages (optional)

# Add to your environment
export GITHUB_TOKEN=your_token_here
```

### Step 2: Configure npm for Publishing

```bash
# In the kinetic-icons project root
echo "@kineticapps:registry=https://npm.pkg.github.com" >> .npmrc
echo "//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}" >> .npmrc
```

### Step 3: Update Version

```bash
# Update version in package.json
npm version patch  # for bug fixes
npm version minor  # for new features
npm version major  # for breaking changes
```

### Step 4: Build and Publish

```bash
# Build the package
npm run build

# Publish to GitHub Packages
npm publish
```

The package will be published to: `https://npm.pkg.github.com/@kineticapps/icons`

## Team Access Setup

### For Organization Members

If you're part of the kineticapps GitHub organization:

1. **Create a Personal Access Token**
   - Go to https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Name it something like "npm-kineticapps"
   - Select scope: `read:packages`
   - Click "Generate token" and copy it

2. **Configure npm Globally** (recommended)
   ```bash
   # Add to your global .npmrc file (~/.npmrc)
   echo "@kineticapps:registry=https://npm.pkg.github.com" >> ~/.npmrc
   echo "//npm.pkg.github.com/:_authToken=YOUR_TOKEN" >> ~/.npmrc
   ```

3. **Or Configure Per Project**
   ```bash
   # In each project that uses @kineticapps packages
   echo "@kineticapps:registry=https://npm.pkg.github.com" >> .npmrc
   echo "//npm.pkg.github.com/:_authToken=YOUR_TOKEN" >> .npmrc
   ```

### For CI/CD Systems

1. **Add GitHub Token as Secret**
   - In GitHub: Settings → Secrets → Actions
   - Add `NPM_TOKEN` with a token that has `read:packages` scope

2. **Configure in GitHub Actions**
   ```yaml
   - name: Setup Node
     uses: actions/setup-node@v3
     with:
       node-version: '18'
       registry-url: 'https://npm.pkg.github.com'
   
   - name: Install dependencies
     run: npm ci
     env:
       NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
   ```

## Using the Package in Projects

Once configured, team members can install the package normally:

```bash
# Install in any project
npm install @kineticapps/icons

# Or with yarn
yarn add @kineticapps/icons

# Or with pnpm
pnpm add @kineticapps/icons
```

## Automating Releases

### Option 1: Manual GitHub Release

1. Push your changes to main
2. Go to GitHub → Releases → "Create a new release"
3. Choose a tag version (e.g., v1.0.0)
4. GitHub Actions will automatically publish to npm

### Option 2: Semantic Release (Already Configured)

The package.json includes semantic-release. To use it:

1. **Set up GitHub Actions workflow** (create `.github/workflows/release.yml`):
   ```yaml
   name: Release
   on:
     push:
       branches:
         - main
   
   jobs:
     release:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: '18'
             registry-url: 'https://npm.pkg.github.com'
         
         - run: npm ci
         - run: npm run build
         - run: npm run release
           env:
             GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
             NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
   ```

2. **Commit with conventional commits**:
   ```bash
   git commit -m "feat: add new icons"     # Minor version bump
   git commit -m "fix: correct icon path"  # Patch version bump
   git commit -m "feat!: breaking change"  # Major version bump
   ```

## Troubleshooting

### Authentication Issues

If you get `401 Unauthorized`:
1. Check your token has `read:packages` permission
2. Ensure the token hasn't expired
3. Verify .npmrc configuration

### 404 Not Found

If package can't be found:
1. Check you're using the correct scope: `@kineticapps/icons`
2. Ensure the package has been published
3. Verify registry URL in .npmrc

### Permission Denied

If you can't publish:
1. Ensure you have write access to the repository
2. Check token has `write:packages` permission
3. Verify you're authenticated correctly

## Best Practices

1. **Version Management**
   - Use semantic versioning
   - Update version before publishing
   - Tag releases in git

2. **Testing Before Release**
   - Test in both test apps
   - Run `npm run build` successfully
   - Verify TypeScript types generate correctly

3. **Documentation**
   - Update README for any API changes
   - Document breaking changes
   - Keep examples up to date

4. **Security**
   - Never commit .npmrc with tokens
   - Use environment variables for tokens
   - Rotate tokens periodically