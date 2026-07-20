from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # --- LLM Configuration ---
    LLM_PROVIDER: str = "openrouter"  # "openrouter" or "gemini"
    OPENROUTER_API_KEY: str = ""
    GEMINI_API_KEY: str = ""
    LLM_MODEL: str = "" # Set in .env
    LLM_TEMPERATURE: float = 0.7

    # --- Database (MongoDB) ---
    MONGODB_URI: str = ""
    MONGODB_DB_NAME: str = "Agentic_MCP_Chatbot_DB"

    # --- Tool API Keys ---
    TAVILY_API_KEY: str = ""
    RAPIDAPI_KEY: str = ""
    
    # --- Gmail Config ---
    GMAIL_SENDER_EMAIL: str = ""
    GMAIL_APP_PASSWORD: str = ""

    # --- MCP Servers (JSON string) ---
    # Format: [{"name": "my-server", "url": "http://localhost:8001/sse"}]
    MCP_SERVERS_CONFIG: str = "[]"

    # --- Frontend ---
    FRONTEND_URL: str = "http://localhost:3000"

    class Config:
        env_file = ".env"
        extra = "ignore"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
