"""
Unit Tests for Agentic AI Workspace Tools & MCP Server Compliance.
Verifies tool execution, AST sandboxed math security, and M8ven 4-hint annotations.
"""

import sys
import unittest
from unittest import mock
from pathlib import Path

# Add project root to sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

# Import MCP Server module
import importlib.util
mcp_server_path = PROJECT_ROOT / "mcp-server" / "server.py"
spec = importlib.util.spec_from_file_location("mcp_server", mcp_server_path)
mcp_server = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mcp_server)

from app.agent.tools import (
    _safe_eval_ast,
    calculator,
    get_builtin_tools,
)


class TestASTMathSandbox(unittest.TestCase):
    """Test AST-sandboxed math evaluator for correctness and zero code execution."""

    def test_basic_arithmetic(self):
        result = mcp_server.calculate_expression("2 + 2 * 3")
        self.assertIn("8", result)

    def test_complex_precedence_and_powers(self):
        result = mcp_server.calculate_expression("(100 / 5) ** 2 + 15 * 3")
        self.assertIn("445", result)

    def test_calculator_tool_built_in(self):
        result = calculator.invoke({"expression": "(50 * 2) + 10"})
        self.assertIn("110", result)

    def test_arbitrary_code_execution_blocked(self):
        # Disallowed function calls, imports, and variables must be safely rejected
        malicious_inputs = [
            "__import__('os').system('ls')",
            "open('/etc/passwd').read()",
            "eval('2+2')",
            "exec('x = 1')",
            "system('dir')",
        ]
        for expr in malicious_inputs:
            result = mcp_server.calculate_expression(expr)
            self.assertIn("error", result.lower(), f"Malicious input was not blocked: {expr}")


class TestEmailTemplates(unittest.TestCase):
    """Test email template styling and HTML generation."""

    def test_dark_corporate_template(self):
        html = mcp_server.format_email_template(
            subject="Quarterly Financial Report",
            body="Review of revenue growth across enterprise accounts.",
            style="dark_corporate",
        )
        self.assertIn("Quarterly Financial Report", html)
        self.assertIn("Review of revenue growth", html)
        self.assertIn("<div style=", html)

    def test_midnight_pro_template(self):
        html = mcp_server.format_email_template(
            subject="System Deployment Notice",
            body="Production release completed with 99.998% uptime.",
            style="midnight_pro",
        )
        self.assertIn("System Deployment Notice", html)
        self.assertIn("Production release completed", html)
        self.assertIn("<div style=", html)


class TestGitHubHeaders(unittest.TestCase):
    """Test GitHub API headers construction."""

    def test_github_headers_user_agent(self):
        headers = mcp_server._github_headers()
        self.assertIn("User-Agent", headers)
        self.assertIn("Agentic-AI-Workspace-MCP", headers["User-Agent"])
        self.assertEqual(headers["Accept"], "application/vnd.github.v3+json")


class TestM8venAnnotationCompliance(unittest.TestCase):
    """Verify that all 20 tools across the workspace declare all four M8ven hints."""

    REQUIRED_HINTS = ("readOnlyHint", "destructiveHint", "idempotentHint", "openWorldHint")

    def test_mcp_server_all_tools_have_four_hints(self):
        tools = mcp_server.mcp._tool_manager.list_tools()
        self.assertEqual(len(tools), 8, "Expected 8 tools declared in mcp-server/server.py")
        
        for tool in tools:
            annotations = tool.annotations
            self.assertIsNotNone(annotations, f"Tool '{tool.name}' is missing annotations object")
            for hint in self.REQUIRED_HINTS:
                val = getattr(annotations, hint, None)
                self.assertIsInstance(
                    val, bool,
                    f"Tool '{tool.name}' missing or non-boolean hint '{hint}': got {val}"
                )

    def test_app_agent_all_tools_have_four_hints(self):
        tools = get_builtin_tools()
        self.assertEqual(len(tools), 12, "Expected 12 tools declared in app/agent/tools.py")
        
        for tool in tools:
            metadata = getattr(tool, "metadata", {}) or {}
            for hint in self.REQUIRED_HINTS:
                self.assertIn(hint, metadata, f"Builtin tool '{tool.name}' missing hint '{hint}'")
                self.assertIsInstance(
                    metadata[hint], bool,
                    f"Builtin tool '{tool.name}' hint '{hint}' is not boolean: got {metadata[hint]}"
                )



