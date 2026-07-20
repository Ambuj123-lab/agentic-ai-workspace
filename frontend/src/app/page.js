"use client";

import Link from 'next/link';
import { Bot, Mail, LineChart, Globe, GitBranch, Shield, Lock, Trash2, Layout, TerminalSquare, ChevronLeft, ChevronRight, X, Menu } from 'lucide-react';
import { FaLinkedin, FaXTwitter, FaGithub } from 'react-icons/fa6';
import { useSession, signIn } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
const FlowNode = ({ icon, title, subtitle, color = "#0EA5E9", variant = "default" }) => {
  const bg = variant === "focus" ? `${color}15` : "rgba(255,255,255,0.02)";
  const border = variant === "focus" ? color : "rgba(255,255,255,0.1)";
  
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '16px', minWidth: '140px', background: bg, border: `1px solid ${border}`,
      borderRadius: '12px', zIndex: 2, position: 'relative',
      boxShadow: variant === "focus" ? `0 0 20px ${color}20` : 'none',
      transition: 'transform 0.2s', cursor: 'default'
    }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
      <div style={{ fontSize: '28px', marginBottom: '8px' }}>{icon}</div>
      <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff', textAlign: 'center' }}>{title}</div>
      {subtitle && <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '4px', textAlign: 'center' }}>{subtitle}</div>}
    </div>
  );
};

const FlowArrow = ({ label, direction = "right", width = "50px" }) => {
  return (
    <div style={{
      display: 'flex', flexDirection: direction === 'down' ? 'column' : 'row',
      alignItems: 'center', justifyContent: 'center',
      width: direction === 'right' ? width : 'auto',
      height: direction === 'down' ? width : 'auto',
      position: 'relative', zIndex: 1
    }}>
      {label && (
        <div style={{ 
          fontSize: '10px', color: '#888', fontWeight: 600, whiteSpace: 'nowrap', position: 'absolute', 
          top: direction === 'right' ? '-18px' : 'auto', 
          left: direction === 'down' ? '12px' : 'auto',
          background: '#0a0a0a', padding: '0 4px'
        }}>
          {label}
        </div>
      )}
      <div style={{
        background: '#333',
        width: direction === 'right' ? '100%' : '2px',
        height: direction === 'down' ? '100%' : '2px',
      }}></div>
      {direction === 'right' && (
        <div style={{ width: 0, height: 0, borderTop: '4px solid transparent', borderBottom: '4px solid transparent', borderLeft: '6px solid #333', position: 'absolute', right: '-2px' }} />
      )}
      {direction === 'down' && (
        <div style={{ width: 0, height: 0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: '6px solid #333', position: 'absolute', bottom: '-2px' }} />
      )}
    </div>
  );
};

