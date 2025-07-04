# Kinetic Icons MCP Server Architecture & Deployment Guide

## 🏗️ Architecture Overview

The Kinetic Icons MCP Server has a **two-tier architecture** that's crucial to understand:

```
┌─────────────────────┐    HTTP Request    ┌─────────────────────────┐
│  Local npm Package  │ ─────────────────▶ │  Cloudflare Workers API │
│  (stdio-server.js)  │                    │  (index.js)             │
│  Acts as Proxy      │ ◀───────────────── │  Contains Icon Data     │
└─────────────────────┘    HTTP Response   └─────────────────────────┘
```

### **Component 1: Local npm Package**
- **File**: `src/stdio-server.ts` → `dist/stdio-server.js`
- **Purpose**: Acts as a **client/proxy** for MCP requests
- **Function**: Forwards all requests to Cloudflare Workers API
- **Does NOT**: Store or process icon data locally

### **Component 2: Cloudflare Workers API**
- **File**: `src/index.ts` → Deployed to Cloudflare Workers
- **Purpose**: Contains the **actual icon data and logic**
- **Function**: Processes requests and returns icon data
- **Contains**: The `iconList.ts` data and all business logic

## 📊 Data Flow & Sources

### **Icon Data Source Chain**
```
Website Icons Directory → generateIconList.js → iconList.ts → Cloudflare Workers → MCP Client
```

1. **Source**: Physical icon files in `kinetic-icons-website/icons/`
2. **Extraction**: `generateIconList.js` reads filenames and generates clean names
3. **Storage**: Data stored in `src/iconList.ts` as TypeScript array
4. **Deployment**: `iconList.ts` compiled and deployed to Cloudflare Workers
5. **Access**: MCP clients access data via HTTP requests to Workers API

### **Critical Understanding**
⚠️ **The local npm package does NOT use local `iconList.ts`**
- `stdio-server.ts` makes HTTP requests to: `https://kinetic-icons-mcp-server.raspy-hill-ac75.workers.dev`
- All icon data comes from the Cloudflare Workers deployment
- Updating `iconList.ts` locally has NO effect until deployed to Cloudflare

## 🚀 Deployment Process

### **Complete Deployment Checklist**
```bash
# 1. Update icon data (if needed)
node src/generateIconList.js

# 2. Build TypeScript
npm run build

# 3. Deploy to Cloudflare Workers (CRITICAL!)
npm run deploy

# 4. Update package version
# Edit package.json version

# 5. Publish npm package
npm publish
```

### **Two-Stage Deployment Requirement**
You MUST deploy to both:
1. **Cloudflare Workers**: `npm run deploy` (contains the actual logic)
2. **npm Registry**: `npm publish` (provides the client/proxy)

## ⚠️ Common Pitfalls & Solutions

### **Pitfall 1: Updating iconList.ts but not deploying to Cloudflare**
**Problem**: Local `iconList.ts` updated, but MCP still returns old data
**Solution**: Always run `npm run deploy` after updating icon data

### **Pitfall 2: Only publishing to npm**
**Problem**: npm package updated but still serves old data
**Solution**: Deploy to Cloudflare Workers first, then publish to npm

### **Pitfall 3: Assuming local files are used**
**Problem**: Thinking `stdio-server.js` reads local `iconList.ts`
**Solution**: Remember that `stdio-server.js` is just a proxy to Cloudflare Workers

### **Pitfall 4: Version mismatches**
**Problem**: Cloudflare Workers and npm package have different versions
**Solution**: Always update both versions together

## 🔧 Development Workflow

### **Testing Icon Data Updates**
```bash
# 1. Generate new icon data
node src/generateIconList.js

# 2. Test locally (won't work until deployed!)
npm run build
npm run deploy

# 3. Test the deployed version
npx @elbibs18/kinetic-icons-mcp-server@latest
```

### **Debugging Data Issues**
```bash
# Check what's in local iconList.ts
head -20 src/iconList.ts

# Check what's deployed to Cloudflare
curl https://kinetic-icons-mcp-server.raspy-hill-ac75.workers.dev/sse \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"list_icons","arguments":{}}}'
```

## 📁 File Structure & Responsibilities

```
mcp-server/
├── src/
│   ├── stdio-server.ts      # Local proxy (forwards to Cloudflare)
│   ├── index.ts             # Main logic (deployed to Cloudflare)
│   ├── iconList.ts          # Icon data (deployed to Cloudflare)
│   └── generateIconList.js  # Data generation script
├── dist/
│   ├── stdio-server.js      # Compiled proxy (published to npm)
│   ├── index.js             # Compiled logic (deployed to Cloudflare)
│   └── iconList.js          # Compiled data (deployed to Cloudflare)
├── package.json             # npm package config
└── wrangler.toml            # Cloudflare Workers config
```

## 🔍 Verification Steps

### **After Deployment**
1. **Check Cloudflare Workers**: Visit the Workers dashboard
2. **Test HTTP API**: Make direct HTTP requests to the Workers URL
3. **Test npm Package**: Run `npx @elbibs18/kinetic-icons-mcp-server@latest`
4. **Verify Icon Count**: Should show 1,190+ icons with proper names

### **Expected vs Problematic Results**
✅ **Correct**: `homeSmile`, `activityHeart`, `home01`, `bell02`
❌ **Incorrect**: `home`, `activity`, `bell` (generic Lucide names)

## 🛠️ Troubleshooting Guide

### **Problem**: MCP returns old/generic icon names
**Diagnosis**: Cloudflare Workers not updated
**Solution**: `npm run deploy`

### **Problem**: npm package not found
**Diagnosis**: Package not published or version mismatch
**Solution**: `npm publish`

### **Problem**: iconList.ts changes not reflected
**Diagnosis**: Local changes not deployed to Cloudflare
**Solution**: `npm run build && npm run deploy`

### **Problem**: HTTP errors from Workers
**Diagnosis**: Deployment failed or Workers down
**Solution**: Check Cloudflare Workers dashboard, redeploy

## 💡 Key Insights

1. **Two-Tier Architecture**: Never forget you're managing two separate deployments
2. **Data Source**: Icon data comes from website, not hardcoded
3. **Deployment Order**: Always deploy Cloudflare Workers before npm publish
4. **Testing**: Test both the HTTP API and npm package separately
5. **Version Sync**: Keep both components at the same version

## 🔄 Maintenance Workflow

### **When Icons Change**
1. Update website icons
2. Run `generateIconList.js` to extract new data
3. Deploy to Cloudflare Workers
4. Publish updated npm package
5. Update documentation and version numbers

### **Monthly Maintenance**
- Check Cloudflare Workers logs for errors
- Verify icon count matches website
- Test MCP integration with sample queries
- Update dependencies and redeploy

---

Remember: The MCP server is a **bridge** between icon files and AI tools. Both ends of the bridge (Cloudflare Workers and npm package) must be maintained together! 