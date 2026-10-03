# Agentic AI Workspace — Model Context Protocol (MCP) Server

[![MCP Standard](https://img.shields.io/badge/MCP-Standard_v1.0-6B46C1?style=for-the-badge&logo=anthropic&logoColor=white)](https://modelcontextprotocol.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

Official Model Context Protocol (MCP) Server for the **Agentic AI Workspace**. Exposes 8 production-grade tools for autonomous agents, Claude Desktop, Cursor, and any MCP-compatible client over standard Stdio transport.

---

## 🛠️ Included Tools

| Tool | Description | Credentials Required |
|---|---|---|
| `web_search` | Real-time web browsing and factual search with citations via Tavily | `TAVILY_API_KEY` |
| `fetch_webpage` | Clean HTML-to-text webpage reader with script/style stripping | None |
| `get_stock_price` | Real-time equity market data, day ranges, and valuations | `RAPIDAPI_KEY` |
| `get_github_repo_stats` | Repository stars, forks, open issues, language, and metadata | Optional `GITHUB_TOKEN` |
| `search_github_repositories` | Semantic repository search filtered by programming language | Optional `GITHUB_TOKEN` |
| `get_github_user_profile` | Developer profile metrics, follower counts, and public repos | Optional `GITHUB_TOKEN` |
| `calculate_expression` | Safe mathematical expression evaluation using Python AST | None |
| `format_email_template` | Formats raw text/markdown into responsive HTML email templates | None |

---

## 🚀 Quick Setup (Claude Desktop)

Add the following block to your `claude_desktop_config.json`:

### macOS
`~/Library/Application Support/Claude/claude_desktop_config.json`

### Windows
`%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "agentic-ai-workspace": {
      "command": "python",
      "args": ["-m", "mcp-server.server"],
      "env": {
        "TAVILY_API_KEY": "your_tavily_api_key",
        "RAPIDAPI_KEY": "your_rapidapi_key",
        "GITHUB_TOKEN": "your_github_pat"
      }
    }
  }
}
```

---

## 🧪 Testing Locally

```bash
# 1. Install dependencies
pip install -r mcp-server/requirements.txt

# 2. Run with standard input/output
python mcp-server/server.py
```

---

## 🛡️ Security & Privacy

- **AST Expression Sandboxing:** `calculate_expression` parses expressions using an Abstract Syntax Tree whitelist. No `eval()` or arbitrary code execution is permitted.
- **Zero Data Training:** User queries are processed in memory and never used for model training.
- **Credential Safety:** All keys are read from environment variables; no secrets are persisted.
