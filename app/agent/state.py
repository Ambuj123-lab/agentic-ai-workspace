from typing import Annotated, TypedDict
from langchain_core.messages import BaseMessage
from langgraph.graph.message import add_messages


class AgentState(TypedDict):
    """State definition for the ReAct agent graph.

    `messages` holds the full conversation history. LangGraph's
    `add_messages` reducer automatically appends new messages
    instead of overwriting the list.
    """

    messages: Annotated[list[BaseMessage], add_messages]
