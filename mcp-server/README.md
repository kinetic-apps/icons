# Kinetic Icons MCP Server

A Model Context Protocol (MCP) server that provides AI assistants with access to the Kinetic Icons library. Search, discover, and get usage examples for over 1,500 high-quality icons.

## Features

- 🔍 **Search icons** by keyword (e.g., "arrow", "home", "user")
- 📋 **List all icons** with optional filtering by style (line, solid)
- ⚙️ **Get configuration** and usage examples
- 📚 **Best practices** for implementing icons in your projects
- 🎯 **Usage examples** for specific icons

## Quick Start

### With Cursor

1. **Configure GitHub Packages access** (if not already done):
   
   **Option A: Using Personal Access Token (Recommended)**
   ```bash
   # Create a GitHub Personal Access Token at https://github.com/settings/tokens
   # Select scope: read:packages
   echo "@kinetic-apps:registry=https://npm.pkg.github.com" >> ~/.npmrc
   echo "//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN" >> ~/.npmrc
   ```
   
   **Option B: Using npm login**
   ```bash
   npm login --scope=@kinetic-apps --auth-type=legacy --registry=https://npm.pkg.github.com
   ```

2. Add to your Cursor MCP configuration (`~/.cursor/mcp.json`):

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

3. Restart Cursor

4. Start chatting with AI about icons:
   - "Find arrow icons"
   - "How do I use the home icon?"
   - "What icons are available?"
   - "Show me best practices for icon usage"

### With Other MCP Clients

```bash
npx @kinetic-apps/kinetic-icons-mcp-server
```

## Installation

This package is published to GitHub Packages. To use it:

### Method 1: Using Personal Access Token (Recommended)

1. **Create a GitHub Personal Access Token**:
   - Go to https://github.com/settings/tokens
   - Generate new token (classic)
   - Select scope: `read:packages`
   - Copy the token

2. **Configure authentication**:
   ```bash
   echo "@kinetic-apps:registry=https://npm.pkg.github.com" >> ~/.npmrc
   echo "//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN" >> ~/.npmrc
   ```

3. **Install the package**:
   ```bash
   npm install @kinetic-apps/kinetic-icons-mcp-server
   ```

### Method 2: Using npm login

1. **Authenticate with GitHub Packages**:
   ```bash
   npm login --scope=@kinetic-apps --auth-type=legacy --registry=https://npm.pkg.github.com
   ```

2. **Install the package**:
   ```bash
   npm install @kinetic-apps/kinetic-icons-mcp-server
   ```

## Available Tools

### `search_icons`
Search for icons by keyword.

**Parameters:**
- `keyword` (string, required): Search term

**Example:**
```json
{
  "name": "search_icons",
  "arguments": {
    "keyword": "arrow"
  }
}
```

### `list_icons`
List all available icons with optional filtering.

**Parameters:**
- `category` (string, optional): Filter by "all", "line", or "solid"

**Example:**
```json
{
  "name": "list_icons",
  "arguments": {
    "category": "solid"
  }
}
```

### `get_icon_config`
Get configuration options for using Kinetic Icons.

### `get_best_practices`
Get best practices for implementing icons in your projects.

### `get_icon_usage_example`
Get usage examples for a specific icon.

**Parameters:**
- `iconName` (string, required): Name of the icon

## Icon Library

The Kinetic Icons library includes:
- **1,500+ icons** across multiple categories
- **Line and solid variants** for most icons
- **Consistent sizing** and styling
- **React and React Native** components
- **Tree-shaking support** for optimal bundle sizes

## Usage Examples

### React
```jsx
import { Icon } from '@kinetic-apps/icons';

<Icon name="home" size="lg" color="blue" variant="solid" />
```

### React Native
```jsx
import { Icon } from '@kinetic-apps/icons/native';

<Icon name="home" size={32} color="blue" variant="solid" />
```

### Individual Imports (Tree-shaking)
```jsx
import { HomeSolid } from '@kinetic-apps/icons';

<HomeSolid size={32} color="blue" />
```

## Configuration

### Icon Props
- `name`: Icon name (required)
- `size`: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number
- `color`: Color value (defaults to 'currentColor')
- `variant`: 'line' | 'solid' | 'auto'
- `strokeWidth`: Stroke width for line icons

### Size Mapping
- `xs`: 12px
- `sm`: 16px
- `md`: 24px (default)
- `lg`: 32px
- `xl`: 48px

## Development

This MCP server connects to the Kinetic Icons API hosted on Cloudflare Workers to provide real-time icon data and search capabilities.

## License

MIT

## Links

- [Kinetic Icons Repository](https://github.com/kinetic-apps/icons)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Cursor Editor](https://cursor.sh/)

---

Made with ❤️ by Kinetic Apps