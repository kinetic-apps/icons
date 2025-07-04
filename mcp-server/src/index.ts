import { iconNames } from "./iconList";

interface MCPRequest {
  jsonrpc: "2.0";
  id: string | number;
  method: string;
  params?: any;
}

interface MCPResponse {
  jsonrpc: "2.0";
  id: string | number;
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

interface Tool {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties?: Record<string, any>;
    required?: string[];
  };
}

const tools: Tool[] = [
  {
    name: "list_icons",
    description: "List all available icons in the Kinetic Icons library",
    inputSchema: {
      type: "object",
      properties: {
        category: {
          type: "string",
          description: "Filter icons by category (optional). Options: all, line, solid",
          enum: ["all", "line", "solid"]
        }
      }
    }
  },
  {
    name: "search_icons",
    description: "Search for icons by keyword",
    inputSchema: {
      type: "object",
      properties: {
        keyword: {
          type: "string",
          description: "Keyword to search for in icon names"
        }
      },
      required: ["keyword"]
    }
  },
  {
    name: "get_icon_config",
    description: "Get configuration options for the Kinetic Icons",
    inputSchema: {
      type: "object"
    }
  },
  {
    name: "get_best_practices",
    description: "Get best practices for using Kinetic Icons",
    inputSchema: {
      type: "object"
    }
  },
  {
    name: "get_icon_usage_example",
    description: "Get usage examples for a specific icon",
    inputSchema: {
      type: "object",
      properties: {
        iconName: {
          type: "string",
          description: "Name of the icon to get examples for"
        }
      },
      required: ["iconName"]
    }
  }
];

