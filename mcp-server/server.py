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


@mcp.tool(
    annotations={
        "readOnlyHint": True,
        "destructiveHint": False,
        "idempotentHint": False,
        "openWorldHint": True,
    }
)
async def get_github_pull_requests(owner: str, repo: str, limit: int = 5) -> str:
    """Fetches the latest open Pull Requests for a public GitHub repository.

    Args:
        owner: GitHub repository owner or organization (e.g. 'facebook', 'anthropics').
        repo: Repository name (e.g. 'react', 'fastmcp').
        limit: Maximum PRs to return (default: 5, max: 10).
    """
    url = f"https://api.github.com/repos/{owner}/{repo}/pulls"
    capped_limit = min(max(1, limit), 10)
    params = {"state": "open", "sort": "created", "direction": "desc", "per_page": capped_limit}

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url, headers=_github_headers(), params=params)
            if response.status_code == 404:
                return f"Error: GitHub repository '{owner}/{repo}' not found."
            response.raise_for_status()
            data = response.json()

            if not data:
                return f"No open Pull Requests found for {owner}/{repo}."

            lines = [f"**Open Pull Requests for {owner}/{repo}:**\n"]
            for pr in data:
                number = pr.get("number", "?")
                title = pr.get("title", "Untitled")
                user = pr.get("user", {}).get("login", "unknown")
                url_pr = pr.get("html_url", "")
                lines.append(f"- [#{number}]({url_pr}) {title} (by {user})")

            return "\n".join(lines)
    except Exception as e:
        logger.error(f"GitHub PRs error: {e}")
        return f"Failed to fetch Pull Requests: {str(e)}"


@mcp.tool(
    annotations={
        "readOnlyHint": True,
        "destructiveHint": False,
        "idempotentHint": False,
        "openWorldHint": True,
    }
)
async def get_github_latest_commits(owner: str, repo: str, limit: int = 5) -> str:
    """Fetches the latest commits for a public GitHub repository.

    Args:
        owner: GitHub repository owner or organization (e.g. 'Ambuj123-lab', 'langchain-ai').
        repo: Repository name (e.g. 'agentic-ai-workspace', 'langchain').
        limit: Maximum commits to return (default: 5, max: 10).
    """
    url = f"https://api.github.com/repos/{owner}/{repo}/commits"
    capped_limit = min(max(1, limit), 10)
    params = {"per_page": capped_limit}

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url, headers=_github_headers(), params=params)
            if response.status_code == 404:
                return f"Error: GitHub repository '{owner}/{repo}' not found."
            response.raise_for_status()
            data = response.json()

            if not data:
                return f"No commits found for {owner}/{repo}."

            lines = [f"**Latest Commits for {owner}/{repo}:**\n"]
            for commit_obj in data:
                commit = commit_obj.get("commit", {})
                author = commit.get("author", {}).get("name", "Unknown")
                date = commit.get("author", {}).get("date", "Unknown")
                message = commit.get("message", "").split("\n")[0]
                sha = commit_obj.get("sha", "")[:7]
                lines.append(f"- `{sha}` {date} | {author}: {message}")

            return "\n".join(lines)
    except Exception as e:
        logger.error(f"GitHub commits error: {e}")
        return f"Failed to fetch commits: {str(e)}"


@mcp.tool(
    annotations={
        "readOnlyHint": True,
        "destructiveHint": False,
        "idempotentHint": False,
        "openWorldHint": True,
    }
)
async def get_github_repo_contributors(owner: str, repo: str, limit: int = 5) -> str:
    """Fetches the top contributors for a public GitHub repository.

    Args:
        owner: GitHub repository owner or organization (e.g. 'facebook', 'vercel').
        repo: Repository name (e.g. 'react', 'next.js').
        limit: Maximum contributors to return (default: 5, max: 10).
    """
    url = f"https://api.github.com/repos/{owner}/{repo}/contributors"
    capped_limit = min(max(1, limit), 10)
    params = {"per_page": capped_limit}

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url, headers=_github_headers(), params=params)
            if response.status_code == 404:
                return f"Error: GitHub repository '{owner}/{repo}' not found."
            response.raise_for_status()
            data = response.json()

            if not data:
                return f"No contributors found for {owner}/{repo}."

            lines = [f"**Top Contributors for {owner}/{repo}:**\n"]
            for user in data:
                login = user.get("login", "Unknown")
                contributions = user.get("contributions", 0)
                profile_url = user.get("html_url", "")
                lines.append(f"- [{login}]({profile_url}): {contributions:,} contributions")

            return "\n".join(lines)
    except Exception as e:
        logger.error(f"GitHub contributors error: {e}")
        return f"Failed to fetch contributors: {str(e)}"


