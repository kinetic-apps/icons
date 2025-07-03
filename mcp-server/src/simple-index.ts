import { iconNames } from "./iconList";

// Simple MCP server without auth
export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    
    // CORS headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Accept"
    };
    
    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }
    
    // OAuth discovery - indicate no auth required
    if (url.pathname === "/.well-known/oauth-protected-resource") {
      return new Response(JSON.stringify({
        resource: url.origin + "/sse",
        oauth_required: false
      }), {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });
    }
    
    // Main SSE endpoint
    if (url.pathname === "/sse") {
      // Handle POST requests with MCP messages
      if (request.method === "POST") {
        try {
          const body = await request.text();
          
          // Parse SSE data format
          const lines = body.split('\n');
          let jsonData = null;
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              jsonData = JSON.parse(line.substring(6));
              break;
            }
          }
          
          if (!jsonData) {
            // Try parsing as regular JSON
            jsonData = JSON.parse(body);
          }
          
          // Handle MCP requests
          const response = await handleMCPRequest(jsonData);
          
          // Return SSE formatted response
          return new Response(`data: ${JSON.stringify(response)}\n\n`, {
            headers: {
              ...corsHeaders,
              "Content-Type": "text/event-stream",
              "Cache-Control": "no-cache"
            }
          });
        } catch (error) {
          return new Response(`data: ${JSON.stringify({
            jsonrpc: "2.0",
            id: null,
            error: {
              code: -32700,
              message: "Parse error",
              data: error instanceof Error ? error.message : "Unknown error"
            }
          })}\n\n`, {
            status: 200, // SSE always returns 200
            headers: {
              ...corsHeaders,
              "Content-Type": "text/event-stream"
            }
          });
        }
      }
      
      // GET request - establish SSE stream
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          // Send initial connection event
          controller.enqueue(encoder.encode(`event: connected\ndata: {"type":"connected"}\n\n`));
          
          // Keep alive
          const interval = setInterval(() => {
            controller.enqueue(encoder.encode(`: ping\n\n`));
          }, 30000);
          
          // Cleanup on close
          request.signal.addEventListener('abort', () => {
            clearInterval(interval);
            controller.close();
          });
        }
      });
      
      return new Response(stream, {
        headers: {
          ...corsHeaders,
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive"
        }
      });
    }
    
    // Default 404
    return new Response(JSON.stringify({
      error: "Not found",
      message: "Use /sse endpoint for MCP"
    }), {
      status: 404,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  }
};

async function handleMCPRequest(request: any): Promise<any> {
  const { method, id, params } = request;
  
  try {
    switch (method) {
      case "initialize":
        return {
          jsonrpc: "2.0",
          id,
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
          id,
          result: {
            tools: [
              {
                name: "list_icons",
                description: "List all available icons in the Kinetic Icons library",
                inputSchema: {
                  type: "object",
                  properties: {
                    category: {
                      type: "string",
                      description: "Filter by category: all, line, solid",
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
                      description: "Keyword to search for"
                    }
                  },
                  required: ["keyword"]
                }
              }
            ]
          }
        };
        
      case "tools/call":
        const { name, arguments: args } = params || {};
        let result: any;
        
        if (name === "list_icons") {
          const category = args?.category || "all";
          let filtered = iconNames;
          
          if (category === "line") {
            filtered = iconNames.filter(n => n.endsWith("1_5"));
          } else if (category === "solid") {
            filtered = iconNames.filter(n => n.endsWith("Solid"));
          }
          
          const baseNames = new Set<string>();
          filtered.forEach(icon => {
            let base = icon;
            if (icon.endsWith("1_5")) base = icon.slice(0, -3);
            else if (icon.endsWith("Solid")) base = icon.slice(0, -5);
            baseNames.add(base);
          });
          
          result = {
            totalIcons: baseNames.size,
            category,
            icons: Array.from(baseNames).sort()
          };
        } else if (name === "search_icons") {
          const keyword = args?.keyword?.toLowerCase() || "";
          const matches = new Set<string>();
          
          iconNames.forEach(icon => {
            let base = icon;
            if (icon.endsWith("1_5")) base = icon.slice(0, -3);
            else if (icon.endsWith("Solid")) base = icon.slice(0, -5);
            
            if (base.toLowerCase().includes(keyword)) {
              matches.add(base);
            }
          });
          
          result = {
            searchTerm: args?.keyword,
            resultsCount: matches.size,
            icons: Array.from(matches).sort()
          };
        } else {
          throw new Error(`Unknown tool: ${name}`);
        }
        
        return {
          jsonrpc: "2.0",
          id,
          result: {
            content: [{
              type: "text",
              text: JSON.stringify(result, null, 2)
            }]
          }
        };
        
      default:
        return {
          jsonrpc: "2.0",
          id,
          error: {
            code: -32601,
            message: "Method not found"
          }
        };
    }
  } catch (error) {
    return {
      jsonrpc: "2.0",
      id,
      error: {
        code: -32603,
        message: error instanceof Error ? error.message : "Internal error"
      }
    };
  }
}