async function handleTool(name: string, args: any): Promise<any> {
  switch (name) {
    case "list_icons": {
      const category = args?.category || "all";
      const icons = iconNames;
      
      // Icons are now stored as clean camelCase names, no need to filter by suffix
      return {
        totalIcons: icons.length,
        category,
        icons: icons.sort()
      };
    }
    
    case "search_icons": {
      const searchTerm = args.keyword.toLowerCase();
      const icons = iconNames;
      
      // Icons are now stored as clean camelCase names, search directly
      const results = icons.filter(icon => 
        icon.toLowerCase().includes(searchTerm)
      ).sort();
      
      return {
        searchTerm: args.keyword,
        resultsCount: results.length,
        icons: results
      };
    }
    
    case "get_icon_config": {
      return {
        sizes: {
          predefined: {
            xs: 12,
            sm: 16,
            md: 24,
            lg: 32,
            xl: 48
          },
          custom: "You can also use any number value for custom sizes"
        },
        variants: {
          line: "Line variant with 1.5px stroke width",
          solid: "Filled/solid variant",
          auto: "Automatically selects the best variant (defaults to line)"
        },
        props: {
          name: "IconName (required) - The name of the icon to render",
          size: "IconSize (optional) - 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number - defaults to 'md'",
          color: "string (optional) - Color of the icon, defaults to 'currentColor'",
          strokeWidth: "number (optional) - Stroke width for line icons, defaults to 1.5",
          variant: "'line' | 'solid' | 'auto' (optional) - Icon variant, defaults to 'auto'",
          style: "object (optional) - Additional styles to apply",
          onPress: "function (optional) - Click/press handler for React Native"
        }
      };
    }
    
    case "get_best_practices": {
      return {
        installation: {
          command: "npm install @kinetic-apps/icons",
          note: "You must install the package first before using any icons"
        },
        importingIcons: {
          recommended: "import { Icon } from '@kinetic-apps/icons';",
          usage: "<Icon name=\"home\" size=\"md\" color=\"blue\" />",
          directImport: "import { home } from '@kinetic-apps/icons';",
          note: "Direct imports give you more control but require handling variants manually"
        },
        sizingGuidelines: {
          xs: "Use for small UI elements like badges or status indicators",
          sm: "Use for inline text icons or small buttons",
          md: "Default size, good for most UI elements",
          lg: "Use for prominent buttons or feature icons",
          xl: "Use for hero sections or large empty states",
          custom: "Use numeric values for pixel-perfect control when needed"
        },
        colorManagement: {
          currentColor: "Default value that inherits text color - recommended for consistency",
          themeColors: "Use your theme's color variables for consistency",
          example: "color={theme.colors.primary}"
        },
        variantSelection: {
          auto: "Recommended - automatically selects the best variant",
          line: "Use when you need consistent stroke-based icons",
          solid: "Use for filled icons, good for active states or emphasis",
          fallback: "If a variant doesn't exist, the component falls back to the available one"
        },
        performance: {
          treeshaking: "Only imported icons are included in your bundle",
          lazyLoading: "Consider lazy loading icon sets for better initial load",
          memoization: "Icons are already optimized, but memoize parent components if needed"
        },
        accessibility: {
          ariaLabel: "Add aria-label for icons used as buttons",
          decorative: "Use aria-hidden=\"true\" for decorative icons",
          contrast: "Ensure sufficient color contrast for interactive icons"
        },
        reactNative: {
          hook: "Use the useIcon hook for dynamic icon loading",
          example: "const IconComponent = useIcon(iconName);",
          touchable: "Wrap in TouchableOpacity for interactive icons"
        }
      };
    }
    
    case "get_icon_usage_example": {
      const icons = iconNames;
      const iconName = args.iconName;
      
      if (!icons.includes(iconName)) {
        throw new Error(`Icon "${args.iconName}" not found. Use 'search_icons' to find available icons.`);
      }
      
      // For now, assume all icons have both line and solid variants
      // This matches what the website shows - most icons have all variants
      const availableVariants = {
        line: true,
        solid: true
      };
      
      return {
        iconName: args.iconName,
        availableVariants,
        installation: "npm install @kinetic-apps/icons",
        import: "import { Icon } from '@kinetic-apps/icons';",
        examples: {
          basic: `<Icon name="${iconName}" />`,
          withSize: `<Icon name="${iconName}" size="lg" />`,
          withColor: `<Icon name="${iconName}" color="#3B82F6" />`,
          withVariant: `<Icon name="${iconName}" variant="solid" />`,
          customSize: `<Icon name="${iconName}" size={32} />`,
          withHandler: `<Icon name="${iconName}" onPress={() => console.log('Clicked!')} />`,
          styled: `<Icon name="${iconName}" style={{ marginRight: 8 }} />`
        },
        directImport: {
          line: `import { ${iconName}1_5 } from '@kinetic-apps/icons';`,
          solid: `import { ${iconName}Solid } from '@kinetic-apps/icons';`,
          usage: `<${iconName}1_5 size={24} color="blue" />`
        },
        variantOptions: {
          line: {
            "1.5px": `<Icon name="${iconName}" variant="line" strokeWidth={1.5} />`,
            "2px": `<Icon name="${iconName}" variant="line" strokeWidth={2} />`
          },
          solid: `<Icon name="${iconName}" variant="solid" />`
        }
      };
    }
    
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function handleRequest(request: MCPRequest): Promise<MCPResponse> {
  try {
    switch (request.method) {
      case "initialize":
        return {
          jsonrpc: "2.0",
          id: request.id,
          result: {
            protocolVersion: "2024-11-05",
            capabilities: {
              tools: {}
            },
            serverInfo: {
              name: "kinetic-icons-mcp-server",
              version: "0.1.0"
            }
          }
        };
        
      case "tools/list":
        return {
          jsonrpc: "2.0",
          id: request.id,
          result: { tools }
        };
        
      case "tools/call":
        const { name, arguments: args } = request.params || {};
        const result = await handleTool(name, args);
        return {
          jsonrpc: "2.0",
          id: request.id,
          result: { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] }
        };
        
      default:
        return {
          jsonrpc: "2.0",
          id: request.id,
          error: {
            code: -32601,
            message: "Method not found"
          }
        };
    }
  } catch (error) {
    return {
      jsonrpc: "2.0",
      id: request.id,
      error: {
        code: -32603,
        message: error instanceof Error ? error.message : "Internal error"
      }
    };
  }
}

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    
    // Handle CORS
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      });
    }

    // Handle OAuth discovery endpoints - tell clients no auth is required
    if (url.pathname === "/.well-known/oauth-protected-resource") {
      return new Response(JSON.stringify({
        resource: url.origin + "/sse",
        oauth_required: false
      }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    
    if (url.pathname === "/.well-known/oauth-authorization-server/sse") {
      // Return 404 to indicate no OAuth server for this endpoint
      return new Response("Not Found", {
        status: 404,
        headers: {
          "Content-Type": "text/plain",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    // Handle SSE endpoint for MCP
    if (url.pathname === "/sse") {
      const encoder = new TextEncoder();
      
      // Check if this is an OAuth/auth check request
      const acceptHeader = request.headers.get("accept") || "";
      if (acceptHeader.includes("application/json")) {
        // Return JSON response for auth checks
        return new Response(JSON.stringify({
          error: "This server does not require authentication"
        }), {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        });
      }
      
      // For GET requests, establish SSE stream
      if (request.method === "GET") {
        let keepAliveInterval: any;
        
        const stream = new ReadableStream({
          start(controller) {
            // Keep connection alive
            keepAliveInterval = setInterval(() => {
              controller.enqueue(encoder.encode(": ping\n\n"));
            }, 30000);
          },
          cancel() {
            if (keepAliveInterval) {
              clearInterval(keepAliveInterval);
            }
          }
        });
        
        return new Response(stream, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Access-Control-Allow-Origin": "*",
            "X-Accel-Buffering": "no"
          }
        });
      }
      
      // For POST requests, handle MCP messages
      if (request.method === "POST") {
        try {
          const body = await request.json() as MCPRequest;
          const response = await handleRequest(body);
          
          // Return as SSE format
          const sseMessage = `data: ${JSON.stringify(response)}\n\n`;
          
          return new Response(sseMessage, {
            headers: {
              "Content-Type": "text/event-stream",
              "Cache-Control": "no-cache",
              "Access-Control-Allow-Origin": "*"
            }
          });
        } catch (error) {
          const errorResponse = {
            jsonrpc: "2.0",
            id: null,
            error: {
              code: -32700,
              message: "Parse error"
            }
          };
          
          const sseMessage = `data: ${JSON.stringify(errorResponse)}\n\n`;
          return new Response(sseMessage, {
            status: 400,
            headers: {
              "Content-Type": "text/event-stream",
              "Access-Control-Allow-Origin": "*"
            }
          });
        }
      }
    }
    
    // Handle regular JSON-RPC endpoint
    if (request.method === "POST" && request.headers.get("content-type")?.includes("application/json")) {
      try {
        const body = await request.json() as MCPRequest;
        const response = await handleRequest(body);
        
        return new Response(JSON.stringify(response), {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        });
      } catch (error) {
        return new Response(JSON.stringify({
          jsonrpc: "2.0",
          id: null,
          error: {
            code: -32700,
            message: "Parse error"
          }
        }), {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        });
      }
    }
    
    // Default response - check if JSON is expected
    const acceptHeader = request.headers.get("accept") || "";
    if (acceptHeader.includes("application/json")) {
      return new Response(JSON.stringify({
        error: "Invalid endpoint",
        message: "MCP Server is running. Use /sse for SSE transport."
      }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    
    return new Response("MCP Server is running", {
      headers: {
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
};