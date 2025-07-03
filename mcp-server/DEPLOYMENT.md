# MCP Server Deployment Setup

## Automatic Deployment on Git Push

The MCP server will automatically deploy to Cloudflare Workers when you push changes to the `main` branch that affect the `mcp-server/` directory.

## Setup Instructions

### 1. Get your Cloudflare API Token

1. Go to https://dash.cloudflare.com/profile/api-tokens
2. Click "Create Token"
3. Use the "Edit Cloudflare Workers" template or create a custom token with these permissions:
   - Account: Cloudflare Workers Scripts:Edit
   - Zone: Zone:Read, Cache Purge:Purge

### 2. Get your Cloudflare Account ID

1. Go to any domain in your Cloudflare dashboard
2. On the right sidebar, find your Account ID
3. Copy this value

### 3. Add GitHub Secrets

In your GitHub repository:

1. Go to Settings → Secrets and variables → Actions
2. Add these repository secrets:
   - `CLOUDFLARE_API_TOKEN`: Your API token from step 1
   - `CLOUDFLARE_ACCOUNT_ID`: Your account ID from step 2

### 4. Deploy Manually First (Optional)

To verify everything works, you can deploy manually:

```bash
cd mcp-server
npm run deploy
```

### 5. Automatic Deployments

Now, every time you:
- Push to the `main` branch
- Make changes to files in the `mcp-server/` directory

The GitHub Action will automatically deploy your MCP server to Cloudflare Workers.

## Monitoring Deployments

- Check the "Actions" tab in your GitHub repository to see deployment status
- Your MCP server will be available at: `https://kinetic-icons-mcp-server.<your-subdomain>.workers.dev/sse`

## Updating Icon Names

When you add new icons to the main package:

1. Update `/mcp-server/src/iconList.ts` with the new icon names
2. Commit and push to trigger deployment
3. The updated MCP server will be live within minutes