const SystemArchitecture = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', width: '100%', maxWidth: '950px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
    
    {/* ── CLIENT LAYER ── */}
    <div style={{ border: '1px solid rgba(14, 165, 233, 0.2)', borderRadius: '16px', padding: '28px', background: 'rgba(14, 165, 233, 0.02)', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '-10px', left: '24px', background: '#0a0a0a', padding: '0 12px', color: '#0EA5E9', fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>🖥️ Client Layer</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center', alignItems: 'center' }}>
        <FlowNode icon="🔐" title="NextAuth.js" subtitle="Google OAuth" color="#0EA5E9" />
        <FlowArrow label="" width="20px" />
        <FlowNode icon="💻" title="Next.js App" subtitle="React Frontend" color="#0EA5E9" variant="focus" />
        <FlowArrow label="" width="20px" />
        <FlowNode icon="💬" title="ChatBox.js" subtitle="Generative UI" color="#0EA5E9" />
      </div>
    </div>

    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <FlowArrow direction="down" label="POST /api/chat (SSE Stream)" width="30px" />
    </div>

    {/* ── SERVER + PERSISTENCE (side by side) ── */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px' }}>
      {/* Server Layer */}
      <div style={{ border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '16px', padding: '28px', background: 'rgba(16, 185, 129, 0.02)', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '-10px', left: '24px', background: '#0a0a0a', padding: '0 12px', color: '#10B981', fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>⚙️ Server Layer</div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <FlowNode icon="⚡" title="FastAPI" subtitle="app/main.py" color="#10B981" variant="focus" />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
            <FlowNode icon="🛡️" title="Rate Limiter" subtitle="SlowAPI + Circuit Breaker" color="#10B981" />
            <FlowNode icon="📡" title="Chat API" subtitle="app/api/chat.py" color="#10B981" />
          </div>
        </div>
      </div>

      {/* Persistence Layer */}
      <div style={{ border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '16px', padding: '28px', background: 'rgba(245, 158, 11, 0.02)', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '-10px', left: '24px', background: '#0a0a0a', padding: '0 12px', color: '#F59E0B', fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>🗄️ Persistence Layer</div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <FlowNode icon="🍃" title="MongoDB Atlas" subtitle="Conversation Store" color="#F59E0B" variant="focus" />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
            <FlowNode icon="⏱️" title="30-Day TTL" subtitle="Auto Cleanup Index" color="#F59E0B" />
            <FlowNode icon="🔄" title="Sliding Window" subtitle="Last 10 Messages" color="#F59E0B" />
          </div>
        </div>
      </div>
    </div>

    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <FlowArrow direction="down" label="Initialize LangGraph Agent" width="30px" />
    </div>

    {/* ── AGENTIC CORE ── */}
    <div style={{ border: '1px solid rgba(168, 85, 247, 0.2)', borderRadius: '16px', padding: '28px', background: 'rgba(168, 85, 247, 0.02)', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '-10px', left: '24px', background: '#0a0a0a', padding: '0 12px', color: '#A855F7', fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>🧠 Agentic Core (LangGraph)</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', alignItems: 'center' }}>
        <FlowNode icon="🔄" title="State Graph" subtitle="app/agent/graph.py" color="#A855F7" variant="focus" />
        <FlowArrow label="Reason" width="30px" />
        <FlowNode icon="✨" title="LLM Node" subtitle="Gemini / OpenRouter" color="#A855F7" />
        <FlowArrow label="tool_calls?" width="40px" />
        <FlowNode icon="🛠️" title="Action Node" subtitle="ToolNode Executor" color="#A855F7" />
      </div>
      <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '11px', color: '#9CA3AF', fontStyle: 'italic' }}>
        ReAct Loop: Agent → LLM → Tool → Agent → ... → END
      </div>
    </div>

    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <FlowArrow direction="down" label="Invokes Tools" width="30px" />
    </div>

    {/* ── TOOL REGISTRY ── */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px' }}>
      {/* Built-in Tools */}
      <div style={{ border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: '16px', padding: '28px', background: 'rgba(99, 102, 241, 0.02)', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '-10px', left: '24px', background: '#0a0a0a', padding: '0 12px', color: '#6366F1', fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>🔧 Built-in Tools</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <FlowNode icon="🔍" title="Web Search" subtitle="Tavily API" color="#6366F1" />
          <FlowNode icon="📈" title="Stock Price" subtitle="RapidAPI / Yahoo" color="#6366F1" />
          <FlowNode icon="🐙" title="GitHub Suite" subtitle="6 REST API Tools" color="#6366F1" variant="focus" />
          <FlowNode icon="📧" title="Gmail" subtitle="SMTP + IMAP" color="#6366F1" />
          <FlowNode icon="🌐" title="Webpage Reader" subtitle="httpx Scraper" color="#6366F1" />
          <FlowNode icon="🧮" title="Calculator" subtitle="Math Evaluator" color="#6366F1" />
        </div>
      </div>

      {/* MCP Layer */}
      <div style={{ border: '1px solid rgba(236, 72, 153, 0.2)', borderRadius: '16px', padding: '28px', background: 'rgba(236, 72, 153, 0.02)', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '-10px', left: '24px', background: '#0a0a0a', padding: '0 12px', color: '#EC4899', fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>🔌 MCP Integration</div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <FlowNode icon="🔌" title="MCP Client" subtitle="app/mcp/client.py" color="#EC4899" variant="focus" />
          <FlowArrow direction="down" label="SSE Transport" width="20px" />
          <FlowNode icon="🌐" title="External MCP Servers" subtitle="Dynamic Tool Discovery" color="#EC4899" />
          <div style={{ textAlign: 'center', fontSize: '11px', color: '#9CA3AF', marginTop: '8px', lineHeight: 1.6 }}>
            Auto-discovers tools via SSE →<br/>
            Wraps as LangChain StructuredTool →<br/>
            Available to agent without code changes
          </div>
        </div>
      </div>
    </div>

    {/* Bottom Legend */}
    <div style={{ textAlign: 'center', fontSize: '11px', color: '#6b7280', marginTop: '8px', lineHeight: 1.8 }}>
      Client (Next.js) → FastAPI → LangGraph ReAct Agent → Built-in Tools / MCP → MongoDB Atlas (30-day TTL)
    </div>
  </div>
);

export default function LandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [uptimeData, setUptimeData] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/chat");
    }
    
    const fetchUptime = async () => {
      try {
        const response = await fetch('/api/uptime');
        const data = await response.json();
        if (data && data.uptime) {
          setUptimeData(data);
        }
      } catch (error) {
        console.error("Failed to fetch uptime:", error);
      }
    };
    fetchUptime();
    const intervalId = setInterval(fetchUptime, 60000); // refresh every minute
    return () => clearInterval(intervalId);
  }, [status, router]);

  if (status === "authenticated") {
    return null; 
  }

  const howItWorksSlides = [
    {
      title: "1. The Agentic Workflow",
      desc: "Users interact via Next.js. FastAPI backend orchestrates LangGraph agents. Agents discover and use MCP tools automatically.",
      content: (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'nowrap', padding: '40px 0' }}>
          <FlowNode icon="👤" title="User" color="#9CA3AF" />
          <FlowArrow label="Chat" width="30px" />
          <FlowNode icon="💻" title="Next.js" color="#0EA5E9" />
          <FlowArrow label="REST API" width="40px" />
          <FlowNode icon="⚡" title="FastAPI" color="#10B981" />
          <FlowArrow label="Invokes" width="40px" />
          <FlowNode icon="🧠" title="LangGraph" color="#A855F7" variant="focus" subtitle="ReAct Loop" />
          <FlowArrow label="Executes" width="40px" />
          <FlowNode icon="🔌" title="MCP Tools" color="#6366F1" />
        </div>
      )
    },
    {
      title: "2. Tool Discovery",
      desc: "The LangGraph agent queries connected MCP servers dynamically to discover available tools (e.g., GitHub API) without hardcoded schemas.",
      content: (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '40px 0', flexWrap: 'nowrap' }}>
          <FlowNode icon="🧠" title="Agent" color="#A855F7" subtitle="Needs capability" />
          <FlowArrow label="List Tools" width="50px" />
          <FlowNode icon="🔌" title="MCP Client" color="#0EA5E9" />
          <FlowArrow label="Query" width="50px" />
          <FlowNode icon="🐙" title="GitHub Server" color="#F59E0B" />
          <FlowArrow label="Returns Schemas" width="70px" />
          <FlowNode icon="📋" title="System Prompt" color="#10B981" variant="focus" subtitle="Injected Tool Context" />
        </div>
      )
    },
    {
      title: "3. Tool Execution",
      desc: "The LLM decides to use a discovered tool. The MCP client routes the request, executes it, and returns the result for the agent to synthesize.",
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', alignItems: 'center', padding: '20px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'nowrap' }}>
            <FlowNode icon="🤖" title="LLM Decision" color="#A855F7" subtitle="Use get_repos()" />
            <FlowArrow label="CallToolRequest" width="60px" />
            <FlowNode icon="🔌" title="MCP Client" color="#0EA5E9" />
            <FlowArrow label="Execute" width="50px" />
            <FlowNode icon="🐙" title="GitHub API" color="#F59E0B" variant="focus" subtitle="External Call" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', opacity: 0.9, flexWrap: 'nowrap' }}>
            <FlowNode icon="🐙" title="GitHub API" color="#F59E0B" />
            <FlowArrow label="ToolResult (JSON)" width="60px" />
            <FlowNode icon="🧠" title="Agent" color="#A855F7" />
            <FlowArrow label="Synthesize" width="50px" />
            <FlowNode icon="💬" title="Final Answer" color="#10B981" variant="focus" subtitle="Markdown to UI" />
          </div>
        </div>
      )
    },
    {
      title: "4. Human-in-the-Loop",
      desc: "For sensitive actions like sending emails, the agent drafts a response and waits for explicit user approval before executing.",
      content: (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'nowrap', padding: '40px 0' }}>
          <FlowNode icon="🧠" title="Agent" subtitle="Task: Send Email" color="#A855F7" />
          <FlowArrow label="Drafts" width="40px" />
          <FlowNode icon="📝" title="Email Draft" color="#6366F1" />
          <FlowArrow label="Pauses for" width="50px" />
          <FlowNode icon="🛡️" title="User Review" color="#F59E0B" variant="focus" subtitle="Explicit Approval" />
          <FlowArrow label="Approves" width="50px" />
          <FlowNode icon="✉️" title="SMTP Delivery" color="#10B981" variant="focus" />
        </div>
      )
    },
    {
      title: "5. Conversation Lifecycle",
      desc: "Complete flow of memory management: Load context from DB, run LangGraph loop, save updated context, and apply 30-Day TTL retention.",
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', alignItems: 'center', padding: '20px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'nowrap' }}>
            <FlowNode icon="👤" title="User" color="#9CA3AF" />
            <FlowArrow label="" width="20px" />
            <FlowNode icon="⚡" title="FastAPI" color="#10B981" />
            <FlowArrow label="Load Memory" width="60px" />
            <FlowNode icon="🍃" title="MongoDB" color="#F59E0B" variant="focus" />
            <FlowArrow label="" width="20px" />
            <FlowNode icon="🧠" title="LangGraph" color="#A855F7" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'nowrap' }}>
            <FlowNode icon="🧠" title="LangGraph" color="#A855F7" />
            <FlowArrow label="Save Updated Memory" width="100px" />
            <FlowNode icon="🗄️" title="MongoDB" color="#F59E0B" />
            <FlowArrow label="Retention" width="50px" />
            <FlowNode icon="⏱️" title="30-Day TTL" color="#EF4444" variant="focus" />
          </div>
        </div>
      )
    }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', overflowX: 'hidden' }}>
      {/* ===== STATUS BADGE ANIMATIONS ===== */}
      <style>{`
        @keyframes sonar-ping { 0% { transform: scale(1); opacity: 0.8; } 70% { transform: scale(3.5); opacity: 0; } 100% { transform: scale(3.5); opacity: 0; } }
        @keyframes ecg-draw { 0% { stroke-dashoffset: 60; } 100% { stroke-dashoffset: -60; } }
        @keyframes red-heartbeat-glow {
          0%   { box-shadow: 0 0 0px rgba(185, 28, 28, 0); border-color: rgba(255, 255, 255, 0.1); }
          30%  { box-shadow: 0 0 0px rgba(185, 28, 28, 0); border-color: rgba(255, 255, 255, 0.1); }
          40%  { box-shadow: 0 0 25px rgba(185, 28, 28, 0.8), inset 0 0 8px rgba(153, 27, 27, 0.4); border-color: rgba(185, 28, 28, 0.9); }
          45%  { box-shadow: 0 0 8px rgba(185, 28, 28, 0.3); border-color: rgba(185, 28, 28, 0.4); }
          55%  { box-shadow: 0 0 40px rgba(153, 27, 27, 1), inset 0 0 15px rgba(153, 27, 27, 0.8); border-color: #dc2626; }
          70%  { box-shadow: 0 0 0px rgba(185, 28, 28, 0); border-color: rgba(255, 255, 255, 0.1); }
          100% { box-shadow: 0 0 0px rgba(185, 28, 28, 0); border-color: rgba(255, 255, 255, 0.1); }
        }
        .afp-status-badge {
          display: inline-flex; align-items: center; gap: 6px;
          margin-left: 12px; padding: 4px 12px;
          background: #000000;
          animation: red-heartbeat-glow 4s ease-in-out infinite;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px; text-decoration: none; color: #ffffff;
          font-size: 10px; font-weight: 600; letter-spacing: 0.04em;
          cursor: pointer; white-space: nowrap;
          transition: border-color 0.3s;
        }
      `}</style>

      {/* ===== TOP STATUS BANNER ===== */}
      <div style={{ background: 'rgba(212,165,116,0.08)', borderBottom: '1px solid rgba(212,165,116,0.15)', padding: '8px 16px', textAlign: 'center', fontSize: '11px', fontWeight: 500, color: '#d4a574', letterSpacing: '0.02em', position: 'relative', zIndex: 100, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '6px' }}>
        <span>⚠️</span>
        <span><strong>Disclaimer:</strong> Experimental Agentic Workspace by Ambuj Kumar Tripathi. Open for constructive feedback.</span>
        <a href="https://stats.uptimerobot.com/4tYmSQnuBE" target="_blank" rel="noreferrer" className="afp-status-badge">
          <span style={{ position: 'relative', width: '8px', height: '8px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ position: 'absolute', width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.4)', animation: 'sonar-ping 2s ease-out infinite' }} />
            <span style={{ position: 'relative', width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px rgba(16, 185, 129, 0.6)' }} />
          </span>
          <svg width="28" height="12" viewBox="0 0 28 12" style={{ overflow: 'visible', marginLeft: '-2px' }}>
            <path d="M0,6 L6,6 L8,2 L10,10 L12,4 L14,8 L16,6 L28,6" fill="none" stroke="#10b981" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ strokeDasharray: '30', strokeDashoffset: '0', animation: 'ecg-draw 2s linear infinite' }} />
          </svg>
          {uptimeData ? `${uptimeData.uptime} • ${uptimeData.latency}` : 'System Status'}
        </a>
      </div>

      {/* ===== NAVBAR ===== */}
      <style>{`
        .desktop-nav { display: flex; align-items: center; gap: 24px; }
        .mobile-menu-btn { display: none; background: transparent; border: none; color: white; cursor: pointer; }
        .mobile-dropdown { display: none; flex-direction: column; gap: 16px; padding: 16px 20px; background: #0a0a0a; border-bottom: 1px solid rgba(255,255,255,0.05); }
        @media (max-width: 768px) {
          .desktop-nav { display: none; }
          .mobile-menu-btn { display: flex; }
          .nav-container { padding: 12px 20px !important; }
        }
      `}</style>
      <nav className="nav-container" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 40px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(10, 10, 10, 0.8)',
        backdropFilter: 'blur(12px)',
        position: 'sticky', top: 0, zIndex: 9999,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/icon.jpg" alt="Logo" style={{ width: '32px', borderRadius: '8px' }} />
          <span style={{ fontWeight: 700, fontFamily: 'Outfit', fontSize: '1.05rem', letterSpacing: '-0.3px' }}>
            Ambuj's Workspace
          </span>
        </div>
        
        <div className="desktop-nav">
          <Link href="#workspace" className="nav-link">Home</Link>
          <button onClick={() => setIsHowItWorksOpen(true)} className="nav-link" style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 'inherit', padding: 0, fontFamily: 'inherit', color: 'inherit' }}>How it works</button>
          <Link href="#architecture" className="nav-link">Architecture</Link>
          <Link href="#capabilities" className="nav-link">Capabilities</Link>
        </div>

        <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>
      {isMobileMenuOpen && (
        <div className="mobile-dropdown" style={{ display: 'flex', position: 'sticky', top: '65px', zIndex: 9998 }}>
          <Link href="#workspace" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <button onClick={() => { setIsHowItWorksOpen(true); setIsMobileMenuOpen(false); }} className="nav-link" style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 'inherit', padding: 0, fontFamily: 'inherit', color: 'inherit', textAlign: 'left' }}>How it works</button>
          <Link href="#architecture" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Architecture</Link>
          <Link href="#capabilities" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Capabilities</Link>
        </div>
      )}

      <main>
        {/* ── HERO SECTION ── */}
        <section id="workspace" style={{ padding: '120px 24px', textAlign: 'center', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at top, #111 0%, #0a0a0a 60%)' }}>
          <h1 className="landing-title" style={{ maxWidth: '900px', fontSize: '4rem', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: '24px', lineHeight: 1.1, background: 'linear-gradient(135deg, #FFFFFF 0%, #A0A0A0 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Production-grade Agentic AI Workspace
          </h1>
          <p className="landing-subtitle" style={{ maxWidth: '800px', fontSize: '1.1rem', color: '#8b949e', lineHeight: 1.6, marginBottom: '40px' }}>
            Built with <strong>LangGraph</strong>, <strong>Model Context Protocol (MCP)</strong>, Human-in-the-Loop workflows, and secure tool orchestration to interact with external systems through natural language.
          </p>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', maxWidth: '800px', marginBottom: '40px' }}>
            {['LangGraph', 'Gemini', 'FastAPI', 'MongoDB Atlas', 'MCP', 'Next.js', 'OAuth', 'GitHub API', 'RapidAPI', 'Tavily'].map(tech => (
              <span key={tech} style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#c9d1d9', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 500 }}>
                {tech}
              </span>
            ))}
          </div>

          <button onClick={() => signIn('google')} style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', fontWeight: 500, fontSize: '0.95rem', padding: '12px 28px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.2s', backdropFilter: 'blur(8px)' }} onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; }} onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}>
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
            </svg>
            Sign in with Google
          </button>
          
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '24px', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#888', fontSize: '12px' }}><Lock size={14} /> Authentication secured with OAuth</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#888', fontSize: '12px' }}><Shield size={14} /> Conversation history encrypted</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#888', fontSize: '12px' }}><Trash2 size={14} /> 30-day automatic cleanup</span>
          </div>
        </section>

        {/* ── CAPABILITIES ── */}
        <section id="capabilities" style={{ padding: '80px 20px', background: '#0a0a0a', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 700, textAlign: 'center', marginBottom: '60px', color: '#fff' }}>Core Capabilities</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', maxWidth: '1000px', margin: '0 auto' }}>
            
            <div className="feature-card">
              <TerminalSquare size={32} style={{ color: '#a855f7', marginBottom: '20px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '10px' }}>🧠 Agentic Reasoning</h3>
              <p style={{ color: '#888', fontSize: '14px', lineHeight: 1.6 }}>Plans actions, selects tools, evaluates results and synthesizes responses using LangGraph ReAct.</p>
            </div>

            <div className="feature-card">
              <Layout size={32} style={{ color: '#f59e0b', marginBottom: '20px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '10px' }}>🔌 Dynamic MCP Tools</h3>
              <p style={{ color: '#888', fontSize: '14px', lineHeight: 1.6 }}>Discover and invoke external tools from connected MCP servers without modifying application code.</p>
            </div>

            <div className="feature-card">
              <GitBranch size={32} style={{ color: '#E2E8F0', marginBottom: '20px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '10px' }}>GitHub Integration</h3>
              <p style={{ color: '#888', fontSize: '14px', lineHeight: 1.6 }}>Fetch repository stats, analyze pull requests, and browse commit histories securely.</p>
            </div>
            
            <div className="feature-card">
              <Mail size={32} style={{ color: '#EF4444', marginBottom: '20px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '10px' }}>Smart Email Automation</h3>
              <p style={{ color: '#888', fontSize: '14px', lineHeight: 1.6 }}>Read unseen emails and securely draft responses with explicit user approval.</p>
            </div>
            
            <div className="feature-card">
              <LineChart size={32} style={{ color: '#10B981', marginBottom: '20px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '10px' }}>Live Stock Data</h3>
              <p style={{ color: '#888', fontSize: '14px', lineHeight: 1.6 }}>Fetch real-time stock prices and financial insights through RapidAPI integrations.</p>
            </div>
            
            <div className="feature-card">
              <Globe size={32} style={{ color: '#0EA5E9', marginBottom: '20px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '10px' }}>Web Search & Scraping</h3>
              <p style={{ color: '#888', fontSize: '14px', lineHeight: 1.6 }}>Browse the web autonomously to find factual, up-to-date information instantly.</p>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS MODAL ── */}
        {isHowItWorksOpen && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 10000, background: '#0a0a0a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', overflowY: 'auto' }}>
            <button onClick={() => setIsHowItWorksOpen(false)} style={{ position: 'absolute', top: '24px', right: '32px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer', zIndex: 10001, transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background='rgba(255,255,255,0.2)'} onMouseOut={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'}>
              <X size={28} />
            </button>
            
            <h2 style={{ fontSize: '32px', fontWeight: 700, textAlign: 'center', marginBottom: '40px', color: '#fff' }}>How It Works</h2>
            
            <div style={{ width: '100%', maxWidth: '1000px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
              {/* Header / Title */}
              <div style={{ padding: '24px 32px', borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.4)' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#fff', marginBottom: '8px' }}>{howItWorksSlides[activeSlide].title}</h3>
                <p style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: 1.6 }}>{howItWorksSlides[activeSlide].desc}</p>
              </div>
              
              {/* Carousel Content */}
              <div style={{ position: 'relative', padding: '40px', minHeight: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a' }}>
                
                {/* Prev Button */}
                <button 
                  onClick={() => setActiveSlide(s => Math.max(0, s - 1))}
                  disabled={activeSlide === 0}
                  style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: activeSlide === 0 ? 'not-allowed' : 'pointer', opacity: activeSlide === 0 ? 0.3 : 1, transition: 'background 0.2s', zIndex: 10 }}
                  onMouseOver={e => { if(activeSlide !== 0) e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}}
                  onMouseOut={e => { if(activeSlide !== 0) e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}}
                >
                  <ChevronLeft size={24} />
                </button>

                {/* Diagram */}
                <div style={{ width: '100%', maxWidth: '850px', display: 'flex', justifyContent: 'flex-start', overflowX: 'auto', paddingBottom: '20px' }}>
                  <div style={{ minWidth: 'min-content', margin: '0 auto', display: 'flex', justifyContent: 'center' }}>
                    {howItWorksSlides[activeSlide].content}
                  </div>
                </div>
                
                {/* Next Button */}
                <button 
                  onClick={() => setActiveSlide(s => Math.min(howItWorksSlides.length - 1, s + 1))}
                  disabled={activeSlide === howItWorksSlides.length - 1}
                  style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: activeSlide === howItWorksSlides.length - 1 ? 'not-allowed' : 'pointer', opacity: activeSlide === howItWorksSlides.length - 1 ? 0.3 : 1, transition: 'background 0.2s', zIndex: 10 }}
                  onMouseOver={e => { if(activeSlide !== howItWorksSlides.length - 1) e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}}
                  onMouseOut={e => { if(activeSlide !== howItWorksSlides.length - 1) e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}}
                >
                  <ChevronRight size={24} />
                </button>
              </div>
              
              {/* Dots / Footer */}
              <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.4)', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ color: '#6B7280', fontSize: '13px' }}>Slide {activeSlide + 1} of {howItWorksSlides.length}</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {howItWorksSlides.map((_, i) => (
                    <button 
                      key={i} 
                      onClick={() => setActiveSlide(i)}
                      style={{ width: '8px', height: '8px', borderRadius: '50%', background: i === activeSlide ? '#0EA5E9' : 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer', padding: 0, transition: 'background 0.3s' }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── ARCHITECTURE ── */}
        <section id="architecture" style={{ padding: '80px 20px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 700, textAlign: 'center', marginBottom: '60px', color: '#fff' }}>System Architecture</h2>
          <div style={{ background: 'rgba(10,10,10,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '40px 24px', maxWidth: '1000px', margin: '0 auto', overflowX: 'auto', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
            <SystemArchitecture />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '12px', marginTop: '40px' }}>
            <span style={{ background: 'rgba(88, 166, 255, 0.1)', border: '1px solid rgba(88, 166, 255, 0.2)', color: '#58a6ff', padding: '8px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 600 }}>Client</span>
            <span style={{ color: '#666' }}>➔</span>
            <span style={{ background: 'rgba(88, 166, 255, 0.1)', border: '1px solid rgba(88, 166, 255, 0.2)', color: '#58a6ff', padding: '8px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 600 }}>API</span>
            <span style={{ color: '#666' }}>➔</span>
            <span style={{ background: 'rgba(88, 166, 255, 0.1)', border: '1px solid rgba(88, 166, 255, 0.2)', color: '#58a6ff', padding: '8px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 600 }}>LangGraph</span>
            <span style={{ color: '#666' }}>➔</span>
            <span style={{ background: 'rgba(88, 166, 255, 0.1)', border: '1px solid rgba(88, 166, 255, 0.2)', color: '#58a6ff', padding: '8px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 600 }}>MCP & Tools</span>
          </div>
        </section>

      </main>

      {/* ══════════════════ FAT FOOTER ══════════════════ */}
      <style>{`
        .fat-footer { padding: 5rem 4rem 3rem 4rem; }
        @media (max-width: 768px) {
          .fat-footer { padding: 3rem 1.5rem 2rem 1.5rem; }
        }
      `}</style>
      <footer id="about" className="fat-footer" style={{ background: '#030303', borderTop: '1px solid rgba(255, 255, 255, 0.05)', color: '#9CA3AF', fontSize: '0.9rem' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: '3rem' }}>
          
          {/* Left Column: Logo & Copyright */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '300px', flex: 1.5, minWidth: '250px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
                <img src="/icon.jpg" alt="Logo" style={{ height: '40px', borderRadius: '8px' }} />
                <span style={{ fontWeight: 700, fontSize: '1.4rem', color: '#fff', letterSpacing: '-0.5px' }}>Ambuj Kumar Tripathi's <span style={{ color: '#0EA5E9' }}>Workspace</span></span>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <a href="https://www.linkedin.com/in/ambuj-tripathi-042b4a118/" target="_blank" rel="noreferrer" style={{ color: '#a1a1aa', transition: 'color 0.2s' }} onMouseOver={e=>e.currentTarget.style.color='#fff'} onMouseOut={e=>e.currentTarget.style.color='#a1a1aa'}><FaLinkedin size={22} /></a>
                <a href="https://x.com/Ambuj_KTripathi" target="_blank" rel="noreferrer" style={{ color: '#a1a1aa', transition: 'color 0.2s' }} onMouseOver={e=>e.currentTarget.style.color='#fff'} onMouseOut={e=>e.currentTarget.style.color='#a1a1aa'}><FaXTwitter size={22} /></a>
                <a href="https://github.com/Ambuj123-lab" target="_blank" rel="noreferrer" style={{ color: '#a1a1aa', transition: 'color 0.2s' }} onMouseOver={e=>e.currentTarget.style.color='#fff'} onMouseOut={e=>e.currentTarget.style.color='#a1a1aa'}><FaGithub size={22} /></a>
              </div>

              {/* QR Code Section */}
              <div style={{ marginTop: '2.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px', display: 'inline-block', maxWidth: '100%', transition: 'border-color 0.3s' }} onMouseOver={(e) => e.currentTarget.style.borderColor='rgba(14,165,233,0.4)'} onMouseOut={(e) => e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'}>
                <h4 style={{ fontSize: '0.85rem', color: '#fff', marginBottom: '12px', fontWeight: 600, letterSpacing: '0.5px' }}>Connect with the Architect</h4>
                <a href="https://ambuj-ai-portfolio.vercel.app" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none' }}>
                  <img src="/qr-code.png" alt="Portfolio QR Code" style={{ width: '70px', height: '70px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: '#fff', padding: '2px' }} />
                  <div style={{ fontSize: '0.75rem', color: '#9CA3AF', lineHeight: '1.6' }}>
                    Scan or click to view my <br/>
                    <strong style={{ color: '#0EA5E9' }}>AI Micro-Portfolio</strong> & Resume.
                  </div>
                </a>
              </div>
            </div>

            <div style={{ marginTop: 'auto' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '1rem', fontSize: '0.8rem', color: '#6b7280' }}>
                <span style={{ color: '#9CA3AF' }}>Version: <span style={{ color: '#fff' }}>v2.0 Beta</span></span>
                <span style={{ color: '#9CA3AF' }}>Deployment: <span style={{ color: '#fff' }}>Vercel / Local MCP</span></span>
                <span style={{ color: '#9CA3AF' }}>API Uptime: <a href="https://stats.uptimerobot.com/4tYmSQnuBE" target="_blank" rel="noreferrer" style={{ color: '#10B981', textDecoration: 'none' }} onMouseOver={e=>e.currentTarget.style.textDecoration='underline'} onMouseOut={e=>e.currentTarget.style.textDecoration='none'}>{uptimeData ? `${uptimeData.uptime} • ${uptimeData.latency}` : '--%'}</a></span>
              </div>
              <p style={{ marginBottom: '1rem', fontSize: '0.85rem', color: '#9CA3AF' }}>Built and designed by <strong style={{color: '#fff', fontWeight: 500}}>Ambuj Kumar Tripathi</strong> &copy; {new Date().getFullYear()}</p>
            </div>
          </div>

          {/* Columns Container */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '2rem', flex: 3 }}>
            {/* Column 1 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h4 style={{ color: '#fff', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.95rem' }}>Platform</h4>
              <a href="#capabilities" style={{ color: 'inherit', textDecoration: 'none' }} onMouseOver={e=>e.currentTarget.style.color='#fff'} onMouseOut={e=>e.currentTarget.style.color='#9CA3AF'}>Agentic Reasoning</a>
              <a href="#capabilities" style={{ color: 'inherit', textDecoration: 'none' }} onMouseOver={e=>e.currentTarget.style.color='#fff'} onMouseOut={e=>e.currentTarget.style.color='#9CA3AF'}>MCP Integrations</a>
              <a href="#capabilities" style={{ color: 'inherit', textDecoration: 'none' }} onMouseOver={e=>e.currentTarget.style.color='#fff'} onMouseOut={e=>e.currentTarget.style.color='#9CA3AF'}>Tool Orchestration</a>
            </div>

            {/* Column 2 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h4 style={{ color: '#fff', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.95rem' }}>Solutions</h4>
              <a href="#projects" style={{ color: 'inherit', textDecoration: 'none' }} onMouseOver={e=>e.currentTarget.style.color='#fff'} onMouseOut={e=>e.currentTarget.style.color='#9CA3AF'}>GitHub Automation</a>
              <a href="#projects" style={{ color: 'inherit', textDecoration: 'none' }} onMouseOver={e=>e.currentTarget.style.color='#fff'} onMouseOut={e=>e.currentTarget.style.color='#9CA3AF'}>Email Client</a>
              <a href="#projects" style={{ color: 'inherit', textDecoration: 'none' }} onMouseOver={e=>e.currentTarget.style.color='#fff'} onMouseOut={e=>e.currentTarget.style.color='#9CA3AF'}>Stock Analysis</a>
            </div>
            
            {/* Column 3 - Ecosystem */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h4 style={{ color: '#fff', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.95rem' }}>Ecosystem</h4>
              <a href="https://agentic-rag-financial-parser.onrender.com/" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }} onMouseOver={e=>e.currentTarget.style.color='#fff'} onMouseOut={e=>e.currentTarget.style.color='#9CA3AF'}>Financial Parser</a>
              <a href="https://indian-legal-ai-expert.onrender.com/" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }} onMouseOver={e=>e.currentTarget.style.color='#fff'} onMouseOut={e=>e.currentTarget.style.color='#9CA3AF'}>Indian Legal AI Expert</a>
              <a href="https://citizen-safety-ai-assistant.vercel.app" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }} onMouseOver={e=>e.currentTarget.style.color='#fff'} onMouseOut={e=>e.currentTarget.style.color='#9CA3AF'}>Citizen Safety AI Assistant</a>
              <a href="https://ambuj-ai-portfolio.vercel.app" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }} onMouseOver={e=>e.currentTarget.style.color='#fff'} onMouseOut={e=>e.currentTarget.style.color='#9CA3AF'}>AI Portfolio Hub</a>
            </div>

            {/* Column 4 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h4 style={{ color: '#fff', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.95rem' }}>Resources</h4>
              <a href="https://github.com/Ambuj123-lab" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }} onMouseOver={e=>e.currentTarget.style.color='#fff'} onMouseOut={e=>e.currentTarget.style.color='#9CA3AF'}>GitHub</a>
              <a href="https://ambuj-rag-docs.netlify.app/" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }} onMouseOver={e=>e.currentTarget.style.color='#fff'} onMouseOut={e=>e.currentTarget.style.color='#9CA3AF'}>Documentation</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
