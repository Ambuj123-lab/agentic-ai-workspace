"""
Agentic AI Workspace - Model Context Protocol (MCP) Server
===========================================================
High-reliability tool server providing Autonomous Web Search, Financial Quotes,
GitHub Ecosystem Analytics, Safe Mathematical Calculation, and Email Formatting.

Compatible with Claude Desktop, Cursor, and any standard MCP client.

Transport: Stdio (Standard I/O) / SSE capable
Version: 1.0.0
Author: Ambuj Kumar Tripathi
"""

import os
import sys
import ast
import operator
import logging
import httpx
from typing import Optional
from dotenv import load_dotenv
from mcp.server.fastmcp import FastMCP

# Load local environment if available
load_dotenv()

# Configure logging to stderr to keep stdout pure for JSON-RPC
logging.basicConfig(
    stream=sys.stderr,
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("agentic-ai-workspace-mcp")

# Initialize FastMCP Server
mcp = FastMCP(
    name="agentic-ai-workspace",
)


# --- Helper: Safe AST Math Evaluator ---
_SAFE_MATH_OPERATORS = {
    ast.Add: operator.add,
    ast.Sub: operator.sub,
    ast.Mult: operator.mul,
    ast.Div: operator.truediv,
    ast.FloorDiv: operator.floordiv,
    ast.Mod: operator.mod,
    ast.Pow: operator.pow,
    ast.USub: operator.neg,
    ast.UAdd: operator.pos,
}


def _safe_eval_ast(node):
    if isinstance(node, ast.Expression):
        return _safe_eval_ast(node.body)
    elif isinstance(node, ast.Constant):
        if isinstance(node.value, (int, float)):
            return node.value
        raise TypeError("Only integer and float numeric constants are supported.")
    elif isinstance(node, ast.BinOp):
        left = _safe_eval_ast(node.left)
        right = _safe_eval_ast(node.right)
        op_type = type(node.op)
        if op_type in _SAFE_MATH_OPERATORS:
            return _SAFE_MATH_OPERATORS[op_type](left, right)
        raise ValueError(f"Operator {op_type.__name__} is not allowed.")
    elif isinstance(node, ast.UnaryOp):
        operand = _safe_eval_ast(node.operand)
        op_type = type(node.op)
        if op_type in _SAFE_MATH_OPERATORS:
            return _SAFE_MATH_OPERATORS[op_type](operand)
        raise ValueError(f"Unary operator {op_type.__name__} is not allowed.")
    else:
        raise TypeError(f"Unsupported syntax tree element: {type(node).__name__}")


def _github_headers() -> dict:
    """Build GitHub API headers with optional token authentication."""
    token = os.getenv("GITHUB_TOKEN", "").strip()
    headers = {
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "Agentic-AI-Workspace-MCP/1.0.0",
    }
    if token:
        headers["Authorization"] = f"Bearer {token}"
    return headers


# ==============================================================================
# MCP Tools
# ==============================================================================

@mcp.tool(
    annotations={
        "readOnlyHint": True,
        "destructiveHint": False,
        "idempotentHint": False,
        "openWorldHint": True,
    }
)
async def web_search(query: str, max_results: int = 5) -> str:
    """Search the web for current information, news, facts, or real-time data.
    
    Args:
        query: Search query string.
        max_results: Maximum number of search results to return (default: 5, max: 10).
    """
    api_key = os.getenv("TAVILY_API_KEY", "").strip()
    if not api_key:
        return "Error: TAVILY_API_KEY environment variable is not configured on the server."
    
    try:
        from tavily import TavilyClient
        client = TavilyClient(api_key=api_key)
        capped_results = min(max(1, max_results), 10)
        response = client.search(
            query=query,
            search_depth="advanced",
            max_results=capped_results,
            include_answer=True,
        )
        parts = []
        if response.get("answer"):
            parts.append(f"Direct Answer: {response['answer']}\n")
        
        results = response.get("results", [])
        if not results:
            return "No web results found for this query."
        
        parts.append("Web Sources:")
        for idx, res in enumerate(results, 1):
            title = res.get("title", "Untitled")
            url = res.get("url", "")
            content = res.get("content", "").strip()
            parts.append(f"{idx}. [{title}]({url})\n   {content}\n")
        
        return "\n".join(parts)
    except Exception as e:
        logger.error(f"Tavily search error: {e}")
        return f"Web search failed: {str(e)}"


@mcp.tool(
    annotations={
        "readOnlyHint": True,
        "destructiveHint": False,
        "idempotentHint": False,
        "openWorldHint": True,
    }
)
async def fetch_webpage(url: str, max_chars: int = 4000) -> str:
    """Fetch and extract clean text content from a specific webpage URL.
    
    Args:
        url: Full HTTP or HTTPS webpage URL to read.
        max_chars: Maximum characters of text content to extract (default: 4000).
    """
    if not url.startswith(("http://", "https://")):
        return "Error: URL must start with http:// or https://"
    
    try:
        async with httpx.AsyncClient(follow_redirects=True, timeout=12.0) as client:
            headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
            resp = await client.get(url, headers=headers)
            resp.raise_for_status()
            
            import re
            text = resp.text
            # Remove scripts and styles
            text = re.sub(r"<script[^>]*>[\s\S]*?</script>", "", text, flags=re.IGNORECASE)
            text = re.sub(r"<style[^>]*>[\s\S]*?</style>", "", text, flags=re.IGNORECASE)
            # Remove tags
            clean_text = re.sub(r"<[^>]+>", " ", text)
            clean_text = re.sub(r"\s+", " ", clean_text).strip()
            
            capped = clean_text[:min(max_chars, 8000)]
            return f"Source: {url}\n\n{capped}"
    except Exception as e:
        logger.error(f"Fetch webpage error: {e}")
        return f"Failed to fetch webpage content: {str(e)}"


@mcp.tool(
    annotations={
        "readOnlyHint": True,
        "destructiveHint": False,
        "idempotentHint": False,
        "openWorldHint": True,
    }
)
async def get_stock_price(symbol: str) -> str:
    """Get real-time stock price, day range, market cap, and valuation metrics for a ticker symbol.
    
    Args:
        symbol: Stock ticker symbol (e.g. AAPL, NVDA, MSFT, GOOGL, TSLA).
    """
    api_key = os.getenv("RAPIDAPI_KEY", "").strip()
    clean_sym = symbol.strip().upper().replace("$", "")
    
    if not api_key:
        return f"Information: RAPIDAPI_KEY not configured. Please supply a valid RapidAPI Yahoo Finance key for live {clean_sym} ticker data."
    
    url = "https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-quotes"
    querystring = {"region": "US", "symbols": clean_sym}
    headers = {
        "x-rapidapi-key": api_key,
        "x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
    }
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url, headers=headers, params=querystring)
            response.raise_for_status()
            data = response.json()
            
            results = data.get("quoteResponse", {}).get("result", [])
            if not results:
                return f"No financial quote found for symbol '{clean_sym}'."
            
            q = results[0]
            name = q.get("shortName") or q.get("longName") or clean_sym
            price = q.get("regularMarketPrice", "N/A")
            change = q.get("regularMarketChange", 0)
            change_pct = q.get("regularMarketChangePercent", 0)
            day_high = q.get("regularMarketDayHigh", "N/A")
            day_low = q.get("regularMarketDayLow", "N/A")
            volume = q.get("regularMarketVolume", "N/A")
            currency = q.get("currency", "USD")
            
            direction = "+" if change >= 0 else ""
            return (
                f"**{name} ({clean_sym})**\n"
                f"- Price: {currency} {price} ({direction}{change:.2f}, {direction}{change_pct:.2f}%)\n"
                f"- Day Range: {day_low} - {day_high}\n"
                f"- Volume: {volume:,} shares\n"
                f"- Market State: {q.get('marketState', 'UNKNOWN')}"
            )
    except Exception as e:
        logger.error(f"Stock price fetch error: {e}")
        return f"Failed to retrieve market data for {clean_sym}: {str(e)}"


