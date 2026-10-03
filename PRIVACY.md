# Privacy Policy & Data Governance — Agentic AI Workspace

**Effective Date:** October 3, 2026  
**Publisher:** Ambuj Kumar Tripathi ([Ambuj123-lab](https://github.com/Ambuj123-lab))  
**Repository:** [agentic-ai-workspace](https://github.com/Ambuj123-lab/agentic-ai-workspace)  
**Production Deployment:** [agentic-ai-workspace.onrender.com](https://agentic-ai-workspace.onrender.com)  

Agentic AI Workspace ("the platform", "we", "our") is committed to rigorous data security, user privacy, and transparent tool execution. This policy outlines how information is handled across both our **Next.js Web Application** and our **Model Context Protocol (MCP) Server**, compliant with Anthropic Claude Desktop, OpenAI, and M8ven MCP Publisher Trust guidelines.

---

## 1. Core Principles

1. **Zero Model Training:** We do not train, fine-tune, or retain user inputs, search queries, or outputs for machine learning model development.
2. **Ephemeral Tool Execution:** All MCP tool arguments (web search, financial data, GitHub lookups, calculations) are processed entirely in memory during active execution and discarded immediately after returning results.
3. **Strict Human-in-the-Loop (HITL) Controls:** Sensitive real-world operations (such as sending emails via Gmail SMTP) are strictly gated behind explicit, non-bypassable user confirmation and require the user's own configured credentials.
4. **Credential Isolation:** The platform never logs, persists, or transmits user API keys or private tokens. All credentials remain strictly within local environment variables or private hosting secrets.

---

## 2. Data Handled by MCP Tools

| MCP Tool | Data Collected / Processed | Retention | Third-Party Services |
|---|---|---|---|
| `web_search` | Search query string | Ephemeral (in-memory) | Tavily Search API |
| `fetch_webpage` | Public URL to extract text | Ephemeral (in-memory) | Target web server |
| `get_stock_price` | Stock ticker symbol | Ephemeral (in-memory) | Yahoo Finance / RapidAPI |
| `get_github_*` | GitHub usernames, repo names | Ephemeral (in-memory) | GitHub REST API v3 |
| `calculate_expression` | Mathematical expression string | Ephemeral (AST evaluation) | None (Local execution) |
| `format_email_template` | Email subject and body text | Ephemeral (HTML formatting) | None (Local execution) |

---

## 3. Web Workspace Data Storage & Session Lifecycle

For users interacting via the web workspace (`agentic-ai-workspace.onrender.com`):
- **Authentication:** Authentication is managed via NextAuth.js using Google OAuth 2.0. We only store standard public profile identifiers (email, name, avatar) necessary to provide authenticated chat sessions.
- **Conversation State:** Conversation threads are stored in MongoDB Atlas, strictly isolated by user ID and session thread ID.
- **Automatic 30-Day TTL Deletion:** A native MongoDB Time-to-Live (TTL) index automatically purges all conversation records after 30 days of inactivity.

---

## 4. Security Architecture

- **AST Expression Sandboxing:** Mathematical computation is performed via an Abstract Syntax Tree (AST) validator restricting operations to elementary arithmetic. Python's `eval()` and arbitrary code execution are prohibited.
- **Environment Isolation:** Local file attachments and sensitive paths are resolved via environment variables (`RESUME_PDF_PATH`), preventing absolute directory leakage.
- **Transport Security:** All communications are encrypted in transit using TLS 1.3 / HTTPS and standard JSON-RPC 2.0 over Stdio transport for local MCP connections.

---

## 5. Contact & Publisher Attestation

For privacy inquiries, audit verification, or security reports, please contact:
- **Publisher:** Ambuj Kumar Tripathi
- **Email:** ambujonly761@gmail.com
- **GitHub:** [https://github.com/Ambuj123-lab](https://github.com/Ambuj123-lab)
- **Portfolio:** [https://ambuj-ai-portfolio.vercel.app](https://ambuj-ai-portfolio.vercel.app)
