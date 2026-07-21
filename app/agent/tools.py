"""Built-in tools available to the ReAct agent.

These tools are always available regardless of MCP server connections.
They are intentionally lightweight — no heavy dependencies.
"""

import re
import logging
from langchain_core.tools import tool
from app.core.config import get_settings

logger = logging.getLogger(__name__)


@tool
async def web_search(query: str) -> str:
    """Search the web for current information, news, facts, or any real-time data.
    Use this whenever you need up-to-date information that you don't already know."""
    settings = get_settings()
    if not settings.TAVILY_API_KEY:
        return "Error: Web search is not configured. TAVILY_API_KEY is missing."

    try:
        from tavily import AsyncTavilyClient

        client = AsyncTavilyClient(api_key=settings.TAVILY_API_KEY)
        results = await client.search(query, max_results=5)

        formatted = []
        for r in results.get("results", []):
            title = r.get("title", "Untitled")
            content = r.get("content", "")
            url = r.get("url", "")
            formatted.append(f"**{title}**\n{content}\nSource: {url}")

        return "\n\n---\n\n".join(formatted) if formatted else "No results found."
    except Exception as e:
        logger.error(f"Web search error: {e}")
        return f"Web search failed: {str(e)}"


@tool
async def fetch_webpage(url: str) -> str:
    """Fetch and read the text content of a specific webpage URL.
    Use this when you need to read a specific article or page in detail."""
    import httpx

    try:
        async with httpx.AsyncClient(follow_redirects=True, timeout=15.0) as client:
            response = await client.get(url, headers={"User-Agent": "Mozilla/5.0"})
            response.raise_for_status()

            text = response.text
            # Strip script/style tags and HTML markup
            text = re.sub(r"<script[^>]*>.*?</script>", "", text, flags=re.DOTALL)
            text = re.sub(r"<style[^>]*>.*?</style>", "", text, flags=re.DOTALL)
            text = re.sub(r"<[^>]+>", " ", text)
            text = re.sub(r"\s+", " ", text).strip()

            # Truncate to avoid blowing up LLM context
            return text[:8000] if len(text) > 8000 else text
    except Exception as e:
        return f"Failed to fetch webpage: {str(e)}"


@tool
def calculator(expression: str) -> str:
    """Evaluate a mathematical expression safely.
    Examples: '2 + 2 * 3', '(100 / 5) ** 2', '3.14 * 10 ** 2'."""
    try:
        allowed = set("0123456789+-*/.() eE")
        if not all(c in allowed for c in expression):
            return "Error: Only numeric values and basic math operators (+, -, *, /, **, ()) are allowed."
        result = eval(expression)  # noqa: S307 — input is sanitized above
        return f"{result}"
    except Exception as e:
        return f"Calculation error: {str(e)}"


@tool
async def get_stock_price(symbol: str) -> str:
    """Get real-time stock price and market data for a given ticker symbol (e.g. AAPL, MSFT, TSLA).
    Uses Yahoo Finance API via RapidAPI."""
    import httpx
    settings = get_settings()
    
    if not settings.RAPIDAPI_KEY:
        return "Error: RAPIDAPI_KEY is missing."

    url = "https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-quotes"
    querystring = {"region": "US", "symbols": symbol}
    headers = {
        "X-RapidAPI-Key": settings.RAPIDAPI_KEY,
        "X-RapidAPI-Host": "apidojo-yahoo-finance-v1.p.rapidapi.com"
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url, headers=headers, params=querystring)
            response.raise_for_status()
            data = response.json()
            
            if "quoteResponse" in data and data["quoteResponse"]["result"]:
                stock = data["quoteResponse"]["result"][0]
                price = stock.get("regularMarketPrice", "N/A")
                change = stock.get("regularMarketChangePercent", 0)
                currency = stock.get("currency", "USD")
                name = stock.get("shortName", symbol)
                
                return f"**{name} ({symbol})**\nPrice: {price} {currency}\nChange: {change:.2f}%\n"
            else:
                return f"Could not find stock data for symbol: {symbol}"
    except Exception as e:
        logger.error(f"Stock API error: {e}")
        return f"Failed to fetch stock price: {str(e)}. CRITICAL INSTRUCTION: Do NOT retry this tool. Inform the user that the financial API is currently unavailable."

