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

1. Add to your Cursor MCP configuration (`~/.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "kinetic-icons": {
      "command": "npx",
      "args": ["-y", "@elbibs18/kinetic-icons-mcp-server"],
      "env": {}
    }
  }
}
```

2. Restart Cursor

3. Start chatting with AI about icons:
   - "Find arrow icons"
   - "How do I use the home icon?"
   - "What icons are available?"
   - "Show me best practices for icon usage"

### With Other MCP Clients

```bash
npx @elbibs18/kinetic-icons-mcp-server
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