class TestMCPServerToolsCoverage(unittest.IsolatedAsyncioTestCase):
    """Ensure every FastMCP tool declared in mcp-server/server.py is referenced and covered (8/8)."""

    async def test_mcp_web_search(self):
        with mock.patch("tavily.TavilyClient.search", return_value={"answer": "Direct AI Answer", "results": [{"title": "News", "url": "https://news.com", "content": "Update"}]}):
            with mock.patch.dict("os.environ", {"TAVILY_API_KEY": "test-key"}):
                result = await mcp_server.web_search("Python news")
                self.assertIn("Direct AI Answer", result)
                self.assertIn("Web Sources", result)

    async def test_mcp_fetch_webpage(self):
        result = await mcp_server.fetch_webpage("ftp://invalid-url.org")
        self.assertIn("Error: URL must start with", result)

    async def test_mcp_get_stock_price(self):
        mock_resp = mock.MagicMock()
        mock_resp.status_code = 200
        mock_resp.json.return_value = {
            "quoteResponse": {
                "result": [{
                    "shortName": "Apple Inc.",
                    "regularMarketPrice": 220.5,
                    "regularMarketChange": 1.5,
                    "regularMarketChangePercent": 0.68,
                    "regularMarketDayHigh": 222.0,
                    "regularMarketDayLow": 218.0,
                    "regularMarketVolume": 50000000,
                    "currency": "USD",
                    "marketState": "REGULAR"
                }]
            }
        }
        mock_resp.raise_for_status = mock.MagicMock()
        with mock.patch("httpx.AsyncClient.get", return_value=mock_resp):
            with mock.patch.dict("os.environ", {"RAPIDAPI_KEY": "test-key"}):
                result = await mcp_server.get_stock_price("AAPL")
                self.assertIn("Apple Inc.", result)
                self.assertIn("AAPL", result)

    async def test_mcp_get_github_repo_stats(self):
        mock_resp = mock.MagicMock()
        mock_resp.status_code = 200
        mock_resp.json.return_value = {
            "full_name": "Ambuj123-lab/agentic-ai-workspace",
            "description": "Agentic Workspace",
            "stargazers_count": 42,
            "forks_count": 5,
            "open_issues_count": 0,
            "language": "Python",
            "html_url": "https://github.com/Ambuj123-lab/agentic-ai-workspace"
        }
        mock_resp.raise_for_status = mock.MagicMock()
        with mock.patch("httpx.AsyncClient.get", return_value=mock_resp):
            result = await mcp_server.get_github_repo_stats("Ambuj123-lab", "agentic-ai-workspace")
            self.assertIn("Ambuj123-lab/agentic-ai-workspace", result)
            self.assertIn("Stars:", result)

    async def test_mcp_search_github_repositories(self):
        mock_resp = mock.MagicMock()
        mock_resp.status_code = 200
        mock_resp.json.return_value = {
            "items": [{
                "full_name": "test/repo",
                "html_url": "https://github.com/test/repo",
                "stargazers_count": 100,
                "language": "Python",
                "description": "A test repo"
            }]
        }
        mock_resp.raise_for_status = mock.MagicMock()
        with mock.patch("httpx.AsyncClient.get", return_value=mock_resp):
            result = await mcp_server.search_github_repositories("agentic rag", language="python")
            self.assertIn("test/repo", result)

    async def test_mcp_get_github_user_profile(self):
        mock_resp = mock.MagicMock()
        mock_resp.status_code = 200
        mock_resp.json.return_value = {
            "login": "Ambuj123-lab",
            "name": "Ambuj Tripathi",
            "public_repos": 10,
            "followers": 100,
            "following": 50,
            "html_url": "https://github.com/Ambuj123-lab"
        }
        mock_resp.raise_for_status = mock.MagicMock()
        with mock.patch("httpx.AsyncClient.get", return_value=mock_resp):
            result = await mcp_server.get_github_user_profile("Ambuj123-lab")
            self.assertIn("Ambuj123-lab", result)

    def test_mcp_calculate_expression_coverage(self):
        result = mcp_server.calculate_expression("10 + 20")
        self.assertIn("30", result)

    def test_mcp_format_email_template_coverage(self):
        result = mcp_server.format_email_template("Subject", "Body content", "dark_corporate")
        self.assertIn("Subject", result)


