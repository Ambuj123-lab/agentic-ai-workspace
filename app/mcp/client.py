"""MCP Client — connects to external MCP servers and loads their tools.

This module lets the agent dynamically discover tools from any
standard MCP server (via SSE transport). New tools are automatically
available to LangGraph without code changes.

Usage:
  Set MCP_SERVERS_CONFIG env var to a JSON array:
  [{"name": "my-tools", "url": "http://localhost:8001/sse"}]
"""

import json
import logging
from langchain_core.tools import StructuredTool
from app.core.config import get_settings

logger = logging.getLogger(__name__)


class MCPToolRegistry:
    """Manages connections to MCP servers and wraps their tools for LangChain."""

    def __init__(self):
        self._tools: list = []
        self._connected_servers: list[str] = []

    async def discover_and_register(self):
        """Connect to all configured MCP servers and register their tools."""
        settings = get_settings()

        try:
            servers = json.loads(settings.MCP_SERVERS_CONFIG)
        except json.JSONDecodeError:
            logger.warning("Invalid MCP_SERVERS_CONFIG JSON. Skipping MCP discovery.")
            return

        if not servers:
            logger.info("No MCP servers configured. Using built-in tools only.")
            return

        for server_cfg in servers:
            name = server_cfg.get("name", "unknown")
            url = server_cfg.get("url", "")

            if not url:
                logger.warning(f"MCP server '{name}' has no URL. Skipping.")
                continue

            try:
                await self._connect_sse_server(name, url)
                self._connected_servers.append(name)
                logger.info(f"✅ Connected to MCP server: {name}")
            except Exception as e:
                logger.error(f"❌ Failed to connect to MCP server '{name}': {e}")

    async def _connect_sse_server(self, name: str, url: str):
        """Connect to a single MCP server via SSE and discover tools."""
        try:
            from mcp import ClientSession
            from mcp.client.sse import sse_client

            logger.info(f"Connecting to MCP server: {name} at {url}")

            async with sse_client(url) as (read_stream, write_stream):
                async with ClientSession(read_stream, write_stream) as session:
                    await session.initialize()

                    tools_result = await session.list_tools()

                    for tool_info in tools_result.tools:
                        lc_tool = self._wrap_mcp_tool(session, tool_info, name)
                        self._tools.append(lc_tool)
                        logger.info(f"  Registered MCP tool: {tool_info.name}")

        except ImportError:
            logger.warning("MCP SDK not installed. Run: pip install 'mcp[cli]'")
        except Exception as e:
            raise ConnectionError(f"MCP SSE connection failed: {e}")

    def _wrap_mcp_tool(self, session, tool_info, server_name: str) -> StructuredTool:
        """Wrap an MCP tool as a LangChain StructuredTool."""

        async def _call(**kwargs) -> str:
            try:
                result = await session.call_tool(tool_info.name, arguments=kwargs)
                if result.content:
                    return result.content[0].text
                return "Tool returned no content."
            except Exception as e:
                return f"Tool execution error: {e}"

        return StructuredTool.from_function(
            coroutine=_call,
            name=f"{server_name}__{tool_info.name}",
            description=tool_info.description or f"MCP tool from {server_name}",
        )

    @property
    def tools(self) -> list:
        return list(self._tools)

    @property
    def connected_servers(self) -> list[str]:
        return list(self._connected_servers)


# Singleton instance
mcp_registry = MCPToolRegistry()
