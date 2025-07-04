#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';

// Cloudflare Workers API endpoint
const CLOUDFLARE_API_URL = 'https://kinetic-icons-mcp-server.raspy-hill-ac75.workers.dev';

class KineticIconsMCPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'kinetic-icons-mcp-server',
        version: '1.0.8',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  private setupErrorHandling(): void {
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'list_icons',
          description: 'List all available icons in the Kinetic Icons library',
          inputSchema: {
            type: 'object',
            properties: {
              category: {
                type: 'string',
                description: 'Filter icons by category (optional). Options: all, line, solid',
                enum: ['all', 'line', 'solid'],
              },
            },
          },
        },
        {
          name: 'search_icons',
          description: 'Search for icons by keyword',
          inputSchema: {
            type: 'object',
            properties: {
              keyword: {
                type: 'string',
                description: 'Keyword to search for in icon names',
              },
            },
            required: ['keyword'],
          },
        },
        {
          name: 'get_icon_config',
          description: 'Get configuration options for the Kinetic Icons',
          inputSchema: {
            type: 'object',
          },
        },
        {
          name: 'get_best_practices',
          description: 'Get best practices for using Kinetic Icons',
          inputSchema: {
            type: 'object',
          },
        },
        {
          name: 'get_icon_usage_example',
          description: 'Get usage examples for a specific icon',
          inputSchema: {
            type: 'object',
            properties: {
              iconName: {
                type: 'string',
                description: 'Name of the icon to get examples for',
              },
            },
            required: ['iconName'],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        const result = await this.callCloudflareAPI(name, args || {});
        return {
          content: [
            {
              type: 'text',
              text: typeof result === 'string' ? result : JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        throw new McpError(
          ErrorCode.InternalError,
          `Failed to call tool ${name}: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    });
  }

  private async callCloudflareAPI(toolName: string, args: any): Promise<any> {
    const requestPayload = {
      jsonrpc: '2.0',
      id: Date.now(),
      method: 'tools/call',
      params: {
        name: toolName,
        arguments: args,
      },
    };

    try {
      const response = await fetch(`${CLOUDFLARE_API_URL}/sse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const text = await response.text();
      
      // Parse SSE format
      const lines = text.split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = JSON.parse(line.substring(6));
          if (data.error) {
            throw new Error(data.error.message || 'API Error');
          }
          return data.result?.content?.[0]?.text || data.result;
        }
      }
      
      throw new Error('No valid response data found');
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to communicate with Cloudflare API');
    }
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Kinetic Icons MCP Server running on stdio');
  }
}

// Start the server
const server = new KineticIconsMCPServer();
server.run().catch(console.error); 