@mcp.tool(
    annotations={
        "readOnlyHint": False,
        "destructiveHint": False,
        "idempotentHint": False,
        "openWorldHint": True,
    }
)
def send_email(to_email: str, subject: str, body: str, cc_email: str = "") -> str:
    """Send an email via Gmail SMTP. Requires GMAIL_SENDER_EMAIL and GMAIL_APP_PASSWORD env vars.

    Args:
        to_email: Recipient email address.
        subject: Email subject line.
        body: Email body content (plain text or markdown).
        cc_email: Optional CC email address.
    """
    import smtplib
    from email.mime.text import MIMEText
    from email.mime.multipart import MIMEMultipart

    sender = os.getenv("GMAIL_SENDER_EMAIL", "").strip()
    password = os.getenv("GMAIL_APP_PASSWORD", "").strip()

    if not sender or not password:
        return "Error: GMAIL_SENDER_EMAIL or GMAIL_APP_PASSWORD environment variable is not configured."

    msg = MIMEMultipart("alternative")
    msg["From"] = sender
    msg["To"] = to_email
    if cc_email and cc_email.strip():
        msg["Cc"] = cc_email.strip()
    msg["Subject"] = subject

    msg.attach(MIMEText(body, "plain", "utf-8"))

    try:
        import markdown
        html_body = markdown.markdown(body, extensions=["tables", "fenced_code"])
        msg.attach(MIMEText(html_body, "html", "utf-8"))
    except ImportError:
        pass

    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(sender, password)

        recipients = [to_email]
        if cc_email and cc_email.strip():
            recipients.extend([e.strip() for e in cc_email.split(",") if e.strip()])

        server.sendmail(sender, recipients, msg.as_string())
        server.quit()
        return f"Email successfully sent to {to_email}"
    except Exception as e:
        logger.error(f"Email send error: {e}")
        return f"Failed to send email: {str(e)}"


@mcp.tool(
    annotations={
        "readOnlyHint": True,
        "destructiveHint": False,
        "idempotentHint": False,
        "openWorldHint": True,
    }
)
def read_emails(query: str = "UNSEEN", max_results: int = 5) -> str:
    """Read emails from Gmail inbox using IMAP search. Requires GMAIL_SENDER_EMAIL and GMAIL_APP_PASSWORD env vars.

    Args:
        query: IMAP search query (e.g. 'UNSEEN', 'FROM "boss@company.com"', 'SINCE "01-Jan-2025"').
        max_results: Maximum emails to return (default: 5, max: 10).
    """
    import imaplib
    import email
    from email.header import decode_header

    sender = os.getenv("GMAIL_SENDER_EMAIL", "").strip()
    password = os.getenv("GMAIL_APP_PASSWORD", "").strip()

    if not sender or not password:
        return "Error: GMAIL_SENDER_EMAIL or GMAIL_APP_PASSWORD environment variable is not configured."

    capped = min(max(1, max_results), 10)

    try:
        mail = imaplib.IMAP4_SSL("imap.gmail.com")
        mail.login(sender, password)
        mail.select("inbox")

        status, messages = mail.search(None, query)
        if status != "OK":
            return "No emails found or search failed."

        email_ids = messages[0].split()
        if not email_ids:
            return "No emails found for the given query."

        email_ids = email_ids[-capped:]
        email_ids.reverse()

        results = []
        for e_id in email_ids:
            res, msg_data = mail.fetch(e_id, "(RFC822)")
            for response_part in msg_data:
                if isinstance(response_part, tuple):
                    msg = email.message_from_bytes(response_part[1])
                    subj, encoding = decode_header(msg["Subject"])[0]
                    if isinstance(subj, bytes):
                        subj = subj.decode(encoding if encoding else "utf-8", errors="ignore")

                    from_addr = msg.get("From")
                    body_text = ""

                    if msg.is_multipart():
                        for part in msg.walk():
                            if part.get_content_type() == "text/plain":
                                try:
                                    body_text = part.get_payload(decode=True).decode(errors="ignore")
                                except Exception:
                                    pass
                                break
                    else:
                        try:
                            body_text = msg.get_payload(decode=True).decode(errors="ignore")
                        except Exception:
                            pass

                    results.append(f"**From:** {from_addr}\n**Subject:** {subj}\n**Snippet:** {body_text[:300]}...")

        mail.logout()
        return "\n\n---\n\n".join(results) if results else "No email content extracted."
    except Exception as e:
        logger.error(f"Read emails error: {e}")
        return f"Failed to read emails: {str(e)}"


# ==============================================================================
# Entry Point
# ==============================================================================
if __name__ == "__main__":
    logger.info("Starting Agentic AI Workspace FastMCP Server (stdio transport)...")
    mcp.run(transport="stdio")
