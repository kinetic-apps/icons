# Kinetic Icons MCP Server

An authless MCP (Model Context Protocol) server that provides access to the Kinetic Icons library through AI assistants like Claude.

## Features

This MCP server exposes the following tools:

- **list_icons** - List all available icons with optional filtering by variant (line/solid)
- **search_icons** - Search for icons by keyword
- **get_icon_config** - Get all configuration options for the Icon component
- **get_icon_usage_example** - Get usage examples for a specific icon
- **get_best_practices** - Get comprehensive best practices guide

## Local Development

1. Install dependencies:
```bash
cd mcp-server
npm install
```

2. Start the development server:
```bash
npm start
```

Your MCP server will be running at `http://localhost:8787/sse`

3. Test with MCP Inspector:
```bash
npx @modelcontextprotocol/inspector@latest
```

Connect to `http://localhost:8787/sse` in the inspector.

## Deployment to Cloudflare Workers

1. Deploy the server:
```bash
npm run deploy
```

2. Your MCP server will be available at:
```
https://kinetic-icons-mcp-server.<your-account>.workers.dev/sse
```

## Connecting to Claude Desktop

Add the following to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "kinetic-icons": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://kinetic-icons-mcp-server.<your-account>.workers.dev/sse"
      ]
    }
  }
}
```

## Available Tools

### 1. list_icons
Lists all available icons with optional filtering.

Parameters:
- `category` (optional): "all", "line", or "solid"

Example response:
```json
{
  "totalIcons": 150,
  "category": "line",
  "icons": ["home", "user", "settings", ...]
}
```

### 2. search_icons
Search for icons by keyword.

Parameters:
- `keyword` (required): Search term

Example response:
```json
{
  "searchTerm": "user",
  "resultsCount": 5,
  "icons": ["user", "userCheck", "userEdit", "userPlus", "userX"]
}
```

### 3. get_icon_config
Returns all configuration options for the Icon component.

No parameters required.

### 4. get_icon_usage_example
Get usage examples for a specific icon.

Parameters:
- `iconName` (required): Name of the icon

Example response includes basic usage, variants, and direct import examples.

### 5. get_best_practices
Returns comprehensive best practices for using Kinetic Icons.

No parameters required.

## Example Interactions with Claude

Once connected, you can ask Claude:

- "List all available icons in the Kinetic Icons library"
- "Search for icons related to 'user'"
- "Show me how to use the home icon"
- "What are the configuration options for Kinetic Icons?"
- "What are the best practices for using Kinetic Icons?"

## Development Notes

- The server is built using Cloudflare's MCP Server SDK
- No authentication is required (authless)
- All tools are read-only and provide information about the icon library
- The server automatically imports icon metadata from the main package

## License

This MCP server follows the same license as the @kineticapps/icons package.