@tool
def send_email_confirmed(to_email: str, subject: str, body: str, cc_email: str = "", template_style: str = "none") -> str:
    """Send an email using Gmail SMTP. ONLY call this tool after the user has explicitly clicked the 'Approve & Send' button."""
    import smtplib
    from email.mime.text import MIMEText
    from email.mime.multipart import MIMEMultipart
    import os
    
    settings = get_settings()
    if not settings.GMAIL_SENDER_EMAIL or not settings.GMAIL_APP_PASSWORD:
        return "Error: GMAIL_SENDER_EMAIL or GMAIL_APP_PASSWORD not configured."

    # Default template to dark_corporate if none or empty
    if not template_style or template_style == "none":
        template_style = "dark_corporate"

    # Handle HTML Template injection if requested
    final_html = None
    if template_style and template_style != "none":
        template_path = os.path.join(os.path.dirname(__file__), "..", "templates", f"{template_style}.html")
        if os.path.exists(template_path):
            with open(template_path, "r", encoding="utf-8") as f:
                template_content = f.read()
                # Simple replacement for formatting
                formatted_body = body.replace("\n", "<br>") if "<" not in body else body
                final_html = template_content.replace("{{BODY}}", formatted_body)

    msg = MIMEMultipart('mixed')
    msg['From'] = settings.GMAIL_SENDER_EMAIL
    msg['To'] = to_email
    if cc_email and cc_email.strip():
        msg['Cc'] = cc_email.strip()
    msg['Subject'] = subject
    
    msg_body = MIMEMultipart('alternative')
    import re
    # Create plain text fallback by stripping tags
    plain_text = re.sub('<[^<]+>', '', body)
    msg_body.attach(MIMEText(plain_text, 'plain', 'utf-8'))
    
    # Attach HTML part if template was used, else check if body has HTML
    if final_html:
        msg_body.attach(MIMEText(final_html, 'html', 'utf-8'))
    elif "<html" in body.lower() or "<div" in body.lower() or "<p>" in body.lower() or "<br" in body.lower() or "<table" in body.lower():
        msg_body.attach(MIMEText(body, 'html', 'utf-8'))

    msg.attach(msg_body)

    # Automatically attach Resume for professional applications
    if template_style == "dark_corporate":
        resume_path = r"C:\Users\AMBUJ\OneDrive\Desktop\Ambuj_Kumar_Tripathi_GenAI_Resume.pdf"
        if os.path.exists(resume_path):
            from email.mime.application import MIMEApplication
            with open(resume_path, "rb") as f:
                pdf_attachment = MIMEApplication(f.read(), _subtype="pdf")
            pdf_attachment.add_header('Content-Disposition', 'attachment', filename='Ambuj_Kumar_Tripathi_GenAI_Resume.pdf')
            msg.attach(pdf_attachment)

    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(settings.GMAIL_SENDER_EMAIL, settings.GMAIL_APP_PASSWORD)
        
        recipients = [to_email]
        if cc_email and cc_email.strip():
            recipients.extend([e.strip() for e in cc_email.split(",") if e.strip()])
            
        server.sendmail(settings.GMAIL_SENDER_EMAIL, recipients, msg.as_string())
        server.quit()
        return f"Email successfully sent to {to_email}"
    except Exception as e:
        logger.error(f"Failed to send email: {e}")
        return f"Failed to send email: {str(e)}"

@tool
def read_emails(query: str = "UNSEEN", max_results: int = 5) -> str:
    """Read emails from Gmail using IMAP. 
    Use IMAP search queries like 'UNSEEN', 'FROM "boss@company.com"', 'SINCE "01-Jan-2023"'.
    Defaults to UNSEEN."""
    import imaplib
    import email
    from email.header import decode_header
    
    settings = get_settings()
    if not settings.GMAIL_SENDER_EMAIL or not settings.GMAIL_APP_PASSWORD:
        return "Error: GMAIL_SENDER_EMAIL or GMAIL_APP_PASSWORD not configured."

    try:
        mail = imaplib.IMAP4_SSL("imap.gmail.com")
        mail.login(settings.GMAIL_SENDER_EMAIL, settings.GMAIL_APP_PASSWORD)
        mail.select("inbox")
        
        status, messages = mail.search(None, query)
        if status != "OK":
            return "No emails found or search failed."
            
        email_ids = messages[0].split()
        if not email_ids:
            return "No emails found for the given query."
            
        # Get latest first
        email_ids = email_ids[-max_results:]
        email_ids.reverse()
        
        results = []
        for e_id in email_ids:
            res, msg_data = mail.fetch(e_id, "(RFC822)")
            for response_part in msg_data:
                if isinstance(response_part, tuple):
                    msg = email.message_from_bytes(response_part[1])
                    subject, encoding = decode_header(msg["Subject"])[0]
                    if isinstance(subject, bytes):
                        subject = subject.decode(encoding if encoding else "utf-8", errors="ignore")
                    
                    sender = msg.get("From")
                    body = ""
                    
                    if msg.is_multipart():
                        for part in msg.walk():
                            content_type = part.get_content_type()
                            if content_type == "text/plain":
                                try:
                                    body = part.get_payload(decode=True).decode(errors="ignore")
                                except:
                                    pass
                                break
                    else:
                        try:
                            body = msg.get_payload(decode=True).decode(errors="ignore")
                        except:
                            pass
                            
                    results.append(f"From: {sender}\nSubject: {subject}\nBody Snippet: {body[:300]}...")
                    
        mail.logout()
        return "\n\n---\n\n".join(results)
    except Exception as e:
        logger.error(f"Failed to read emails: {e}")
        return f"Failed to read emails: {str(e)}"