@mcp.tool(
    annotations={
        "readOnlyHint": True,
        "destructiveHint": False,
        "idempotentHint": False,
        "openWorldHint": True,
    }
)
async def get_github_repo_stats(owner: str, repo: str) -> str:
    """Fetches real-time statistics for a public GitHub repository.
    
    Args:
        owner: GitHub repository owner or organization (e.g. 'Ambuj123-lab', 'anthropics').
        repo: Repository name (e.g. 'agentic-ai-workspace', 'fastmcp').
    """
    url = f"https://api.github.com/repos/{owner}/{repo}"
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url, headers=_github_headers())
            if response.status_code == 404:
                return f"Error: GitHub repository '{owner}/{repo}' not found."
            response.raise_for_status()
            data = response.json()
            
            return (
                f"**GitHub Repository: {data.get('full_name')}**\n"
                f"- Description: {data.get('description', 'No description provided')}\n"
                f"- Stars: {data.get('stargazers_count', 0):,} ⭐\n"
                f"- Forks: {data.get('forks_count', 0):,} 🍴\n"
                f"- Open Issues & PRs: {data.get('open_issues_count', 0):,}\n"
                f"- Primary Language: {data.get('language', 'Not specified')}\n"
                f"- Default Branch: {data.get('default_branch', 'main')}\n"
                f"- License: {data.get('license', {}).get('spdx_id', 'None') if data.get('license') else 'None'}\n"
                f"- Repository URL: {data.get('html_url')}"
            )
    except Exception as e:
        logger.error(f"GitHub repo stats error: {e}")
        return f"Failed to fetch GitHub repository stats: {str(e)}"


