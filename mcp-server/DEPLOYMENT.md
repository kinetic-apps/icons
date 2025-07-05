# MCP Server Deployment & Publishing

This document covers both deploying the MCP server to Cloudflare Workers and publishing it to GitHub Packages.

## Automatic Deployment & Publishing

### Cloudflare Workers Deployment

The MCP server automatically deploys to Cloudflare Workers when you push changes to the `main` branch that affect the `mcp-server/` directory.

### GitHub Packages Publishing

The MCP server automatically publishes to GitHub Packages when:
- Changes are pushed to the `main` branch in the `mcp-server/` directory
- Manual workflow dispatch is triggered

## Setup Instructions

### 1. Cloudflare Workers Setup

#### Get your Cloudflare API Token

1. Go to https://dash.cloudflare.com/profile/api-tokens
2. Click "Create Token"
3. Use the "Edit Cloudflare Workers" template or create a custom token with these permissions:
   - Account: Cloudflare Workers Scripts:Edit
   - Zone: Zone:Read, Cache Purge:Purge

#### Get your Cloudflare Account ID

1. Go to any domain in your Cloudflare dashboard
2. On the right sidebar, find your Account ID
3. Copy this value

#### Add GitHub Secrets

In your GitHub repository:

1. Go to Settings → Secrets and variables → Actions
2. Add these repository secrets:
   - `CLOUDFLARE_API_TOKEN`: Your API token from above
   - `CLOUDFLARE_ACCOUNT_ID`: Your account ID from above

### 2. GitHub Packages Setup

GitHub Packages publishing is automatically configured and uses the built-in `GITHUB_TOKEN` for authentication.

## Manual Operations

### Deploy to Cloudflare Workers

```bash
cd mcp-server
npm run deploy
```

### Publish to GitHub Packages

#### Option 1: Manual Workflow (Recommended)

1. Go to GitHub Actions tab in your repository
2. Select "Publish MCP Server" workflow
3. Click "Run workflow"
4. Enter the version number (e.g., `1.0.10`)
5. Click "Run workflow"

#### Option 2: Command Line

```bash
cd mcp-server
npm version 1.0.10 --no-git-tag-version
npm run build
npm publish
```

## Automatic Workflows

### When Changes Are Pushed

Every time you push to the `main` branch with changes in `mcp-server/`:

1. **Cloudflare Workers**: Automatically deploys to `https://kinetic-icons-mcp-server.<your-subdomain>.workers.dev/`
2. **GitHub Packages**: Automatically publishes the updated package

### Version Management

- **Cloudflare Workers**: Uses the current code from the repository
- **GitHub Packages**: Uses the version in `package.json`

To update the package version:
1. Update `version` in `mcp-server/package.json`
2. Commit and push to `main`
3. Both deployment and publishing will happen automatically

## Installation for Users

### With Cursor

Users need to authenticate with GitHub Packages first:

```bash
npm login --scope=@kinetic-apps --auth-type=legacy --registry=https://npm.pkg.github.com
```

Then add to Cursor MCP configuration:

```json
{
  "mcpServers": {
    "kinetic-icons": {
      "command": "npx",
      "args": ["-y", "@kinetic-apps/kinetic-icons-mcp-server"],
      "env": {}
    }
  }
}
```

### With npm

```bash
npm install @kinetic-apps/kinetic-icons-mcp-server
```

## Monitoring

- **Cloudflare Workers**: Check the "Actions" tab → "Deploy MCP Server to Cloudflare Workers"
- **GitHub Packages**: Check the "Actions" tab → "Publish MCP Server"
- **Package Registry**: View published packages at https://github.com/kinetic-apps/icons/packages

## Troubleshooting

### Authentication Issues

If users can't install the package:

1. Ensure they're authenticated with GitHub Packages
2. Check they have access to the `kinetic-apps` organization
3. Verify the package is published correctly

### Build Issues

If the build fails:

1. Check the TypeScript compilation in `mcp-server/src/`
2. Ensure all dependencies are properly installed
3. Check the GitHub Actions logs for detailed error messages

## Updating Icon Names

When you add new icons to the main package:

1. Update `/mcp-server/src/iconList.ts` with the new icon names
2. Commit and push to trigger both deployment and publishing
3. The updated MCP server will be live within minutes