@tool
def get_github_repo_stats(owner: str, repo: str) -> str:
    """Fetches stats for a public GitHub repository including stars, forks, and open issues.
    
    Args:
        owner: The owner of the repository (e.g., 'facebook')
        repo: The repository name (e.g., 'react')
    """
    import requests
    logger.info(f"🐙 Fetching GitHub Stats for: {owner}/{repo}")
    try:
        url = f"https://api.github.com/repos/{owner}/{repo}"
        headers = {"Accept": "application/vnd.github.v3+json"}
        response = requests.get(url, headers=headers, timeout=10)
        
        if response.status_code != 200:
             return f"Failed to fetch repo stats. GitHub returned status {response.status_code}."
             
        data = response.json()
        report = (
            f"🐙 GITHUB REPOSITORY STATS ({data.get('full_name')})\n"
            f"----------------------------------------\n"
            f"Description: {data.get('description', 'N/A')}\n"
            f"Stars ⭐: {data.get('stargazers_count', 0):,}\n"
            f"Forks 🍴: {data.get('forks_count', 0):,}\n"
            f"Open Issues 🐛: {data.get('open_issues_count', 0):,}\n"
            f"Language 💻: {data.get('language', 'N/A')}\n"
            f"License 📝: {data.get('license', {}).get('name', 'N/A') if data.get('license') else 'N/A'}\n"
            f"----------------------------------------\n"
            f"(Data fetched real-time via GitHub REST API)"
        )
        return report
    except Exception as e:
        logger.error(f"❌ Tool failed for github stats: {e}")
        return f"Failed to fetch github stats: {e}"

@tool
def get_github_pull_requests(owner: str, repo: str) -> str:
    """Fetches the latest 5 open Pull Requests for a public GitHub repository.
    
    Args:
        owner: The owner of the repository (e.g., 'facebook')
        repo: The repository name (e.g., 'react')
    """
    import requests
    logger.info(f"🐙 Fetching GitHub PRs for: {owner}/{repo}")
    try:
        url = f"https://api.github.com/repos/{owner}/{repo}/pulls"
        headers = {"Accept": "application/vnd.github.v3+json"}
        querystring = {"state": "open", "sort": "created", "direction": "desc", "per_page": 5}
        response = requests.get(url, headers=headers, params=querystring, timeout=10)
        
        if response.status_code != 200:
             return f"Failed to fetch PRs. GitHub returned status {response.status_code}."
             
        data = response.json()
        if not data:
             return f"No open Pull Requests found for {owner}/{repo}."
             
        report = f"🐙 LATEST PULL REQUESTS ({owner}/{repo})\n----------------------------------------\n"
        for pr in data:
             report += f"- [#{pr['number']}] {pr['title']} (by {pr['user']['login']})\n"
             
        report += "----------------------------------------\n(Data fetched real-time via GitHub REST API)"
        return report
    except Exception as e:
        logger.error(f"❌ Tool failed for github prs: {e}")
        return f"Failed to fetch github prs: {e}"

@tool
def get_github_user_profile(username: str) -> str:
    """Fetches public profile stats for a GitHub user.
    
    Args:
        username: The GitHub username (e.g., 'linus-torvalds')
    """
    import requests
    logger.info(f"🐙 Fetching GitHub Profile for: {username}")
    try:
        url = f"https://api.github.com/users/{username}"
        headers = {"Accept": "application/vnd.github.v3+json"}
        response = requests.get(url, headers=headers, timeout=10)
        
        if response.status_code != 200:
             return f"Failed to fetch profile. GitHub returned status {response.status_code}."
             
        data = response.json()
        report = (
            f"🐙 GITHUB DEVELOPER PROFILE ({data.get('login')})\n"
            f"----------------------------------------\n"
            f"Name: {data.get('name', 'N/A')}\n"
            f"Bio: {data.get('bio', 'N/A')}\n"
            f"Public Repos: {data.get('public_repos', 0):,}\n"
            f"Followers: {data.get('followers', 0):,}\n"
            f"Following: {data.get('following', 0):,}\n"
            f"Company: {data.get('company', 'N/A')}\n"
            f"Location: {data.get('location', 'N/A')}\n"
            f"----------------------------------------\n"
            f"(Data fetched real-time via GitHub REST API)"
        )
        return report
    except Exception as e:
        logger.error(f"❌ Tool failed for github profile: {e}")
        return f"Failed to fetch github profile: {e}"

