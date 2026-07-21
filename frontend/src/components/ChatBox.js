"use client";

import { useState, useRef, useEffect } from "react";
import Markdown from "markdown-to-jsx";
import { Send, Bot, User, Activity, LogOut, MessageSquare, Trash2, Menu, X, Copy, Check } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import GenerativeChart from "./GenerativeChart";

export default function ChatBox() {
  const { data: session } = useSession();
  const userId = session?.user?.email;

  const [messages, setMessages] = useState([
    {
      role: "ai",
      content: "### Welcome to Ambuj Kumar Tripathi's Workspace\n\nAn Agentic AI powered by **Model Context Protocol (MCP)** for secure tool orchestration, intelligent automation, and Human-in-the-Loop workflows.\n\nHow can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentTool, setCurrentTool] = useState(null);
  const [conversationId, setConversationId] = useState(null);

  // Sidebar states
  const [conversations, setConversations] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Copy button state
  const [copiedIndex, setCopiedIndex] = useState(null);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // ── FETCH CONVERSATIONS ON LOAD ──
  useEffect(() => {
    if (!userId) return;

    const loadConversations = async () => {
      try {
        const res = await fetch(`/api/conversations?user_id=${userId}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setConversations(data);
          // If there are conversations and we don't have an active one, load the latest
          if (data.length > 0 && !conversationId) {
            loadChatHistory(data[0].id);
          }
        } else {
          setConversations([]);
        }
      } catch (err) {
        console.error("Failed to load conversations:", err);
      }
    };

    loadConversations();
  }, [userId]);

  // ── LOAD SPECIFIC CHAT HISTORY ──
  const loadChatHistory = async (id) => {
    if (!userId) return;
    setIsLoading(true);
    setConversationId(id);
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
    try {
      const res = await fetch(`/api/conversations/${id}?user_id=${userId}`);
      const data = await res.json();

      if (data.messages && data.messages.length > 0) {
        setMessages(data.messages);
      } else {
        setMessages([{
          role: "ai",
          content: "### Welcome to Ambuj Kumar Tripathi's Workspace\n\nHow can I help you today?",
        }]);
      }
    } catch (err) {
      console.error("Failed to load history:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // ── START NEW CHAT ──
  const handleNewChat = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`/api/conversations/new?user_id=${userId}`, { method: "POST" });
      const data = await res.json();
      setConversationId(data.id);
      setIsSidebarOpen(false);
      setMessages([{
        role: "ai",
        content: "### Welcome to Ambuj Kumar Tripathi's Workspace\n\nHow can I help you today?",
      }]);
      // Refresh sidebar list
      const listRes = await fetch(`/api/conversations?user_id=${userId}`);
      setConversations(await listRes.json());
    } catch (err) {
      console.error("Failed to create new chat:", err);
    }
  };

  // ── DELETE CHAT ──
  const deleteConversation = async (e, id) => {
    e.stopPropagation(); // Prevent loading the chat when clicking delete
    if (!userId) return;
    if (!confirm("Are you sure you want to delete this chat?")) return;

    try {
      await fetch(`/api/conversations/${id}?user_id=${userId}`, { method: "DELETE" });

      // Remove from UI immediately
      const newConvs = conversations.filter(c => c.id !== id);
      setConversations(newConvs);

      // If we deleted the active chat, clear the screen
      if (conversationId === id) {
        if (newConvs.length > 0) {
          loadChatHistory(newConvs[0].id);
        } else {
          handleNewChat();
        }
      }
    } catch (err) {
      console.error("Failed to delete chat:", err);
    }
  };


  const extractDraft = (content) => {
    const match = content.match(/```json\n([\s\S]*?)\n```/);
    if (match) {
      try {
        const data = JSON.parse(match[1]);
        if (data.type === "GMAIL_DRAFT") return data;
      } catch (e) { }
    }
    return null;
  };

  const extractChart = (content) => {
    const charts = [];
    const blockRegex = /```json\n([\s\S]*?)\n```/g;
    let match;
    while ((match = blockRegex.exec(content)) !== null) {
      try {
        const data = JSON.parse(match[1]);
        if (data.type === "UI_CHART") charts.push(data);
      } catch (e) { }
    }
    return charts.length > 0 ? charts : null;
  };

  const cleanContent = (content) => {
    let cleaned = content.replace(/```json\n[\s\S]*?"type":\s*"GMAIL_DRAFT"[\s\S]*?\n```/g, "");
    cleaned = cleaned.replace(/```json\n[\s\S]*?"type":\s*"UI_CHART"[\s\S]*?\n```/g, "");
    return cleaned;
  };

  const confirmSendEmail = (draft) => {
    if (isLoading) return;
    const template_style = draft.template_style || "none";
    const cmd = `CONFIRM_SEND_EMAIL: {"to": "${draft.to}", "cc": "${draft.cc || ''}", "subject": "${draft.subject}", "body": ${JSON.stringify(draft.body)}, "template_style": "${template_style}"}`;
    submitHiddenMessage(cmd, `Sending email to ${draft.to}...`);
  };

  const cancelEmail = () => {
    if (isLoading) return;
    submitHiddenMessage("The user canceled the email draft.", "Canceled email draft.");
  };

  const submitHiddenMessage = async (hiddenCmd, displayMsg) => {
    if (!userId) return;
    setMessages((prev) => [...prev, { role: "user", content: displayMsg }]);
    setIsLoading(true);
    setCurrentTool(null);
    setMessages((prev) => [...prev, { role: "ai", content: "" }]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: hiddenCmd,
          conversation_id: conversationId,
          user_id: userId,
        }),
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiContent = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));

              if (data.type === "conversation_id") {
                setConversationId(data.id);
              } else if (data.type === "token") {
                aiContent += data.content;
                setMessages((prev) => {
                  const newMsgs = [...prev];
                  newMsgs[newMsgs.length - 1].content = aiContent;
                  return newMsgs;
                });
              } else if (data.type === "tool_start") {
                setCurrentTool(data.name);
              } else if (data.type === "tool_end") {
                setCurrentTool(null);
              }
            } catch (err) { }
          }
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setCurrentTool(null);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentTool]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !userId) return;

    const userMessage = input.trim();
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);
    setCurrentTool(null);

    setMessages((prev) => [...prev, { role: "ai", content: "" }]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          conversation_id: conversationId,
          user_id: userId,
        }),
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiContent = "";

      let buffer = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop(); // Keep the incomplete chunk in the buffer

        for (const event of events) {
          if (event.trim().startsWith("data: ")) {
            try {
              const dataString = event.trim().substring(6);
              if (dataString === "[DONE]") continue;
              const data = JSON.parse(dataString);

              if (data.type === "conversation_id") {
                setConversationId(data.id);
                // Trigger sidebar refresh to update the new chat title if it was a new chat
                fetch(`/api/conversations?user_id=${userId}`)
                  .then(res => res.json())
                  .then(list => {
                    if (Array.isArray(list)) setConversations(list);
                  });
              } else if (data.type === "token") {
                aiContent += data.content;
                setMessages((prev) => {
                  const newMsgs = [...prev];
                  newMsgs[newMsgs.length - 1].content = aiContent;
                  return newMsgs;
                });
              } else if (data.type === "tool_start") {
                setCurrentTool(data.name);
              } else if (data.type === "tool_end") {
                setCurrentTool(null);
              } else if (data.type === "error") {
                console.error("Agent error:", data.message);
                aiContent += `\n\n⚠️ ${data.message || "An error occurred while processing your request."}`;
                setMessages((prev) => {
                  const newMsgs = [...prev];
                  newMsgs[newMsgs.length - 1].content = aiContent;
                  return newMsgs;
                });
                setCurrentTool(null);
              } else if (data.type === "done") {
                setCurrentTool(null);
              }
            } catch (err) {
              console.error("SSE JSON Parse Error for chunk:", event, err);
            }
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => {
        const newMsgs = [...prev];
        newMsgs[newMsgs.length - 1].content = "⚠️ Sorry, there was an error connecting to the agent.";
        return newMsgs;
      });
    } finally {
      setIsLoading(false);
      setCurrentTool(null);
    }
  };

  const handleKeyDown = (e) => {
    // On mobile, Enter should add a new line. On desktop, Enter sends the message.
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

    if (e.key === "Enter" && !e.shiftKey && !isMobile) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const copyToClipboard = (aiContent, idx) => {
    // Find the immediate previous user message
    let previousUserMessage = "";
    if (idx > 0 && messages[idx - 1].role === "user" || messages[idx - 1].role === "human") {
      previousUserMessage = messages[idx - 1].content;
    }

    const textToCopy = `User Query:\n${previousUserMessage}\n\nAgent Response:\n${aiContent}`;
    navigator.clipboard.writeText(textToCopy);

    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Helper to format raw tool names into human-readable strings
  const formatToolName = (name) => {
    if (!name) return "";
    if (name === "web_search") return "🔍 Searching the web for live data...";
    if (name === "fetch_webpage") return "🌐 Reading webpage content...";
    if (name === "calculator") return "🧮 Performing mathematical calculation...";
    if (name === "get_stock_price") return "📊 Fetching live stock market data...";
    if (name === "send_email_confirmed") return "📧 Sending email via Gmail...";
    if (name === "read_emails") return "📥 Reading inbox via Gmail...";
    if (name === "get_github_repo_stats") return "🐙 Fetching GitHub repository stats...";
    if (name === "get_github_pull_requests") return "🐙 Fetching GitHub PRs...";
    if (name === "get_github_user_profile") return "🐙 Fetching GitHub user profile...";
    if (name === "search_github_repositories") return "🐙 Searching GitHub repositories...";
    if (name === "get_github_latest_commits") return "🐙 Fetching latest GitHub commits...";
    if (name === "get_github_repo_contributors") return "🐙 Fetching GitHub repo contributors...";
    // fallback generic formatting: "my_tool_name" -> "My tool name..."
    const formatted = name.split('_').join(' ');
    return formatted.charAt(0).toUpperCase() + formatted.slice(1) + "...";
  };

  return (
    <div style={{ display: 'flex', width: '100%', height: '100vh', overflow: 'hidden' }}>

      {/* ── MOBILE OVERLAY ── */}
      <div
        className={`sidebar-overlay ${isSidebarOpen ? 'mobile-open' : ''}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* ── DYNAMIC SIDEBAR ── */}
      <aside className={`sidebar ${isSidebarOpen ? 'mobile-open' : ''}`} style={{ display: 'flex', flexDirection: 'column', height: '100dvh', maxHeight: '100dvh', justifyContent: 'space-between', width: '260px', flexShrink: 0, borderRight: '1px solid #222', zIndex: 9999 }}>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

          <div className="branding" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img src="/icon.jpg" alt="Logo" className="branding-logo-img" />
              <div className="branding-text">
                <h1>Ambuj Kumar Tripathi's Workspace</h1>
                <p>Agentic AI • MCP</p>
              </div>
            </div>
            {/* Mobile close button inside sidebar */}
            <button className="menu-btn d-md-none" onClick={() => setIsSidebarOpen(false)} style={{ display: 'none', marginLeft: 'auto' }}>
              <X size={20} />
            </button>
          </div>

          <button onClick={handleNewChat} className="new-chat-btn" style={{ margin: '0 20px 20px', cursor: 'pointer' }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            New Chat
          </button>

          <div style={{ flex: 1, overflowY: 'auto', padding: '0 10px' }}>
            <h3 style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase', marginBottom: '10px', paddingLeft: '10px' }}>Recent Chats</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {Array.isArray(conversations) && conversations.map((conv) => (
                <div key={conv.id} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <button
                    onClick={() => loadChatHistory(conv.id)}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px',
                      paddingRight: '36px', // make room for delete icon
                      background: conversationId === conv.id ? '#1a1f2e' : 'transparent',
                      border: 'none',
                      borderRadius: '8px',
                      color: conversationId === conv.id ? '#58a6ff' : '#c9d1d9',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: 'Outfit',
                      fontSize: '14px',
                      transition: 'all 0.2s',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                    onMouseOver={(e) => { if (conversationId !== conv.id) e.currentTarget.style.background = '#222' }}
                    onMouseOut={(e) => { if (conversationId !== conv.id) e.currentTarget.style.background = 'transparent' }}
                  >
                    <MessageSquare size={16} style={{ flexShrink: 0 }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{conv.title || "New Chat"}</span>
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={(e) => deleteConversation(e, conv.id)}
                    style={{
                      position: 'absolute',
                      right: '8px',
                      background: 'transparent',
                      border: 'none',
                      color: '#666',
                      cursor: 'pointer',
                      padding: '4px',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.color = '#EF4444'; e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)' }}
                    onMouseOut={(e) => { e.currentTarget.style.color = '#666'; e.currentTarget.style.background = 'transparent' }}
                    title="Delete Chat"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Actions */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid #333', paddingBottom: 'calc(20px + env(safe-area-inset-bottom))' }}>
          {session?.user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)' }}>
              {session.user.image ? (
                <img src={session.user.image} alt="Profile" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#58a6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>
                  {session.user.name?.charAt(0) || 'U'}
                </div>
              )}
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#e6edf3', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {session.user.name || 'User'}
                </div>
                <div style={{ fontSize: '12px', color: '#7d8590', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {session.user.email}
                </div>
              </div>
            </div>
          )}
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%',
              background: '#21262d', border: '1px solid #30363d', color: '#c9d1d9',
              cursor: 'pointer', fontFamily: 'Outfit', fontSize: '14px',
              padding: '10px', borderRadius: '8px', transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = '#30363d'; e.currentTarget.style.borderColor = '#8b949e'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = '#21262d'; e.currentTarget.style.borderColor = '#30363d'; }}
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── CHAT INTERFACE ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', width: '100%', overflow: 'hidden' }}>

        {/* MOBILE HEADER (only visible on small screens) */}
        <div className="mobile-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/icon.jpg" alt="Logo" style={{ width: '28px', height: '28px', borderRadius: '8px' }} />
            <span style={{ fontFamily: 'Outfit', fontWeight: '600', fontSize: '14px' }}>Ambuj Kumar Tripathi's Workspace</span>
          </div>
          <button className="menu-btn" onClick={() => setIsSidebarOpen(true)}>
            <Menu size={24} />
          </button>
        </div>

        <div className="chat-container">
          {messages.map((msg, idx) => {
            const draft = msg.role === "ai" ? extractDraft(msg.content) : null;
            const chartsData = msg.role === "ai" ? extractChart(msg.content) : null;
            const displayContent = msg.role === "ai" ? cleanContent(msg.content) : msg.content;
            const displayRole = msg.role === 'human' ? 'user' : msg.role;

            // FIX 1: Don't render empty AI bubbles when loading or running a tool, unless they actually have content
            if (displayRole === 'ai' && !displayContent.trim() && !draft && !chartsData && isLoading && idx === messages.length - 1) {
              return null;
            }

            return (
              <div key={idx} className={`message-wrapper ${displayRole}`} style={{ position: 'relative' }}>
                <div className={`avatar ${displayRole}-avatar`}>
                  {displayRole === "ai" ? <img src="/icon.jpg" alt="AI" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : <User size={20} />}
                </div>
                <div className="message-bubble">
                  {displayRole === "ai" ? (
                    <>
                      <div className="markdown-body">
                        <Markdown
                          options={{
                            overrides: {
                              a: {
                                component: (props) => (
                                  <a {...props} target="_blank" rel="noopener noreferrer" style={{ color: '#58a6ff', textDecoration: 'underline' }} />
                                ),
                              },
                            },
                          }}
                        >
                          {displayContent}
                        </Markdown>
                      </div>
                      {draft && (
                        <div className="gmail-draft-card">
                          <div className="gmail-draft-header">
                            <div><span className="label">To:</span> {draft.to}</div>
                            {draft.cc && <div><span className="label">CC:</span> {draft.cc}</div>}
                            <div><span className="label">Subject:</span> {draft.subject}</div>
                          </div>
                          <div className="gmail-draft-body">
                            {draft.body.split('\n').map((line, i) => <p key={i} style={{ margin: '4px 0' }}>{line}</p>)}
                          </div>
                          <div className="gmail-draft-actions">
                            <button className="btn-cancel" onClick={cancelEmail} disabled={isLoading}>
                              Cancel
                            </button>
                            <button className="btn-send-gmail" onClick={() => confirmSendEmail(draft)} disabled={isLoading}>
                              <img src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg" alt="Gmail" className="gmail-icon" />
                              Send via Gmail
                            </button>
                          </div>
                        </div>
                      )}

                      {chartsData && chartsData.map((chart, i) => (
                        <GenerativeChart key={i} config={chart} />
                      ))}

                      {/* Copy Button for AI Messages */}
                      <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-start' }}>
                        <button
                          onClick={() => copyToClipboard(displayContent, idx)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            background: 'transparent', border: '1px solid #333',
                            color: '#A0A0A0', padding: '4px 10px',
                            borderRadius: '6px', cursor: 'pointer',
                            fontSize: '12px', fontFamily: 'Inter',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseOver={(e) => { e.currentTarget.style.background = '#222'; e.currentTarget.style.color = '#fff'; }}
                          onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#A0A0A0'; }}
                        >
                          {copiedIndex === idx ? (
                            <><Check size={14} color="#10B981" /> Copied!</>
                          ) : (
                            <><Copy size={14} /> Copy Response & Query</>
                          )}
                        </button>
                      </div>
                    </>
                  ) : (
                    displayContent
                  )}
                </div>
              </div>
            )
          })}

          {/* FIX 1: Dedicated Tool Indicator with its own avatar */}
          {currentTool && (
            <div className="message-wrapper ai">
              <div className="avatar ai-avatar">
                <img src="/icon.jpg" alt="AI" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              </div>
              <div className="tool-indicator">
                <Activity size={16} />
                <strong style={{ fontWeight: 500 }}>{formatToolName(currentTool)}</strong>
              </div>
            </div>
          )}

          {/* Dedicated Thinking Indicator */}
          {isLoading && !currentTool && messages.length > 0 && messages[messages.length - 1].role !== 'ai' && (
            <div className="message-wrapper ai">
              <div className="avatar ai-avatar">
                <img src="/icon.jpg" alt="AI" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              </div>
              <div className="tool-indicator" style={{ background: "transparent", border: "none" }}>
                <span className="animate-pulse" style={{ color: '#A0A0A0' }}>Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-area">
          <form className="input-wrapper" onSubmit={handleSubmit}>
            <textarea
              ref={textareaRef}
              className="chat-textarea"
              placeholder="Ask Ambuj Kumar Tripathi's Agent anything..."
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              rows={1}
              disabled={isLoading}
            />
            <button type="submit" className="send-btn" disabled={!input.trim() || isLoading}>
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