class TestBuiltinAgentToolsCoverage(unittest.IsolatedAsyncioTestCase):
    """Ensure all 12 tools declared in app/agent/tools.py are referenced and covered (12/12)."""

    async def test_agent_web_search(self):
        from app.agent.tools import web_search
        mock_results = {"results": [{"title": "News", "content": "Update", "url": "https://news.com"}]}
        with mock.patch("tavily.AsyncTavilyClient.search", return_value=mock_results):
            with mock.patch("app.agent.tools.get_settings") as mock_settings:
                mock_settings.return_value.TAVILY_API_KEY = "test-key"
                result = await web_search.ainvoke({"query": "AI agents"})
                self.assertIn("News", result)

    async def test_agent_fetch_webpage(self):
        from app.agent.tools import fetch_webpage
        mock_resp = mock.MagicMock()
        mock_resp.status_code = 200
        mock_resp.text = "# Sample Article Title\nThis is content."
        mock_resp.raise_for_status = mock.MagicMock()
        with mock.patch("httpx.AsyncClient.get", return_value=mock_resp):
            result = await fetch_webpage.ainvoke({"url": "https://example.com/article"})
            self.assertIn("Sample Article Title", result)

    async def test_agent_get_stock_price(self):
        from app.agent.tools import get_stock_price
        mock_resp = mock.MagicMock()
        mock_resp.status_code = 200
        mock_resp.json.return_value = {
            "quoteResponse": {
                "result": [{
                    "shortName": "Microsoft Corporation",
                    "regularMarketPrice": 420.0,
                    "regularMarketChangePercent": 1.2,
                    "currency": "USD"
                }]
            }
        }
        mock_resp.raise_for_status = mock.MagicMock()
        with mock.patch("httpx.AsyncClient.get", return_value=mock_resp):
            with mock.patch("app.agent.tools.get_settings") as mock_settings:
                mock_settings.return_value.RAPIDAPI_KEY = "test-key"
                result = await get_stock_price.ainvoke({"symbol": "MSFT"})
                self.assertIn("Microsoft Corporation", result)

    def test_agent_calculator(self):
        from app.agent.tools import calculator
        result = calculator.invoke({"expression": "15 * 4"})
        self.assertEqual(result, "60")

    def test_agent_send_email_confirmed(self):
        from app.agent.tools import send_email_confirmed
        result = send_email_confirmed.invoke({
            "to_email": "test@example.com",
            "subject": "Test Email",
            "body": "Hello World",
            "template_style": "dark_corporate"
        })
        self.assertIsInstance(result, str)
        self.assertTrue(len(result) > 0)

    def test_agent_read_emails(self):
        from app.agent.tools import read_emails
        result = read_emails.invoke({"query": "UNSEEN", "max_results": 1})
        self.assertIsInstance(result, str)
        self.assertTrue(len(result) > 0)

    def test_agent_get_github_repo_stats(self):
        from app.agent.tools import get_github_repo_stats
        mock_resp = mock.MagicMock()
        mock_resp.status_code = 200
        mock_resp.json.return_value = {
            "full_name": "facebook/react",
            "description": "A declarative UI library",
            "stargazers_count": 220000,
            "forks_count": 45000,
            "open_issues_count": 1200,
            "language": "JavaScript"
        }
        with mock.patch("requests.get", return_value=mock_resp):
            result = get_github_repo_stats.invoke({"owner": "facebook", "repo": "react"})
            self.assertIn("facebook/react", result)
            self.assertIn("Stars ⭐", result)

    def test_agent_get_github_pull_requests(self):
        from app.agent.tools import get_github_pull_requests
        mock_resp = mock.MagicMock()
        mock_resp.status_code = 200
        mock_resp.json.return_value = [
            {"number": 101, "title": "Fix bug", "user": {"login": "dev1"}}
        ]
        with mock.patch("requests.get", return_value=mock_resp):
            result = get_github_pull_requests.invoke({"owner": "facebook", "repo": "react"})
            self.assertIn("#101", result)

    def test_agent_get_github_user_profile(self):
        from app.agent.tools import get_github_user_profile
        mock_resp = mock.MagicMock()
        mock_resp.status_code = 200
        mock_resp.json.return_value = {
            "login": "torvalds",
            "name": "Linus Torvalds",
            "public_repos": 7,
            "followers": 210000,
            "following": 0
        }
        with mock.patch("requests.get", return_value=mock_resp):
            result = get_github_user_profile.invoke({"username": "torvalds"})
            self.assertIn("torvalds", result)

    def test_agent_search_github_repositories(self):
        from app.agent.tools import search_github_repositories
        mock_resp = mock.MagicMock()
        mock_resp.status_code = 200
        mock_resp.json.return_value = {
            "items": [
                {"full_name": "test/fastmcp", "stargazers_count": 500, "language": "Python", "description": "MCP"}
            ]
        }
        with mock.patch("requests.get", return_value=mock_resp):
            result = search_github_repositories.invoke({"query": "fastmcp", "language": "python"})
            self.assertIn("test/fastmcp", result)

    def test_agent_get_github_latest_commits(self):
        from app.agent.tools import get_github_latest_commits
        mock_resp = mock.MagicMock()
        mock_resp.status_code = 200
        mock_resp.json.return_value = [
            {"commit": {"author": {"name": "Ambuj", "date": "2026-10-06"}, "message": "feat: mcp update"}}
        ]
        with mock.patch("requests.get", return_value=mock_resp):
            result = get_github_latest_commits.invoke({"owner": "Ambuj123-lab", "repo": "agentic-ai-workspace"})
            self.assertIn("feat: mcp update", result)

    def test_agent_get_github_repo_contributors(self):
        from app.agent.tools import get_github_repo_contributors
        mock_resp = mock.MagicMock()
        mock_resp.status_code = 200
        mock_resp.json.return_value = [
            {"login": "Ambuj123-lab", "contributions": 50}
        ]
        with mock.patch("requests.get", return_value=mock_resp):
            result = get_github_repo_contributors.invoke({"owner": "Ambuj123-lab", "repo": "agentic-ai-workspace"})
            self.assertIn("Ambuj123-lab", result)
            self.assertIn("50 contributions", result)


if __name__ == "__main__":
    unittest.main()