@tool
def search_github_repositories(query: str, language: str = "") -> str:
    """Searches for public GitHub repositories based on a query and optional language.
    
    Args:
        query: The search keywords (e.g., 'mcp server', 'machine learning')
        language: Optional programming language filter (e.g., 'python', 'typescript')
    """
    import requests
    logger.info(f"🐙 Searching GitHub Repos for: {query} (Lang: {language})")
    try:
        url = "https://api.github.com/search/repositories"
        headers = {"Accept": "application/vnd.github.v3+json"}
        
        q_param = query
        if language:
             q_param += f" language:{language}"
             
        querystring = {"q": q_param, "sort": "stars", "order": "desc", "per_page": 5}
        response = requests.get(url, headers=headers, params=querystring, timeout=10)
        
        if response.status_code != 200:
             return f"Failed to search repositories. GitHub returned status {response.status_code}."
             
        data = response.json()
        items = data.get("items", [])
        if not items:
             return f"No repositories found for query: {query}"
             
        report = f"🐙 TOP GITHUB SEARCH RESULTS for '{query}'\n----------------------------------------\n"
        for item in items:
             report += (
                 f"- {item['full_name']} (⭐ {item['stargazers_count']:,}) [{item.get('language', 'N/A')}]\n"
                 f"  Description: {item.get('description', 'N/A')}\n"
             )
        report += "----------------------------------------\n(Data fetched real-time via GitHub REST API)"
        return report
    except Exception as e:
        logger.error(f"❌ Tool failed for github search: {e}")
        return f"Failed to search github: {e}"

@tool
def get_github_latest_commits(owner: str, repo: str) -> str:
    """Fetches the latest 5 commits for a public GitHub repository.
    
    Args:
        owner: The owner of the repository (e.g., 'facebook')
        repo: The repository name (e.g., 'react')
    """
    import requests
    logger.info(f"🐙 Fetching latest commits for: {owner}/{repo}")
    try:
        url = f"https://api.github.com/repos/{owner}/{repo}/commits"
        headers = {"Accept": "application/vnd.github.v3+json"}
        querystring = {"per_page": 5}
        response = requests.get(url, headers=headers, params=querystring, timeout=10)
        
        if response.status_code != 200:
             return f"Failed to fetch commits. GitHub returned status {response.status_code}."
             
        data = response.json()
        if not data:
             return f"No commits found for {owner}/{repo}."
             
        report = f"🐙 LATEST COMMITS ({owner}/{repo})\n----------------------------------------\n"
        for commit_obj in data:
             commit = commit_obj.get("commit", {})
             author = commit.get("author", {}).get("name", "Unknown")
             date = commit.get("author", {}).get("date", "Unknown")
             message = commit.get("message", "").split("\n")[0]
             report += f"- {date} | {author}: {message}\n"
             
        report += "----------------------------------------\n(Data fetched real-time via GitHub REST API)"
        return report
    except Exception as e:
        logger.error(f"❌ Tool failed for github commits: {e}")
        return f"Failed to fetch github commits: {e}"

@tool
def get_github_repo_contributors(owner: str, repo: str) -> str:
    """Fetches the top 5 contributors for a public GitHub repository.
    
    Args:
        owner: The owner of the repository (e.g., 'facebook')
        repo: The repository name (e.g., 'react')
    """
    import requests
    logger.info(f"🐙 Fetching contributors for: {owner}/{repo}")
    try:
        url = f"https://api.github.com/repos/{owner}/{repo}/contributors"
        headers = {"Accept": "application/vnd.github.v3+json"}
        querystring = {"per_page": 5}
        response = requests.get(url, headers=headers, params=querystring, timeout=10)
        
        if response.status_code != 200:
             return f"Failed to fetch contributors. GitHub returned status {response.status_code}."
             
        data = response.json()
        if not data:
             return f"No contributors found for {owner}/{repo}."
             
        report = f"🐙 TOP CONTRIBUTORS ({owner}/{repo})\n----------------------------------------\n"
        for user in data:
             login = user.get("login", "Unknown")
             contributions = user.get("contributions", 0)
             report += f"- {login}: {contributions} contributions\n"
             
        report += "----------------------------------------\n(Data fetched real-time via GitHub REST API)"
        return report
    except Exception as e:
        logger.error(f"❌ Tool failed for github contributors: {e}")
        return f"Failed to fetch github contributors: {e}"

def get_builtin_tools() -> list:
    """Return all built-in tools for the agent."""
    return [
        web_search, 
        fetch_webpage, 
        calculator, 
        get_stock_price, 
        send_email_confirmed, 
        read_emails,
        get_github_repo_stats,
        get_github_pull_requests,
        get_github_user_profile,
        search_github_repositories,
        get_github_latest_commits,
        get_github_repo_contributors
    ]
