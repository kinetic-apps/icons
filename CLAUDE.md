# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

@kinetic-apps/icons is a comprehensive icon library providing 2,300+ SVG icons for React and React Native applications. It's published as a private npm package to GitHub Packages.

## Development Commands

### Building
```bash
npm run dev          # Watch mode with tsup
npm run build        # Full build (clean + icons + package)
npm run build:icons  # Build React web components only
npm run clean        # Remove all generated files
```

### Testing
```bash
# Web testing
cd test-app && npm run dev

# React Native testing  
cd expo-test-app && npm start
```

### Release & Publishing
```bash
npm run release  # Semantic release (CI only)
```

## Architecture & Key Patterns

### Icon Generation Pipeline
1. Source SVGs in `/icons/Line/1.5px/` and `/icons/Solid/`
2. Scripts convert SVGs → React/RN components with TypeScript
3. Colors normalized to `currentColor` for theming
4. Generated files in `src/components/` (web) and `src/icons-native/` (RN)

### Icon Naming Convention
- Line icons: `iconName` (e.g., `home`, `user`)
- Solid icons: `iconNameSolid` (e.g., `homeSolid`)
- Internal line variant naming: `iconName1_5`

### Import Methods
```typescript
// Dynamic (runtime selection)
import { Icon } from '@kinetic-apps/icons'
<Icon name="heart" size={24} color="red" />

// Tree-shakeable (optimal bundle size)
import { heart, heartSolid } from '@kinetic-apps/icons'
```

### Platform-Specific Handling
- Package.json exports field handles web/native resolution automatically
- Web: SVG-based components
- React Native: react-native-svg components

## Important Conventions

### Semantic Commits (REQUIRED)
All commits must follow conventional commit format for automatic versioning:
- `feat:` - New features (minor version bump)
- `fix:` - Bug fixes (patch version bump)  
- `BREAKING CHANGE:` - Breaking changes (major version bump)

### Code Style
- TypeScript strict mode enabled
- No unnecessary comments
- Keep components modular and focused
- Handle type constraints properly (no type assertions)

### Testing Pattern
When testing icon functionality:
1. Filter icons by removing suffixes to identify base names
2. Map line (`iconName1_5`) and solid (`iconNameSolid`) variants
3. Use pagination/limiting for performance with large icon sets

## GitHub Packages Authentication

Private package requires authentication:
```bash
npm config set @kineticapps:registry https://npm.pkg.github.com
npm config set //npm.pkg.github.com/:_authToken YOUR_GITHUB_TOKEN
```

## MCP Server

Model Context Protocol server available at `/mcp-server` for AI assistant integration. Deploy with Cloudflare Workers for icon discovery tools.

## Common Tasks

### Adding New Icons
1. Add SVG files to appropriate variant directory
2. Run `npm run build:icons` 
3. Test in both web and native test apps
4. Commit with semantic message

### Debugging Icon Issues
- Check generated TypeScript in `src/icons.ts`
- Verify SVG optimization in build scripts
- Test specific icon imports in test apps

### Publishing Updates
- Commits to main branch trigger automatic releases via GitHub Actions
- Version bumps determined by commit messages
- Published to GitHub Packages registry