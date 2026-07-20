"""Chat API — SSE streaming endpoint for the ReAct agent.

The frontend connects to POST /api/chat and receives a stream of
Server-Sent Events:
  - type: conversation_id  → the conversation ID
  - type: token            → streamed LLM text
  - type: tool_start       → agent started using a tool
  - type: tool_end         → agent finished using a tool
  - type: error            → something went wrong
  - type: done             → stream finished
"""

import json
import uuid
import logging
from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from langchain_core.messages import HumanMessage, AIMessage
from app.agent.graph import build_agent_graph
from app.agent.tools import get_builtin_tools
from app.mcp.client import mcp_registry
from app.db import get_db
from app.core.limiter import limiter

logger = logging.getLogger(__name__)
router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    conversation_id: str | None = None
    user_id: str


# ── Main chat endpoint ──────────────────────────────────────────────
@router.post("/chat")
@limiter.limit("5/minute; 50/hour; 200/day")
async def chat(request: Request, body: ChatRequest):
    """Stream agent responses as Server-Sent Events, storing in MongoDB."""
    db = get_db()
    if db is None:
        raise HTTPException(status_code=500, detail="Database not initialized")

    conv_collection = db["conversations"]
    
    # Get or create conversation
    conv_id = body.conversation_id or str(uuid.uuid4())
    conv = await conv_collection.find_one({"id": conv_id, "user_id": body.user_id})

    if not conv:
        conv = {
            "id": conv_id,
            "user_id": body.user_id,
            "title": body.message[:50] + "..." if len(body.message) > 50 else body.message,
            "created_at": datetime.now().isoformat(),
            "created_at_dt": datetime.utcnow(),
            "messages": []
        }
        await conv_collection.insert_one(conv)
    
    # Append the new human message to DB
    new_human_msg = {"role": "human", "content": body.message, "timestamp": datetime.now().isoformat()}
    await conv_collection.update_one(
        {"id": conv_id},
        {"$push": {"messages": new_human_msg}}
    )

    # Convert DB messages to LangChain objects
    lc_messages = []
    # Re-fetch latest to ensure we have all
    latest_conv = await conv_collection.find_one({"id": conv_id})
    
    # ── SLIDING WINDOW LOGIC ──
    # Only take the last 10 messages (5 user turns, 5 AI turns) to save tokens.
    # The full history remains in MongoDB and is visible in the UI.
    recent_messages = latest_conv.get("messages", [])[-10:]
    
    for m in recent_messages:
        if m["role"] == "human":
            lc_messages.append(HumanMessage(content=m["content"]))
        elif m["role"] == "ai":
            lc_messages.append(AIMessage(content=m["content"]))

    # Gather all tools (built-in + any MCP tools)
    all_tools = get_builtin_tools() + mcp_registry.tools

    # Build the LangGraph agent
    agent = build_agent_graph(all_tools)

    async def event_stream():
        """Generate SSE events as the agent reasons and acts."""
        try:
            full_response = ""
            yield f"data: {json.dumps({'type': 'conversation_id', 'id': conv_id})}\n\n"

            async for event in agent.astream_events(
                {"messages": lc_messages},
                config={"recursion_limit": 10},
                version="v2",
            ):
                kind = event.get("event", "")

                if kind == "on_chat_model_stream":
                    chunk = event.get("data", {}).get("chunk")
                    if chunk and hasattr(chunk, "content") and chunk.content:
                        content = chunk.content
                        if isinstance(content, str):
                            full_response += content
                            yield f"data: {json.dumps({'type': 'token', 'content': content})}\n\n"
                        elif isinstance(content, list):
                            # Handle case where content is a list of blocks
                            text_content = "".join([c.get("text", "") for c in content if isinstance(c, dict) and "text" in c])
                            if text_content:
                                full_response += text_content
                                yield f"data: {json.dumps({'type': 'token', 'content': text_content})}\n\n"
                        else:
                            logger.warning(f"Unexpected chunk content type: {type(content)} - {content}")
                    elif chunk:
                        # Log if we get a chunk without content to see what it is
                        pass

                elif kind == "on_tool_start":
                    tool_name = event.get("name", "unknown")
                    tool_input = event.get("data", {}).get("input", {})
                    yield f"data: {json.dumps({'type': 'tool_start', 'name': tool_name, 'input': str(tool_input)[:200]})}\n\n"

                elif kind == "on_tool_end":
                    tool_name = event.get("name", "unknown")
                    yield f"data: {json.dumps({'type': 'tool_end', 'name': tool_name})}\n\n"

            # Save AI response to MongoDB
            if full_response:
                new_ai_msg = {"role": "ai", "content": full_response, "timestamp": datetime.now().isoformat()}
                await conv_collection.update_one(
                    {"id": conv_id},
                    {"$push": {"messages": new_ai_msg}}
                )

            yield f"data: {json.dumps({'type': 'done'})}\n\n"

        except Exception as e:
            logger.error(f"Chat stream error: {e}", exc_info=True)
            yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


# ── Conversation management ─────────────────────────────────────────
@router.get("/conversations")
async def list_conversations(user_id: str):
    """List all conversations for a specific user (newest first)."""
    db = get_db()
    cursor = db["conversations"].find({"user_id": user_id}).sort("created_at", -1)
    result = []
    async for conv in cursor:
        result.append({
            "id": conv["id"],
            "title": conv.get("title", "Chat"),
            "created_at": conv.get("created_at"),
            "message_count": len(conv.get("messages", []))
        })
    return result

@router.delete("/conversations/{conversation_id}")
async def delete_conversation(conversation_id: str, user_id: str):
    """Delete a conversation."""
    db = get_db()
    result = await db["conversations"].delete_one({"id": conversation_id, "user_id": user_id})
    if result.deleted_count > 0:
        return {"status": "deleted"}
    raise HTTPException(status_code=404, detail="Conversation not found")

@router.get("/conversations/{conversation_id}")
async def get_conversation(conversation_id: str, user_id: str):
    """Fetch the full history of a specific conversation."""
    db = get_db()
    conv = await db["conversations"].find_one({"id": conversation_id, "user_id": user_id})
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    # Return messages without internal MongoDB _id
    messages = []
    for m in conv.get("messages", []):
        messages.append({
            "role": m.get("role"),
            "content": m.get("content"),
            "timestamp": m.get("timestamp")
        })
    
    return {
        "id": conv["id"],
        "title": conv.get("title", "Chat"),
        "created_at": conv.get("created_at"),
        "messages": messages
    }

@router.post("/conversations/new")
async def new_conversation(user_id: str):
    """Create a new empty conversation."""
    conv_id = str(uuid.uuid4())
    db = get_db()
    conv = {
        "id": conv_id,
        "user_id": user_id,
        "title": "New Chat",
        "created_at": datetime.now().isoformat(),
        "created_at_dt": datetime.utcnow(),
        "messages": []
    }
    await db["conversations"].insert_one(conv)
    return {"id": conv_id, "title": "New Chat"}
