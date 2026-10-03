"""
Unit Tests for Agentic AI Workspace Tools & MCP Server Compliance.
Verifies tool execution, AST sandboxed math security, and M8ven 4-hint annotations.
"""

import sys
import unittest
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


if __name__ == "__main__":
    unittest.main()