@mcp.tool(
    annotations={
        "readOnlyHint": True,
        "destructiveHint": False,
        "idempotentHint": False,
        "openWorldHint": True,
    }
)
async def search_github_repositories(query: str, language: str = "", limit: int = 5) -> str:
    """Searches for public GitHub repositories based on keywords and language.
    
    Args:
        query: Search keywords or topic (e.g. 'agentic rag', 'fastmcp', 'langgraph').
        language: Optional language filter (e.g. 'python', 'typescript').
        limit: Maximum repositories to return (default: 5, max: 10).
    """
    q = query
    if language:
        q += f" language:{language}"
    
    url = "https://api.github.com/search/repositories"
    capped_limit = min(max(1, limit), 10)
    params = {"q": q, "sort": "stars", "order": "desc", "per_page": capped_limit}
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url, headers=_github_headers(), params=params)
            response.raise_for_status()
            items = response.json().get("items", [])
            
            if not items:
                return f"No GitHub repositories found matching '{query}'."
            
            lines = [f"**Top GitHub Repositories for '{query}':**\n"]
            for idx, r in enumerate(items, 1):
                desc = r.get("description") or "No description"
                lines.append(
                    f"{idx}. [{r.get('full_name')}]({r.get('html_url')}) - ⭐ {r.get('stargazers_count', 0):,}\n"
                    f"   Language: {r.get('language', 'N/A')} | {desc}\n"
                )
            return "\n".join(lines)
    except Exception as e:
        logger.error(f"GitHub search error: {e}")
        return f"GitHub repository search failed: {str(e)}"


@mcp.tool(
    annotations={
        "readOnlyHint": True,
        "destructiveHint": False,
        "idempotentHint": False,
        "openWorldHint": True,
    }
)
async def get_github_user_profile(username: str) -> str:
    """Fetches public profile statistics for a GitHub developer.
    
    Args:
        username: GitHub username handle (e.g. 'Ambuj123-lab').
    """
    url = f"https://api.github.com/users/{username}"
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url, headers=_github_headers())
            if response.status_code == 404:
                return f"Error: GitHub user '{username}' was not found."
            response.raise_for_status()
            d = response.json()
            
            return (
                f"**GitHub Profile: {d.get('name') or username} (@{d.get('login')})**\n"
                f"- Bio: {d.get('bio', 'No bio provided')}\n"
                f"- Public Repositories: {d.get('public_repos', 0):,}\n"
                f"- Followers: {d.get('followers', 0):,} | Following: {d.get('following', 0):,}\n"
                f"- Location: {d.get('location', 'Not specified')}\n"
                f"- Profile URL: {d.get('html_url')}"
            )
    except Exception as e:
        logger.error(f"GitHub profile error: {e}")
        return f"Failed to fetch GitHub profile for {username}: {str(e)}"


@mcp.tool(
    annotations={
        "readOnlyHint": True,
        "destructiveHint": False,
        "idempotentHint": True,
        "openWorldHint": False,
    }
)
def calculate_expression(expression: str) -> str:
    """Safely evaluates a mathematical expression using an Abstract Syntax Tree (AST).
    
    Zero arbitrary code execution vulnerability. Supports +, -, *, /, //, %, **, parentheses.
    
    Args:
        expression: Math expression to compute (e.g. '(100 / 5) ** 2 + 15 * 3').
    """
    try:
        clean_expr = expression.strip()
        parsed = ast.parse(clean_expr, mode="eval")
        result = _safe_eval_ast(parsed)
        return str(result)
    except Exception as e:
        return f"Calculation error: {str(e)}"


@mcp.tool(
    annotations={
        "readOnlyHint": True,
        "destructiveHint": False,
        "idempotentHint": True,
        "openWorldHint": False,
    }
)
def format_email_template(subject: str, body: str, style: str = "dark_corporate") -> str:
    """Formats raw text or markdown email content into an HTML email template.
    
    Args:
        subject: Email subject headline.
        body: Main body content in plain text or markdown.
        style: Template style ('dark_corporate' or 'midnight_pro').
    """
    try:
        import markdown
        rendered_body = markdown.markdown(body, extensions=['tables', 'fenced_code'])
    except ImportError:
        rendered_body = f"<p>{body.replace('\n', '<br/>')}</p>"
    
    return (
        f"<!-- Formatted Email HTML ({style}) -->\n"
        f"<div style='background-color:#0d0d0d; color:#e5e5e5; font-family:sans-serif; padding:24px; border-radius:8px;'>\n"
        f"  <h2 style='color:#ffffff; border-bottom:1px solid #333; padding-bottom:12px;'>{subject}</h2>\n"
        f"  <div style='line-height:1.6; font-size:14px;'>{rendered_body}</div>\n"
        f"  <div style='margin-top:24px; padding-top:12px; border-top:1px solid #222; font-size:12px; color:#888;'>\n"
        f"    Generated via Agentic AI Workspace MCP Server\n"
        f"  </div>\n"
        f"</div>"
    )


# ==============================================================================
# Entry Point
# ==============================================================================
if __name__ == "__main__":
    logger.info("Starting Agentic AI Workspace FastMCP Server (stdio transport)...")
    mcp.run(transport="stdio")
