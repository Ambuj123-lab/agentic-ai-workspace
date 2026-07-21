# Future MCP Tool Ideas

This document tracks potential future tools and connectors to enhance the Agentic-MCP-Chatbot's capabilities.

## 1. Local File System & Document Analyzer
- **Description:** Gives the AI read/write access to the local PC's folders and files.
- **Use Case:** Directly summarize local markdown files, analyze local CSV data, or find bugs in local code repositories without needing to upload them.

## 2. Database Connector (MongoDB / SQL / Supabase)
- **Description:** Allows the AI to connect to other live databases (e.g., the Agentic-Financial-Parser DB) via a connection string.
- **Use Case:** Acts as a natural-language "Admin Assistant". The AI can convert natural language to NoSQL/SQL queries to fetch real-time user stats, daily signups, or chat logs from other production applications.

## 3. Google Calendar Integration
- **Description:** Uses Google APIs to read/write events.
- **Use Case:** Check daily schedules, find free slots, and automatically schedule meetings based on chat prompts.

## 4. Everyday Utilities (Weather & News)
- **Description:** Integrates OpenWeather API and News API.
- **Use Case:** Makes the AI more conversational for everyday tasks (e.g., "Do I need an umbrella today?" or "What's the latest tech news?").

## 5. Task Management (Jira / Trello / Notion)
- **Description:** Connects to project management tools.
- **Use Case:** Works alongside the GitHub integration to check pending tickets, create bug reports, or update Kanban boards directly from the chat.

---
*Note: The Chatbot currently handles multi-turn memory efficiently using an anonymous `user_id` stored in the browser's `localStorage` and saved to MongoDB. For cross-device persistence in the future, integrating Google Auth (OAuth) is recommended.*
