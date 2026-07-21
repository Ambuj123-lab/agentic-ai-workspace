"""FastAPI entry point for the Agentic MCP Chatbot.

This is a lightweight server that:
  1. Hosts the ReAct agent API (LangGraph + MCP tools)
  2. Serves the Next.js static frontend in production
  3. Stays well under 512 MB RAM on Render free tier
"""

import os
import logging
from datetime import datetime
from dotenv import load_dotenv

# Load .env into os.environ for LangSmith tracing
load_dotenv()
from contextlib import asynccontextmanager
from fastapi import FastAPI, Response
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from app.api import chat as chat_module
from app.core.config import get_settings
from app.db import MongoDBClient

settings = get_settings()

# ── Logging ──────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)


# ── Lifespan ─────────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Setup MongoDB
    await MongoDBClient.connect()
    
    logger.info("🚀 Starting Agentic MCP Chatbot...")

    # Try to connect to configured MCP servers
    try:
        await mcp_registry.discover_and_register()
        logger.info(
            f"MCP: {len(mcp_registry.connected_servers)} server(s) connected, "
            f"{len(mcp_registry.tools)} tool(s) loaded"
        )
    except Exception as e:
        logger.warning(f"MCP initialization skipped: {e}")

    yield

    logger.info("🛑 Shutting down Agentic MCP Chatbot...")


# ── Rate Limiting ────────────────────────────────────────────────────
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from app.core.limiter import limiter

from app.mcp.client import mcp_registry

# ── App ──────────────────────────────────────────────────────────────
app = FastAPI(
    title="Agentic MCP Chatbot",
    description="A lightweight ReAct AI Agent with MCP tool integration",
    version="1.0.0",
    lifespan=lifespan,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

# CORS — allow frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── API Routes ───────────────────────────────────────────────────────
app.include_router(chat_module.router, prefix="/api", tags=["Chat"])


# ── Health Check ─────────────────────────────────────────────────────
@app.get("/health", tags=["System"])
@app.head("/health", tags=["System"])
def health():
    from app.agent.tools import get_builtin_tools
    from app.mcp.client import mcp_registry

    return {
        "status": "healthy",
        "agent": "ReAct Agentic AI",
        "builtin_tools": len(get_builtin_tools()),
        "mcp_tools": len(mcp_registry.tools),
        "mcp_servers": mcp_registry.connected_servers,
        "timestamp": datetime.now().isoformat(),
    }


# ── UptimeRobot Ping (HEAD / GET) ────────────────────────────────────
@app.get("/uptime", tags=["System"])
@app.head("/uptime", tags=["System"])
def uptime():
    """Lightweight endpoint for UptimeRobot to prevent Render cold starts."""
    return Response(status_code=200, content="OK")


# ── Serve Frontend (Production / Docker) ─────────────────────────────
frontend_dist = os.path.join(os.path.dirname(__file__), "..", "frontend", "out")


@app.get("/")
async def root():
    index_path = os.path.join(frontend_dist, "index.html")
    if os.path.exists(index_path):
        with open(index_path, "rb") as f:
            return Response(content=f.read(), media_type="text/html")
    return {
        "message": "Agentic MCP Chatbot API",
        "docs": "/docs",
        "health": "/health",
    }


if os.path.exists(frontend_dist):
    # Mount Next.js static assets
    next_static = os.path.join(frontend_dist, "_next")
    if os.path.exists(next_static):
        app.mount("/_next", StaticFiles(directory=next_static), name="next_static")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        # Don't intercept API or system routes
        if full_path.startswith(("api/", "health", "docs", "openapi.json")):
            return Response(status_code=404)

        file_path = os.path.join(frontend_dist, full_path)
        if os.path.isfile(file_path):
            from fastapi.responses import FileResponse

            return FileResponse(file_path)

        # SPA fallback — serve index.html
        index_path = os.path.join(frontend_dist, "index.html")
        if os.path.exists(index_path):
            with open(index_path, "rb") as f:
                return Response(content=f.read(), media_type="text/html")
        return Response(status_code=404)
