"use client";

import Link from 'next/link';
import Loading from './loading';
import { Bot, Mail, LineChart, Globe, GitBranch, Shield, Lock, Trash2, Layout, TerminalSquare, ChevronLeft, ChevronRight, X, Menu, ArrowUp, Activity, CheckCircle2, Sparkles, Cpu, User, Database, Zap, Layers, Server, ShieldCheck } from 'lucide-react';
import { FaLinkedin, FaXTwitter, FaGithub } from 'react-icons/fa6';
import { useSession, signIn } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
const FlowNode = ({ icon, title, subtitle, color = "#0EA5E9", variant = "default" }) => {
  const bg = variant === "focus" ? `${color}18` : "rgba(255,255,255,0.03)";
  const border = variant === "focus" ? color : "rgba(255,255,255,0.12)";
  
  return (
    <div 
      className="flow-node-box"
      style={{
        background: bg,
        borderColor: border,
        boxShadow: variant === "focus" ? `0 0 20px ${color}35` : 'none',
      }}
    >
      <div style={{ fontSize: '24px', marginBottom: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
      <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff', textAlign: 'center', whiteSpace: 'nowrap' }}>{title}</div>
      {subtitle && <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '3px', textAlign: 'center', whiteSpace: 'nowrap' }}>{subtitle}</div>}
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
    <div style={{ border: '1px solid rgba(14, 165, 233, 0.25)', borderRadius: '16px', padding: '24px', background: 'rgba(14, 165, 233, 0.02)', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '-10px', left: '24px', background: '#000000', padding: '0 12px', color: '#0EA5E9', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Layers size={13} color="#0EA5E9" /> Client UI & Session Layer
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center', alignItems: 'center' }}>
        <FlowNode icon={<Lock size={22} color="#0EA5E9" />} title="NextAuth.js" subtitle="Google OAuth 2.0" color="#0EA5E9" />
        <FlowArrow label="" width="20px" />
        <FlowNode icon={<Layers size={22} color="#0EA5E9" />} title="Next.js App" subtitle="React 19 / Turbopack" color="#0EA5E9" variant="focus" />
        <FlowArrow label="" width="20px" />
        <FlowNode icon={<TerminalSquare size={22} color="#0EA5E9" />} title="Generative UI" subtitle="SSE Stream Receiver" color="#0EA5E9" />
      </div>
    </div>

    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <FlowArrow direction="down" label="POST /api/chat (SSE Stream)" width="32px" />
    </div>

    {/* ── SERVER + PERSISTENCE (side by side) ── */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '24px' }}>
      {/* Server Layer */}
      <div style={{ border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '16px', padding: '24px', background: 'rgba(16, 185, 129, 0.02)', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '-10px', left: '24px', background: '#000000', padding: '0 12px', color: '#10B981', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Zap size={13} color="#10B981" /> Async Gateway & Defense
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <FlowNode icon={<Zap size={24} color="#10B981" />} title="FastAPI ASGI" subtitle="app/main.py" color="#10B981" variant="focus" />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
            <FlowNode icon={<ShieldCheck size={20} color="#10B981" />} title="SlowAPI Guard" subtitle="Rate Limiter + Breaker" color="#10B981" />
            <FlowNode icon={<Activity size={20} color="#10B981" />} title="Stream Router" subtitle="app/api/chat.py" color="#10B981" />
          </div>
        </div>
      </div>

      {/* Persistence Layer */}
      <div style={{ border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '16px', padding: '24px', background: 'rgba(245, 158, 11, 0.02)', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '-10px', left: '24px', background: '#000000', padding: '0 12px', color: '#F59E0B', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Database size={13} color="#F59E0B" /> Persistence & Retention
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <FlowNode icon={<Database size={24} color="#F59E0B" />} title="MongoDB Atlas" subtitle="Encrypted Thread Store" color="#F59E0B" variant="focus" />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
            <FlowNode icon={<Trash2 size={20} color="#EF4444" />} title="30-Day TTL" subtitle="Auto-Purge Index" color="#EF4444" />
            <FlowNode icon={<CheckCircle2 size={20} color="#F59E0B" />} title="Context Window" subtitle="Last 10 Turns" color="#F59E0B" />
          </div>
        </div>
      </div>
    </div>

    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <FlowArrow direction="down" label="Initialize LangGraph ReAct Cycle" width="32px" />
    </div>

    {/* ── AGENTIC CORE ── */}
    <div style={{ border: '1px solid rgba(168, 85, 247, 0.28)', borderRadius: '16px', padding: '24px', background: 'rgba(168, 85, 247, 0.02)', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '-10px', left: '24px', background: '#000000', padding: '0 12px', color: '#A855F7', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Cpu size={13} color="#A855F7" /> LangGraph ReAct Agentic Core
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', alignItems: 'center' }}>
        <FlowNode icon={<Cpu size={22} color="#A855F7" />} title="State Graph" subtitle="app/agent/graph.py" color="#A855F7" variant="focus" />
        <FlowArrow label="Reasoning" width="32px" />
        <FlowNode icon={<Sparkles size={22} color="#A855F7" />} title="LLM Engine" subtitle="Gemini 2.5 Flash" color="#A855F7" />
        <FlowArrow label="tool_calls?" width="36px" />
        <FlowNode icon={<Bot size={22} color="#A855F7" />} title="ToolNode Dispatch" subtitle="Structured Execution" color="#A855F7" />
      </div>
      <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '11px', color: '#9CA3AF', fontFamily: 'monospace' }}>
        Stateful ReAct Loop: Agent ➔ LLM ➔ Tool Execution ➔ Synthesis ➔ Client Stream
      </div>
    </div>

    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <FlowArrow direction="down" label="Invokes FastMCP & Sandboxed Tools" width="32px" />
    </div>

    {/* ── FASTMCP TOOLS & M8VEN GOVERNANCE LAYER ── */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '24px' }}>
      {/* 20 Production Tools with AST Sandbox */}
      <div style={{ border: '1px solid rgba(99, 102, 241, 0.28)', borderRadius: '16px', padding: '24px', background: 'rgba(99, 102, 241, 0.02)', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '-10px', left: '24px', background: '#000000', padding: '0 12px', color: '#818cf8', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Bot size={13} color="#818cf8" /> 20 FastMCP Live Tools
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <FlowNode icon={<Globe size={18} color="#818cf8" />} title="Tavily Search" subtitle="Web Fact Finding" color="#818cf8" />
          <FlowNode icon={<LineChart size={18} color="#818cf8" />} title="Stock Telemetry" subtitle="RapidAPI / Yahoo" color="#818cf8" />
          <FlowNode icon={<GitBranch size={18} color="#818cf8" />} title="GitHub Suite" subtitle="6 REST Endpoints" color="#818cf8" variant="focus" />
          <FlowNode icon={<Mail size={18} color="#818cf8" />} title="Gmail Flow" subtitle="SMTP + IMAP Draft" color="#818cf8" />
          <FlowNode icon={<TerminalSquare size={18} color="#818cf8" />} title="Web Scraper" subtitle="Async httpx" color="#818cf8" />
          <FlowNode icon={<ShieldCheck size={18} color="#10B981" />} title="AST Math Sandbox" subtitle="Python AST (Zero eval)" color="#10B981" variant="focus" />
        </div>
      </div>

      {/* M8ven Trust Governance Layer */}
      <div style={{ border: '1px solid rgba(217, 70, 239, 0.35)', borderRadius: '16px', padding: '24px', background: 'rgba(217, 70, 239, 0.03)', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '-10px', left: '24px', background: '#000000', padding: '0 12px', color: '#e879f9', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Shield size={13} color="#e879f9" /> M8ven Trust Governance Layer
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
          <FlowNode icon={<Server size={22} color="#d946ef" />} title="FastMCP Server" subtitle="mcp-server/server.py (Stdio & SSE)" color="#d946ef" variant="focus" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', width: '100%' }}>
            <div style={{ background: 'rgba(217, 70, 239, 0.08)', border: '1px solid rgba(217, 70, 239, 0.25)', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#f0abfc' }}>ReadOnly</div>
              <div style={{ fontSize: '9.5px', color: '#94a3b8' }}>Zero Side Effects</div>
            </div>
            <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#f87171' }}>Destructive</div>
              <div style={{ fontSize: '9.5px', color: '#94a3b8' }}>HITL Gate Guard</div>
            </div>
            <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#6ee7b7' }}>Idempotent</div>
              <div style={{ fontSize: '9.5px', color: '#94a3b8' }}>Safe Repeat Calls</div>
            </div>
            <div style={{ background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#7dd3fc' }}>OpenWorld</div>
              <div style={{ fontSize: '9.5px', color: '#94a3b8' }}>External Network</div>
            </div>
          </div>
          <div style={{ textAlign: 'center', fontSize: '11px', color: '#cbd5e1', lineHeight: 1.5, marginTop: '4px' }}>
            <span style={{ color: '#e879f9', fontWeight: 600 }}>Official M8ven Verified Publisher</span> · 99.998% SLA Heartbeat
          </div>
        </div>
      </div>
    </div>

    {/* Bottom Legend */}
    <div style={{ textAlign: 'center', fontSize: '11px', color: '#94a3b8', marginTop: '4px', lineHeight: 1.8, fontFamily: 'monospace' }}>
      Next.js UI ➔ FastAPI Gateway ➔ LangGraph ReAct ➔ FastMCP (20 Tools) ➔ M8ven Trust Layer ➔ MongoDB Atlas
    </div>
  </div>
);

export default function LandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [uptimeData, setUptimeData] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isGuestLoading, setIsGuestLoading] = useState(false);
  const [signInStage, setSignInStage] = useState(1);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

    const handleGuestContinue = () => {
    setIsGuestLoading(true);
    if (typeof window !== "undefined") {
      let gId = localStorage.getItem("guest_id");
      if (!gId) {
        gId = "guest_" + Math.random().toString(36).substring(2, 10);
        localStorage.setItem("guest_id", gId);
      }
      document.cookie = `guest_session=${gId}; path=/; max-age=2592000`; // 30-day persistence
    }
    // 1.35s High-tech Cyberpunk Loader sequence
    setTimeout(() => {
      router.push("/chat");
    }, 1350);
  };

  const handleGoogleSignIn = () => {
    setIsSigningIn(true);
    setSignInStage(1);
    // Stage 1: 0ms - 650ms (M8ven FastMCP Handshake)
    setTimeout(() => {
      setSignInStage(2); // Stage 2: 650ms - 1350ms (OAuth 2.0 Routing)
    }, 650);
    // Stage 3: At 1350ms trigger the Google OAuth redirect smoothly
    setTimeout(() => {
      signIn('google');
    }, 1350);
  };
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeHudTab, setActiveHudTab] = useState('trace');

  useEffect(() => {
    // Standard entrance display: 950ms so user clearly sees the cybernetic telemetry
    // without getting bored or feeling delayed
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 950);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 350);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

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
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [status, router]);

  if (status === "authenticated") {
    return null; 
  }

  if (isInitialLoading) {
    return (
      <Loading 
        title="Initializing Autonomous Workspace"
        subtitle="LangGraph ReAct · FastMCP Protocol · MongoDB Atlas"
        badge="AGENT RUNTIME ACTIVE"
      />
    );
  }

  if (isGuestLoading) {
    return (
      <Loading 
        title="Allocating Isolated Agent Session"
        subtitle="FastMCP Protocols · LangGraph ReAct · MongoDB Atlas"
        badge="GUEST SANDBOX INITIALIZING"
      />
    );
  }

  if (isSigningIn) {
    return (
      <Loading 
        title={signInStage === 1 ? "M8ven FastMCP Handshake" : "OAuth 2.0 Identity Protocol"}
        subtitle="Verifying Secure Cloud Gateway · Google Auth"
        badge="AUTHENTICATING SESSION"
      />
    );
  }

  const howItWorksSlides = [
    {
      title: "1. The Agentic Workflow & ReAct Loop",
      desc: "Users interact via Next.js. FastAPI backend orchestrates LangGraph ReAct agents. Agents autonomously discover and execute MCP tools with stateful checkpoints.",
      content: (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'nowrap', padding: '36px 0' }}>
          <FlowNode icon={<User size={26} color="#9CA3AF" />} title="User" color="#9CA3AF" subtitle="Prompt Input" />
          <FlowArrow label="SSE Stream" width="36px" />
          <FlowNode icon={<Layers size={26} color="#0EA5E9" />} title="Next.js" color="#0EA5E9" subtitle="Client UI" />
          <FlowArrow label="REST /chat" width="40px" />
          <FlowNode icon={<Zap size={26} color="#10B981" />} title="FastAPI" color="#10B981" subtitle="Async Gateway" />
          <FlowArrow label="ReAct Loop" width="42px" />
          <FlowNode icon={<Cpu size={26} color="#A855F7" />} title="LangGraph" color="#A855F7" variant="focus" subtitle="Stateful Agent" />
          <FlowArrow label="Dispatches" width="38px" />
          <FlowNode icon={<Bot size={26} color="#d946ef" />} title="FastMCP" color="#d946ef" subtitle="20 Live Tools" />
        </div>
      )
    },
    {
      title: "2. FastMCP Tool Discovery & Semantic Hints",
      desc: "LangGraph dynamically queries connected FastMCP servers. Tools declare M8ven Trust annotations (ReadOnly, Destructive, Idempotent) for safety-first execution.",
      content: (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', padding: '36px 0', flexWrap: 'nowrap' }}>
          <FlowNode icon={<Cpu size={26} color="#A855F7" />} title="ReAct Agent" color="#A855F7" subtitle="Needs Tool" />
          <FlowArrow label="List Tools" width="44px" />
          <FlowNode icon={<Server size={26} color="#0EA5E9" />} title="FastMCP Server" color="#0EA5E9" subtitle="Stdio / SSE" />
          <FlowArrow label="Tool Hints" width="48px" />
          <FlowNode icon={<Shield size={26} color="#d946ef" />} title="M8ven Hints" color="#d946ef" subtitle="ReadOnly / Destructive" />
          <FlowArrow label="Injects Context" width="56px" />
          <FlowNode icon={<Sparkles size={26} color="#10B981" />} title="Prompt Context" color="#10B981" variant="focus" subtitle="Zero Hardcoding" />
        </div>
      )
    },
    {
      title: "3. Tool Execution & Python AST Sandboxing",
      desc: "Tools execute safely in isolated contexts. Mathematical formulas evaluate via Python AST parsing (zero arbitrary eval risks), while GitHub & Tavily run via secure APIs.",
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', alignItems: 'center', padding: '16px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', flexWrap: 'nowrap' }}>
            <FlowNode icon={<Cpu size={24} color="#A855F7" />} title="Agent Decision" color="#A855F7" subtitle="calculate_expression()" />
            <FlowArrow label="AST Parse" width="48px" />
            <FlowNode icon={<ShieldCheck size={24} color="#10B981" />} title="AST Sandbox" color="#10B981" variant="focus" subtitle="Zero eval() Risk" />
            <FlowArrow label="Safe Compute" width="48px" />
            <FlowNode icon={<TerminalSquare size={24} color="#d946ef" />} title="Tool Output" color="#d946ef" subtitle="Verified Result" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', opacity: 0.95, flexWrap: 'nowrap' }}>
            <FlowNode icon={<GitBranch size={24} color="#F59E0B" />} title="GitHub / Web Tools" color="#F59E0B" subtitle="External Transport" />
            <FlowArrow label="JSON Payload" width="50px" />
            <FlowNode icon={<Cpu size={24} color="#A855F7" />} title="LangGraph Agent" color="#A855F7" subtitle="Synthesizes Data" />
            <FlowArrow label="Yield Stream" width="48px" />
            <FlowNode icon={<Layers size={24} color="#0EA5E9" />} title="Chat UI" color="#0EA5E9" variant="focus" subtitle="Markdown Render" />
          </div>
        </div>
      )
    },
    {
      title: "4. Human-in-the-Loop (HITL) Governance Gate",
      desc: "Consequential operations like drafting or sending emails trigger a mandatory HITL Governance pause, requiring explicit human approval before any external side effects.",
      content: (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', flexWrap: 'nowrap', padding: '36px 0' }}>
          <FlowNode icon={<Bot size={26} color="#A855F7" />} title="Agent" subtitle="Drafts Email" color="#A855F7" />
          <FlowArrow label="Dispatches" width="40px" />
          <FlowNode icon={<Mail size={26} color="#d946ef" />} title="Gmail Draft" color="#d946ef" subtitle="HTML Template" />
          <FlowArrow label="Halts For" width="44px" />
          <FlowNode icon={<Lock size={26} color="#F59E0B" />} title="HITL Gate" color="#F59E0B" variant="focus" subtitle="Security Check" />
          <FlowArrow label="User Approves" width="52px" />
          <FlowNode icon={<CheckCircle2 size={26} color="#10B981" />} title="SMTP Send" color="#10B981" variant="focus" subtitle="Verified Delivery" />
        </div>
      )
    },
    {
      title: "5. Conversation Lifecycle & 30-Day Automated TTL",
      desc: "Complete context persistence: Load conversation thread from MongoDB Atlas, run LangGraph state updates, and enforce strict 30-Day TTL privacy cleanup.",
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '26px', alignItems: 'center', padding: '16px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'nowrap' }}>
            <FlowNode icon={<User size={24} color="#9CA3AF" />} title="User" color="#9CA3AF" />
            <FlowArrow label="Request" width="28px" />
            <FlowNode icon={<Zap size={24} color="#10B981" />} title="FastAPI" color="#10B981" />
            <FlowArrow label="Load History" width="50px" />
            <FlowNode icon={<Database size={24} color="#F59E0B" />} title="MongoDB Atlas" color="#F59E0B" variant="focus" subtitle="Encrypted Store" />
            <FlowArrow label="Hydrate" width="34px" />
            <FlowNode icon={<Cpu size={24} color="#A855F7" />} title="LangGraph" color="#A855F7" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', flexWrap: 'nowrap' }}>
            <FlowNode icon={<Cpu size={24} color="#A855F7" />} title="LangGraph" color="#A855F7" subtitle="State Updated" />
            <FlowArrow label="Upsert Session" width="60px" />
            <FlowNode icon={<Database size={24} color="#F59E0B" />} title="MongoDB Atlas" color="#F59E0B" />
            <FlowArrow label="TTL Index" width="44px" />
            <FlowNode icon={<Trash2 size={24} color="#EF4444" />} title="30-Day Auto Purge" color="#EF4444" variant="focus" subtitle="Zero Stale Data" />
          </div>
        </div>
      )
    },
    {
      title: "6. M8ven Trust Governance & 99.998% SLA Telemetry",
      desc: "Officially listed on M8ven Registry with Continuous UptimeRobot monitoring, FastMCP Stdio/SSE transports, and strict AST sandboxed governance.",
      content: (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', flexWrap: 'nowrap', padding: '36px 0' }}>
          <FlowNode icon={<ShieldCheck size={26} color="#10B981" />} title="M8ven Verified" color="#10B981" variant="focus" subtitle="Audited Publisher" />
          <FlowArrow label="Heartbeat" width="44px" />
          <FlowNode icon={<Activity size={26} color="#0EA5E9" />} title="UptimeRobot" color="#0EA5E9" subtitle="99.998% Rolling" />
          <FlowArrow label="Validates" width="44px" />
          <FlowNode icon={<Server size={26} color="#d946ef" />} title="FastMCP" color="#d946ef" variant="focus" subtitle="Claude & Cursor" />
          <FlowArrow label="Governance" width="48px" />
          <FlowNode icon={<Lock size={26} color="#F59E0B" />} title="Zero Leakage" color="#F59E0B" subtitle="Strict Privacy" />
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
      <div style={{
        background: 'rgba(212,165,116,0.08)',
        borderBottom: '1px solid rgba(212,165,116,0.15)',
        padding: '8px 16px',
        textAlign: 'center',
        fontSize: '11px',
        fontWeight: 500,
        color: '#d4a574',
        letterSpacing: '0.02em',
        position: 'relative',
        zIndex: 100,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '10px'
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <span>⚠️</span>
          <span><strong>Disclaimer:</strong> Experimental Agentic Workspace by Ambuj Kumar Tripathi. Open for constructive feedback.</span>
        </div>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {/* Original Live Heartbeat Status Badge */}
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
      </div>

      {/* ===== NAVBAR ===== */}
      <style>{`
        .desktop-nav { display: flex; align-items: center; gap: 24px; }
        .mobile-menu-btn { display: none; background: transparent; border: none; color: white; cursor: pointer; }
        .mobile-dropdown { display: none; flex-direction: column; gap: 16px; padding: 16px 20px; background: #000000; border-bottom: 1px solid rgba(217, 70, 239, 0.25); }
        .mobile-nav-badge { display: none; }
        @media (max-width: 980px) {
          .desktop-nav { display: none; }
          .mobile-menu-btn { display: flex; }
          .mobile-nav-badge { display: inline-flex; }
          .nav-container { padding: 12px 16px !important; }
        }
        /* Hero Ambient & Buttons (Fluxora-Inspired Luxury Aesthetics) */
        @keyframes hero-glow-pulse {
          0%, 100% { opacity: 0.65; transform: translateX(-50%) scale(1); }
          50% { opacity: 0.9; transform: translateX(-50%) scale(1.06); }
        }
        .hero-glow-bottom {
          position: absolute;
          width: 820px;
          height: 440px;
          left: 50%;
          bottom: -120px;
          transform: translateX(-50%);
          background: radial-gradient(ellipse at 50% 100%, rgba(56, 189, 248, 0.22) 0%, rgba(99, 102, 241, 0.16) 35%, rgba(14, 165, 233, 0.05) 60%, transparent 75%);
          filter: blur(75px);
          pointer-events: none;
          z-index: 1;
          animation: hero-glow-pulse 9s ease-in-out infinite;
        }
        .hero-glow-top {
          position: absolute;
          width: 960px;
          height: 380px;
          left: 50%;
          top: -140px;
          transform: translateX(-50%);
          background: radial-gradient(ellipse at 50% 0%, rgba(30, 58, 138, 0.3) 0%, rgba(59, 130, 246, 0.12) 40%, transparent 75%);
          filter: blur(85px);
          pointer-events: none;
          z-index: 1;
        }
        .hero-light-grid {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.025) 1px, transparent 1px),
            radial-gradient(ellipse at 50% 40%, rgba(255, 255, 255, 0.04) 0%, transparent 70%);
          background-size: 72px 100%, 100% 100%;
          mask-image: radial-gradient(ellipse at 50% 50%, black 35%, transparent 75%);
          -webkit-mask-image: radial-gradient(ellipse at 50% 50%, black 35%, transparent 75%);
          pointer-events: none;
          z-index: 1;
        }
        .hero-pill-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 5px 14px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.035);
          border: 1px solid rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(16px);
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.12);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          text-decoration: none;
        }
        .hero-pill-badge:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.25);
          transform: translateY(-1px);
          box-shadow: 0 6px 30px rgba(56, 189, 248, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }
        .hero-btn-primary {
          background: #ffffff !important;
          color: #09090b !important;
          font-weight: 600 !important;
          font-size: 0.95rem !important;
          padding: 13px 28px !important;
          border-radius: 9999px !important;
          border: 1px solid #ffffff !important;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 0 28px rgba(255, 255, 255, 0.28), 0 2px 10px rgba(0, 0, 0, 0.4);
        }
        .hero-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 36px rgba(255, 255, 255, 0.45), 0 4px 14px rgba(0, 0, 0, 0.5);
          background: #f8fafc !important;
        }
        .hero-btn-secondary {
          background: rgba(255, 255, 255, 0.05) !important;
          color: #f1f5f9 !important;
          font-weight: 500 !important;
          font-size: 0.95rem !important;
          padding: 13px 26px !important;
          border-radius: 9999px !important;
          border: 1px solid rgba(255, 255, 255, 0.14) !important;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          backdrop-filter: blur(12px);
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
        }
        .hero-btn-secondary:hover {
          background: rgba(255, 255, 255, 0.1) !important;
          border-color: rgba(255, 255, 255, 0.3) !important;
          color: #ffffff !important;
          transform: translateY(-2px);
        }
        .hero-tech-chip {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #cbd5e1;
          padding: 6px 14px;
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.2s ease;
          backdrop-filter: blur(8px);
        }
        .hero-tech-chip:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.22);
          color: #ffffff;
          transform: translateY(-1px);
        }
        .hero-monitoring-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          border-radius: 9999px;
          background: rgba(16, 185, 129, 0.06);
          border: 1px solid rgba(16, 185, 129, 0.24);
          backdrop-filter: blur(16px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(16, 185, 129, 0.15);
          transition: all 0.25s ease;
          text-decoration: none;
        }
        .hero-monitoring-pill:hover {
          background: rgba(16, 185, 129, 0.12);
          border-color: rgba(16, 185, 129, 0.5);
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(16, 185, 129, 0.25);
        }
        .live-status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 8px #10b981;
          animation: pulseDot 2s infinite ease-in-out;
        }
        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }
        .hero-monitoring-label {
          font-size: 11px;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          font-weight: 600;
        }
        .hero-monitoring-val {
          font-size: 12px;
          color: #10b981;
          font-weight: 700;
          letter-spacing: -0.01em;
        }
        .hero-cluster-label {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #64748b;
          font-weight: 700;
          margin-right: 4px;
        }
        .hero-cluster-divider {
          width: 1px;
          height: 22px;
          background: rgba(255, 255, 255, 0.1);
        }
        @media (max-width: 850px) {
          .hero-cluster-divider { display: none; }
        }


        /* ── Tactical Sci-Fi Theme: Orbital AI Defense Grid ── */
        /* ── Dark Futuristic Robot Card (Purana Amber/Gold Theme) ── */
        .robot-stage-card {
          position: relative;
          border-radius: 24px;
          border: none;
          background: #000000;
          overflow: hidden;
          box-shadow: none;
          width: 100%;
          aspect-ratio: 16 / 9;
          max-height: 560px;
          display: flex;
          align-items: center;
          justify-content: center;
          /* Seamless bilateral feather: both left AND right edges dissolve into pitch black */
          -webkit-mask-image: linear-gradient(to right, transparent 0%, rgba(0,0,0,0.65) 3.5%, rgba(0,0,0,1) 9%, rgba(0,0,0,1) 91%, rgba(0,0,0,0.65) 96.5%, transparent 100%);
          mask-image: linear-gradient(to right, transparent 0%, rgba(0,0,0,0.65) 3.5%, rgba(0,0,0,1) 9%, rgba(0,0,0,1) 91%, rgba(0,0,0,0.65) 96.5%, transparent 100%);
        }
        .robot-grid-bg {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(16, 185, 129, 0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16, 185, 129, 0.025) 1px, transparent 1px);
          background-size: 32px 32px;
          pointer-events: none;
          z-index: 1;
          -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 68%, transparent 95%);
          mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 68%, transparent 95%);
        }
        .robot-ambient-glow {
          position: absolute;
          top: 15%;
          left: 50%;
          transform: translateX(-50%);
          width: 380px;
          height: 380px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.16) 0%, rgba(16, 185, 129, 0.03) 50%, transparent 75%);
          pointer-events: none;
          z-index: 1;
        }
        .robot-viewport {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          z-index: 2;
          /* Seamless vertical bottom dissolve into pure dark background */
          -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 74%, rgba(0,0,0,0.55) 86%, rgba(0,0,0,0.12) 94%, transparent 100%);
          mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 74%, rgba(0,0,0,0.55) 86%, rgba(0,0,0,0.12) 94%, transparent 100%);
        }
        .robot-humanoid-actor {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          /* ZERO ZOOM / ZERO TRIM: Natural 100% video display */
          user-select: none;
          pointer-events: none;
          display: block;
          -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 76%, rgba(0,0,0,0.55) 87%, rgba(0,0,0,0.12) 95%, transparent 100%);
          mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 76%, rgba(0,0,0,0.55) 87%, rgba(0,0,0,0.12) 95%, transparent 100%);
        }
        @keyframes robotSpecularPulse {
          0% {
            filter: brightness(1) drop-shadow(0 0 16px rgba(245, 158, 11, 0.18));
          }
          50% {
            filter: brightness(1.08) drop-shadow(0 0 35px rgba(245, 158, 11, 0.42));
          }
          100% {
            filter: brightness(1) drop-shadow(0 0 16px rgba(245, 158, 11, 0.18));
          }
        }
        .robot-light-sweep {
          position: absolute;
          top: 0;
          left: -120%;
          width: 50%;
          height: 100%;
          background: linear-gradient(90deg, transparent 0%, rgba(245, 158, 11, 0.08) 50%, transparent 100%);
          transform: skewX(-25deg);
          animation: lightSweep 9s ease-in-out infinite 2.5s;
          pointer-events: none;
          z-index: 5;
        }
        @keyframes lightSweep {
          0% { left: -120%; }
          30% { left: 220%; }
          100% { left: 220%; }
        }
        /* ── 3D Infinite Perspective Cyber Road Grid ── */
        .cyber-grid-floor {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 54%;
          overflow: hidden;
          perspective: 400px;
          pointer-events: none;
          z-index: 1;
          mask-image: linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 45%, rgba(0,0,0,0.3) 75%, transparent 100%);
          -webkit-mask-image: linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 45%, rgba(0,0,0,0.3) 75%, transparent 100%);
        }
        .cyber-grid-plane {
          position: absolute;
          top: -25%;
          left: -60%;
          width: 220%;
          height: 220%;
          background-image: 
            linear-gradient(to right, rgba(245, 158, 11, 0.18) 1.5px, transparent 1.5px),
            linear-gradient(to bottom, rgba(245, 158, 11, 0.18) 1.5px, transparent 1.5px);
          background-size: 56px 56px;
          transform: rotateX(72deg);
          transform-origin: 50% 20%;
          animation: moveCyberRoad 2.2s linear infinite;
        }
        @keyframes moveCyberRoad {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 0 56px;
          }
        }
        .cyber-horizon-glow {
          position: absolute;
          bottom: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, rgba(245, 158, 11, 0.3) 25%, rgba(56, 189, 248, 0.6) 50%, rgba(245, 158, 11, 0.3) 75%, transparent 100%);
          box-shadow: 0 0 16px rgba(245, 158, 11, 0.4), 0 0 35px rgba(56, 189, 248, 0.3);
          pointer-events: none;
          z-index: 1;
        }

        .hero-split-grid {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.35fr);
          gap: 36px;
          align-items: center;
          max-width: 1420px;
          width: 100%;
          margin: 0 auto 24px;
          text-align: left;
        }
        .hero-left-content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
          z-index: 2;
          width: 100%;
        }
        .hero-trust-row {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 18px;
        }
        .hero-indicator-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }
        .landing-title {
          max-width: 680px;
          font-size: clamp(2.4rem, 4.4vw, 4.2rem);
          font-weight: 900;
          letter-spacing: -0.035em;
          margin-bottom: 12px;
          line-height: 1.05;
          text-transform: uppercase;
        }
        .landing-subtitle {
          max-width: 560px;
          font-size: clamp(0.98rem, 1.2vw, 1.06rem);
          color: #94a3b8;
          line-height: 1.65;
          margin-bottom: 30px;
          font-weight: 400;
        }
        .hero-ctas {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
        }

        /* 📱 Tablet & Compact Desktop (<= 980px) */
        @media (max-width: 980px) {
          .hero-split-grid {
            grid-template-columns: 1fr !important;
            gap: 28px !important;
            text-align: center !important;
            margin: 0 auto 20px !important;
          }
          .hero-left-content {
            align-items: center !important;
            text-align: center !important;
          }
          .hero-trust-row,
          .hero-indicator-row {
            justify-content: center !important;
          }
          .landing-title {
            text-align: center !important;
            font-size: clamp(2rem, 6vw, 3rem) !important;
          }
          .landing-subtitle {
            text-align: center !important;
            margin-left: auto !important;
            margin-right: auto !important;
            max-width: 100% !important;
          }
          .hero-ctas {
            justify-content: center !important;
          }
          .robot-stage-card {
            max-width: 600px !important;
            margin: 0 auto !important;
          }
        }

        /* 📱 Mobile Portrait (<= 640px) */
        @media (max-width: 640px) {
          #workspace {
            padding: 78px 16px 28px !important;
          }
          .hero-split-grid {
            gap: 22px !important;
          }
          .landing-title {
            font-size: clamp(1.65rem, 7.8vw, 2.3rem) !important;
            line-height: 1.15 !important;
            letter-spacing: -0.025em !important;
            margin-bottom: 12px !important;
          }
          .landing-subtitle {
            font-size: 0.9rem !important;
            line-height: 1.5 !important;
            margin-bottom: 22px !important;
          }
          .hero-ctas {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 12px !important;
            width: 100% !important;
          }
          .tactical-primary-btn, .tactical-secondary-btn {
            width: 100% !important;
            justify-content: center !important;
            padding: 13px 20px !important;
            font-size: 0.88rem !important;
          }
          .robot-stage-card {
            border-radius: 14px !important;
            width: 100% !important;
          }
          .robot-pill-top-left {
            top: 10px !important;
            left: 10px !important;
            padding: 4px 8px !important;
            font-size: 9px !important;
            gap: 5px !important;
          }
          .robot-pill-top-right {
            top: 10px !important;
            right: 10px !important;
            padding: 4px 8px !important;
            font-size: 9px !important;
          }
          .robot-pill-bottom-right {
            bottom: 10px !important;
            right: 10px !important;
            padding: 4px 8px !important;
            font-size: 9px !important;
            gap: 5px !important;
          }
        }

        /* 📱 Mobile Landscape / Auto-Rotate Fix (<= 550px height) */
        @media (max-height: 550px) and (orientation: landscape) {
          #workspace {
            padding-top: 72px !important;
            padding-bottom: 20px !important;
            min-height: auto !important;
          }
          .hero-split-grid {
            grid-template-columns: 1.15fr 1fr !important;
            gap: 18px !important;
            align-items: center !important;
            margin-bottom: 16px !important;
            text-align: left !important;
          }
          .hero-left-content {
            align-items: flex-start !important;
            text-align: left !important;
          }
          .hero-trust-row,
          .hero-indicator-row {
            justify-content: flex-start !important;
          }
          .hero-left-content .hero-ctas {
            justify-content: flex-start !important;
            flex-direction: row !important;
          }
          .landing-title {
            font-size: 1.7rem !important;
            line-height: 1.15 !important;
            text-align: left !important;
          }
          .landing-subtitle {
            font-size: 0.82rem !important;
            line-height: 1.4 !important;
            margin-bottom: 12px !important;
            text-align: left !important;
          }
          .tactical-primary-btn, .tactical-secondary-btn {
            padding: 9px 18px !important;
            font-size: 0.8rem !important;
            width: auto !important;
          }
          .robot-stage-card {
            max-height: 240px !important;
            aspect-ratio: 16 / 9 !important;
          }
        }

        .tactical-laser-line {
          position: absolute;
          left: 45%;
          top: 0;
          bottom: 0;
          width: 1px;
          background: linear-gradient(180deg, transparent 0%, rgba(245, 158, 11, 0.35) 30%, rgba(245, 158, 11, 0.6) 50%, rgba(245, 158, 11, 0.35) 70%, transparent 100%);
          box-shadow: 0 0 15px rgba(245, 158, 11, 0.4);
          pointer-events: none;
          z-index: 1;
        }
        @media (max-width: 980px) {
          .tactical-laser-line { display: none; }
        }

        .tactical-primary-btn {
          position: relative;
          background: rgba(18, 20, 30, 0.95) !important;
          color: #ffffff !important;
          font-weight: 700 !important;
          font-size: 0.92rem !important;
          letter-spacing: 0.04em !important;
          text-transform: uppercase !important;
          padding: 14px 28px 14px 24px !important;
          border-radius: 4px !important;
          border: 1px solid rgba(217, 70, 239, 0.4) !important;
          border-left: 4px solid #d946ef !important;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6), -3px 0 12px rgba(217, 70, 239, 0.4), 0 0 20px rgba(217, 70, 239, 0.2);
        }
        .tactical-primary-btn:hover {
          background: rgba(28, 20, 38, 0.95) !important;
          border-color: #e879f9 !important;
          border-left-color: #f0abfc !important;
          transform: translateY(-2px);
          box-shadow: 0 6px 30px rgba(217, 70, 239, 0.45), -4px 0 18px rgba(217, 70, 239, 0.55), inset 0 0 15px rgba(217, 70, 239, 0.2);
        }

        .tactical-secondary-btn {
          background: rgba(10, 14, 20, 0.8) !important;
          color: #cbd5e1 !important;
          font-weight: 600 !important;
          font-size: 0.92rem !important;
          letter-spacing: 0.04em !important;
          text-transform: uppercase !important;
          padding: 14px 24px !important;
          border-radius: 4px !important;
          border: 1px solid rgba(255, 255, 255, 0.15) !important;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.25s ease;
          backdrop-filter: blur(12px);
        }
        .tactical-secondary-btn:hover {
          background: rgba(255, 255, 255, 0.06) !important;
          border-color: rgba(245, 158, 11, 0.5) !important;
          color: #f59e0b !important;
          transform: translateY(-2px);
        }

        /* Orbital Radar Stage */
        .orbital-stage {
          position: relative;
          width: 100%;
          max-width: 520px;
          height: 480px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        @media (max-width: 600px) {
          .orbital-stage {
            height: 380px;
            max-width: 340px;
          }
        }

        .orbital-ring {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }
        .orbital-ring-outer {
          width: 440px;
          height: 440px;
          border: 1px dashed rgba(245, 158, 11, 0.15);
          animation: rotateOrbit 50s linear infinite;
        }
        .orbital-ring-mid {
          width: 320px;
          height: 320px;
          border: 1px solid rgba(245, 158, 11, 0.22);
          animation: rotateOrbitReverse 35s linear infinite;
        }
        .orbital-ring-inner {
          width: 190px;
          height: 190px;
          border: 1px solid rgba(245, 158, 11, 0.35);
          box-shadow: 0 0 25px rgba(245, 158, 11, 0.08);
        }

        @keyframes rotateOrbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes rotateOrbitReverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }

        /* Radar Beam Sweeper */
        .radar-sweeper {
          position: absolute;
          width: 440px;
          height: 440px;
          border-radius: 50%;
          background: conic-gradient(from 0deg, transparent 0deg, transparent 290deg, rgba(245, 158, 11, 0.16) 360deg);
          animation: rotateOrbit 9s linear infinite;
          pointer-events: none;
        }

        /* Core Glowing Diamond */
        .orbital-core-halo {
          position: absolute;
          width: 90px;
          height: 90px;
          border-radius: 50%;
          border: 1px solid rgba(245, 158, 11, 0.6);
          background: radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, rgba(15, 23, 42, 0.95) 75%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 35px rgba(245, 158, 11, 0.45), inset 0 0 15px rgba(245, 158, 11, 0.3);
          z-index: 3;
          animation: corePulse 3.5s ease-in-out infinite;
        }
        .orbital-diamond {
          width: 24px;
          height: 24px;
          background: #f59e0b;
          transform: rotate(45deg);
          box-shadow: 0 0 16px #f59e0b, 0 0 28px rgba(245, 158, 11, 0.8);
        }
        @keyframes corePulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 30px rgba(245, 158, 11, 0.4);
          }
          50% {
            transform: scale(1.08);
            box-shadow: 0 0 45px rgba(245, 158, 11, 0.7);
          }
        }

        /* Floating Tactical Nodes */
        .tactical-node-card {
          position: absolute;
          background: rgba(10, 14, 22, 0.88);
          border: 1px solid rgba(245, 158, 11, 0.3);
          border-radius: 6px;
          padding: 8px 12px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.7), 0 0 15px rgba(245, 158, 11, 0.15);
          backdrop-filter: blur(12px);
          z-index: 4;
          transition: all 0.25s ease;
          cursor: default;
        }
        .tactical-node-card:hover {
          border-color: #f59e0b;
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.85), 0 0 25px rgba(245, 158, 11, 0.4);
          transform: translateY(-2px);
        }

        .tactical-status-hud {
          position: absolute;
          bottom: 18px;
          left: 10px;
          background: rgba(10, 14, 22, 0.92);
          border: 1px solid rgba(245, 158, 11, 0.35);
          border-radius: 6px;
          padding: 12px 18px;
          display: flex;
          align-items: center;
          gap: 14px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8), 0 0 20px rgba(245, 158, 11, 0.18);
          backdrop-filter: blur(14px);
          z-index: 5;
        }
        .tactical-accent-dash {
          width: 22px;
          height: 4px;
          background: #f59e0b;
          border-radius: 2px;
          box-shadow: 0 0 10px #f59e0b;
        }

`}</style>
      <nav className="nav-container" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 40px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(8, 8, 10, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        position: 'fixed', top: 0, left: 0, right: 0, width: '100%', zIndex: 9999,
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
          <a
            href="https://stats.uptimerobot.com/4tYmSQnuBE?utm_source=status_badge&utm_medium=referral"
            target="_blank"
            rel="noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none', marginLeft: '6px' }}
            title="UptimeRobot Verified 99.998% SLA"
          >
            <img
              src="https://badge.uptimerobot.com/sla/18a544b11fc4799a468704cc7acccedb.svg?theme=dark"
              alt="Uptime SLA 99.998%"
              style={{ height: '22px', width: 'auto', borderRadius: '4px', display: 'block' }}
            />
          </a>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Top-Right Navbar CTA: Continue as Guest */}
          <button 
            id="continue-as-guest-btn"
            onClick={handleGuestContinue} 
            className="guest-cta-btn" 
            title="Instant sandbox access without sign-in"
          >
            <span>Continue as Guest</span>
            <span className="cta-arrow">›</span>
          </button>

          <a
            href="https://stats.uptimerobot.com/4tYmSQnuBE?utm_source=status_badge&utm_medium=referral"
            target="_blank"
            rel="noreferrer"
            className="mobile-nav-badge"
            style={{ alignItems: 'center', textDecoration: 'none' }}
            title="UptimeRobot Verified 99.998% SLA"
          >
            <img
              src="https://badge.uptimerobot.com/sla/18a544b11fc4799a468704cc7acccedb.svg?theme=dark"
              alt="Uptime SLA 99.998%"
              style={{ height: '20px', width: 'auto', borderRadius: '4px', display: 'block' }}
            />
          </a>

          <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>
      {isMobileMenuOpen && (
        <div className="mobile-dropdown" style={{ display: 'flex', position: 'fixed', top: '65px', left: 0, right: 0, width: '100%', zIndex: 9998 }}>
          <Link href="#workspace" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <button onClick={() => { setIsHowItWorksOpen(true); setIsMobileMenuOpen(false); }} className="nav-link" style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 'inherit', padding: 0, fontFamily: 'inherit', color: 'inherit', textAlign: 'left' }}>How it works</button>
          <Link href="#architecture" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Architecture</Link>
          <Link href="#capabilities" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Capabilities</Link>
          <button 
            onClick={() => { setIsMobileMenuOpen(false); handleGuestContinue(); }} 
            className="guest-cta-btn" 
            style={{ justifyContent: 'center', width: '100%', padding: '10px 16px', marginTop: '6px' }}
          >
            <span>Continue as Guest</span>
            <span className="cta-arrow">›</span>
          </button>
        </div>
      )}

      <main style={{ background: '#000000', backgroundColor: '#000000', minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>
{/* ── HERO SECTION (TACTICAL DEFENSE GRID THEME) ── */}
        <section id="workspace" style={{
          position: 'relative',
          padding: '96px 24px 40px',
          minHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(ellipse at 75% 45%, rgba(16, 185, 129, 0.04) 0%, #000000 60%)',
          backgroundColor: '#000000',
          overflow: 'hidden',
        }}>


          {/* Main 2-Column Split: Tactical Content Left + Orbital Radar Grid Right */}
          <div className="hero-split-grid">
            
            {/* Left Column: All Core Content, Headline, Subtitle, CTAs */}
            <div className="hero-left-content">
              {/* Top Trust Row: M8ven Verified & Production Monitoring */}
              <div className="hero-trust-row">
                <a
                  href="https://m8ven.ai/mcp/ambuj123-lab-agentic-ai-workspace-z0cbq7?s=docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none', transition: 'transform 0.2s ease' }}
                  onMouseOver={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                  title="M8ven Score & Live Monitored MCP Server"
                >
                  <img
                    src="https://m8ven.ai/badge/mcp/ambuj123-lab-agentic-ai-workspace-z0cbq7"
                    alt="M8ven Score"
                    style={{ height: '22px', width: 'auto', borderRadius: '4px', display: 'inline-block' }}
                  />
                </a>

                <a
                  href="https://stats.uptimerobot.com/4tYmSQnuBE?utm_source=status_badge&utm_medium=referral"
                  target="_blank"
                  rel="noreferrer"
                  className="hero-monitoring-pill"
                  title="UptimeRobot Verified 99.998% SLA Status"
                >
                  <span className="live-status-dot" />
                  <span className="hero-monitoring-label">Production Monitoring</span>
                  <span style={{ color: 'rgba(255, 255, 255, 0.25)', fontSize: '11px' }}>·</span>
                  <span className="hero-monitoring-val">99.998% Uptime</span>
                </a>
              </div>

              {/* Tactical Indicator Dashes & Sequence Label (Cyber Emerald Theme) */}
              <div className="hero-indicator-row">
                <div style={{ display: 'flex', gap: '4px' }}>
                  <div style={{ width: '8px', height: '3px', background: '#10b981', borderRadius: '1px', boxShadow: '0 0 8px #10b981' }} />
                  <div style={{ width: '8px', height: '3px', background: '#10b981', borderRadius: '1px' }} />
                  <div style={{ width: '8px', height: '3px', background: '#34d399', borderRadius: '1px' }} />
                  <div style={{ width: '8px', height: '3px', background: 'rgba(16, 185, 129, 0.35)', borderRadius: '1px' }} />
                </div>
                <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', textShadow: '0 0 10px rgba(16, 185, 129, 0.45)' }}>
                  AUTONOMOUS AGENT ACTIVE
                </span>
              </div>

              {/* Main Headline: Premium Cyber Emerald Display (Harmonized with Video Robot) */}
              <h1 className="landing-title">
                <span style={{
                  display: 'block',
                  color: '#FFFFFF',
                  textShadow: '0 2px 24px rgba(255, 255, 255, 0.2)',
                }}>
                  Production-Grade
                </span>
                <span style={{
                  display: 'block',
                  background: 'linear-gradient(135deg, #ECFDF5 0%, #A7F3D0 25%, #34D399 55%, #10B981 85%, #059669 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 2px 28px rgba(16, 185, 129, 0.45))',
                }}>
                  Agentic AI Workspace
                </span>
              </h1>

              {/* Headline Sub-Kicker */}
              <div style={{
                fontSize: 'clamp(1.05rem, 1.6vw, 1.25rem)',
                fontWeight: 600,
                letterSpacing: '-0.01em',
                color: '#cbd5e1',
                marginBottom: '16px',
              }}>
                LangGraph orchestration. MCP tools. Human-controlled actions.
              </div>

              {/* Tighter, Engineering-Heavy Supporting Text */}
              <p className="landing-subtitle">
                A production-oriented AI workspace that orchestrates multi-step agents, discovers MCP tools dynamically, and keeps consequential actions behind human approval.
              </p>

              {/* Dual Action CTAs: Tactical Engage Button + Bordered System Scan */}
              <div className="hero-ctas">
                <button onClick={handleGoogleSignIn} className="tactical-primary-btn" style={{ borderLeft: '3.5px solid #c026d3' }}>
                  <span>Sign in with Google</span>
                  <span style={{ color: '#d946ef', fontSize: '1.1rem', fontWeight: 800 }}>›</span>
                </button>

                <button onClick={() => setIsHowItWorksOpen(true)} className="tactical-secondary-btn">
                  <span>How it works</span>
                </button>
              </div>
            </div>

            {/* Right Column: Dark Futuristic 3D Robot Card (LaunchLayer Aesthetic) */}
            <div className="robot-stage-card">
              {/* Subtle Dark Cyber Grid Background */}
              <div className="robot-grid-bg" />

              {/* Soft Golden Ambient Glow behind the head */}
              <div className="robot-ambient-glow" />

              {/* Top-Left Status Pill */}
              <div className="robot-pill-top-left" style={{
                position: 'absolute',
                top: '20px',
                left: '22px',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '20px',
                padding: '6px 14px',
                fontSize: '11px',
                fontWeight: 700,
                color: '#cbd5e1',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
                <span>AGENT CORE ACTIVE</span>
              </div>

              {/* Top-Right Runtime Tag (Red-Purple / Magenta Accent matching Google Sign-In line) */}
              <div className="robot-pill-top-right" style={{
                position: 'absolute',
                top: '20px',
                right: '32px',
                zIndex: 10,
                background: 'rgba(28, 16, 38, 0.88)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(217, 70, 239, 0.45)',
                borderRadius: '20px',
                padding: '6px 14px',
                fontSize: '11px',
                fontWeight: 700,
                color: '#e879f9',
                letterSpacing: '0.06em',
                fontFamily: 'monospace',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.7), 0 0 16px rgba(217, 70, 239, 0.25)',
              }}>
                14 MCP TOOLS
              </div>

              {/* Robot Video Viewport (100% Untrimmed, Natural Aspect) */}
              <div className="robot-viewport">
                <video
                  src="/robot.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="robot-humanoid-actor"
                />
              </div>

              {/* Bottom Edge Dark Dissolve Overlay (Blends bottom card boundary seamlessly into pitch-black background) */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '75px',
                background: 'linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.4) 40%, rgba(0, 0, 0, 0.85) 75%, #000000 100%)',
                pointerEvents: 'none',
                zIndex: 4,
              }} />

              {/* Precision Gemini Watermark Eradication Shield (Zero Video Trim, Seamless Blackout) */}
              <div style={{
                position: 'absolute',
                bottom: '16.7%',
                right: '9.4%',
                transform: 'translate(50%, 50%)',
                width: '74px',
                height: '74px',
                borderRadius: '50%',
                background: '#000000',
                boxShadow: '0 0 28px 22px #000000',
                pointerEvents: 'none',
                zIndex: 8,
              }} />

              {/* Bottom-Right Tactical Status Pill (Balanced with top-right pill) */}
              <div className="robot-pill-bottom-right" style={{
                position: 'absolute',
                bottom: '20px',
                right: '32px',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                background: 'rgba(2, 5, 4, 0.92)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '20px',
                padding: '6px 14px',
                fontSize: '10px',
                fontWeight: 700,
                color: '#34d399',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontFamily: 'monospace',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.95)',
                pointerEvents: 'auto',
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
                <span>AUTONOMOUS ENGINE</span>
              </div>

              {/* Subtle Specular Gleam Sweep across the helmet */}
              <div className="robot-light-sweep" />
            </div>
          </div>

          {/* Categorized Architecture Clusters (Intentional Tech Grouping) */}
          <div style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '18px',
            flexWrap: 'wrap',
            maxWidth: '1080px',
            width: '100%',
            marginBottom: '32px',
            padding: '14px 20px',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(12, 12, 16, 0.7)',
            borderRadius: '16px',
            backdropFilter: 'blur(10px)',
          }}>
            {/* Cluster 1: AI / Orchestration */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span className="hero-cluster-label" style={{ color: '#10b981' }}>AI / Orchestration</span>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <span className="hero-tech-chip">LangGraph</span>
                <span className="hero-tech-chip">MCP</span>
                <span className="hero-tech-chip">Gemini</span>
              </div>
            </div>

            <div className="hero-cluster-divider" />

            {/* Cluster 2: Backend */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span className="hero-cluster-label">Backend</span>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <span className="hero-tech-chip">FastAPI</span>
                <span className="hero-tech-chip">MongoDB Atlas</span>
              </div>
            </div>

            <div className="hero-cluster-divider" />

            {/* Cluster 3: Integrations */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span className="hero-cluster-label">Integrations</span>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <span className="hero-tech-chip">GitHub API</span>
                <span className="hero-tech-chip">Gmail</span>
                <span className="hero-tech-chip">Yahoo Finance</span>
                <span className="hero-tech-chip">Tavily</span>
              </div>
            </div>
          </div>

          {/* Security & Governance Footer (Tight & Premium) */}
          <div style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '12px', fontWeight: 500 }}><Lock size={13} style={{ color: '#475569' }} /> OAuth 2.0</span>
            <span style={{ color: '#334155' }}>·</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '12px', fontWeight: 500 }}><Shield size={13} style={{ color: '#475569' }} /> Encrypted Sessions</span>
            <span style={{ color: '#334155' }}>·</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '12px', fontWeight: 500 }}><Trash2 size={13} style={{ color: '#475569' }} /> 30-Day TTL Cleanup</span>
          </div>
        </section>

        {/* ── CAPABILITIES ── */}
        <section id="capabilities" style={{ padding: '80px 20px', background: '#000000', backgroundColor: '#000000', borderTop: 'none' }}>
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
          <div className="hiw-modal-overlay">
            <button 
              onClick={() => setIsHowItWorksOpen(false)} 
              className="hiw-close-btn"
              title="Close (Esc)"
              aria-label="Close"
            >
              <X size={24} />
            </button>
            
            <h2 className="hiw-modal-title">
              System Architecture & How It Works
            </h2>
            
            <div className="hiw-modal-card">
              {/* Header / Title */}
              <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(20,12,28,0.45)' }}>
                <h3 style={{ fontSize: 'clamp(16px, 2.5vw, 20px)', fontWeight: 700, color: '#fff', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ color: '#d946ef' }}>Slide {activeSlide + 1}:</span> {howItWorksSlides[activeSlide].title}
                </h3>
                <p style={{ color: '#94A3B8', fontSize: 'clamp(12.5px, 1.8vw, 14px)', lineHeight: 1.55 }}>
                  {howItWorksSlides[activeSlide].desc}
                </p>
              </div>
              
              {/* Carousel Content */}
              <div className="hiw-diagram-viewport">
                {/* Prev Button (Desktop/Tablet) */}
                <button 
                  onClick={() => setActiveSlide(s => Math.max(0, s - 1))}
                  disabled={activeSlide === 0}
                  style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(217,70,239,0.3)', borderRadius: '50%', width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: activeSlide === 0 ? 'not-allowed' : 'pointer', opacity: activeSlide === 0 ? 0.25 : 1, transition: 'all 0.2s', zIndex: 10 }}
                  onMouseOver={e => { if(activeSlide !== 0) { e.currentTarget.style.background = 'rgba(217,70,239,0.25)'; e.currentTarget.style.borderColor = '#d946ef'; }}}
                  onMouseOut={e => { if(activeSlide !== 0) { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(217,70,239,0.3)'; }}}
                  aria-label="Previous Slide"
                >
                  <ChevronLeft size={22} />
                </button>

                {/* Diagram Scroll Container */}
                <div className="hiw-flow-scroll">
                  {howItWorksSlides[activeSlide].content}
                </div>

                {/* Next Button (Desktop/Tablet) */}
                <button 
                  onClick={() => setActiveSlide(s => Math.min(howItWorksSlides.length - 1, s + 1))}
                  disabled={activeSlide === howItWorksSlides.length - 1}
                  style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(217,70,239,0.3)', borderRadius: '50%', width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: activeSlide === howItWorksSlides.length - 1 ? 'not-allowed' : 'pointer', opacity: activeSlide === howItWorksSlides.length - 1 ? 0.25 : 1, transition: 'all 0.2s', zIndex: 10 }}
                  onMouseOver={e => { if(activeSlide !== howItWorksSlides.length - 1) { e.currentTarget.style.background = 'rgba(217,70,239,0.25)'; e.currentTarget.style.borderColor = '#d946ef'; }}}
                  onMouseOut={e => { if(activeSlide !== howItWorksSlides.length - 1) { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(217,70,239,0.3)'; }}}
                  aria-label="Next Slide"
                >
                  <ChevronRight size={22} />
                </button>
              </div>
              
              {/* Dots & Mobile Nav Footer */}
              <div style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(15,10,22,0.85)', borderTop: '1px solid rgba(255,255,255,0.08)', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button 
                    onClick={() => setActiveSlide(s => Math.max(0, s - 1))}
                    disabled={activeSlide === 0}
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(217,70,239,0.3)', borderRadius: '6px', padding: '4px 10px', color: '#fff', fontSize: '12px', cursor: activeSlide === 0 ? 'not-allowed' : 'pointer', opacity: activeSlide === 0 ? 0.3 : 1 }}
                  >
                    ← Prev
                  </button>
                  <span style={{ color: '#94A3B8', fontSize: '12.5px', fontFamily: 'monospace' }}>
                    {activeSlide + 1} / {howItWorksSlides.length}
                  </span>
                  <button 
                    onClick={() => setActiveSlide(s => Math.min(howItWorksSlides.length - 1, s + 1))}
                    disabled={activeSlide === howItWorksSlides.length - 1}
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(217,70,239,0.3)', borderRadius: '6px', padding: '4px 10px', color: '#fff', fontSize: '12px', cursor: activeSlide === howItWorksSlides.length - 1 ? 'not-allowed' : 'pointer', opacity: activeSlide === howItWorksSlides.length - 1 ? 0.3 : 1 }}
                  >
                    Next →
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {howItWorksSlides.map((_, i) => (
                    <button 
                      key={i} 
                      onClick={() => setActiveSlide(i)}
                      aria-label={`Go to slide ${i + 1}`}
                      style={{ width: i === activeSlide ? '22px' : '8px', height: '8px', borderRadius: '4px', background: i === activeSlide ? '#d946ef' : 'rgba(255,255,255,0.2)', boxShadow: i === activeSlide ? '0 0 10px #d946ef' : 'none', border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── ARCHITECTURE ── */}
        <section id="architecture" style={{ padding: '80px 20px', background: '#000000', backgroundColor: '#000000', borderTop: 'none' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 700, textAlign: 'center', marginBottom: '60px', color: '#fff' }}>System Architecture</h2>
          <div style={{ background: 'rgba(12,12,15,0.85)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '40px 24px', maxWidth: '1000px', margin: '0 auto', overflowX: 'auto', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
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
      <footer id="about" className="fat-footer" style={{ position: 'relative', background: '#000000', backgroundColor: '#000000', borderTop: 'none', color: '#9CA3AF', fontSize: '0.9rem', overflow: 'hidden' }}>
        {/* Signature Red-Purple / Magenta Differentiator Bar with Ambient Glow */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(217, 70, 239, 0.25) 15%, #d946ef 50%, rgba(217, 70, 239, 0.25) 85%, transparent 100%)',
          boxShadow: '0 0 20px rgba(217, 70, 239, 0.6), 0 0 45px rgba(217, 70, 239, 0.3)',
        }} />
        {/* Soft Ambient Radial Glow from top center of footer */}
        <div style={{
          position: 'absolute',
          top: '-60px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '700px',
          height: '120px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(217, 70, 239, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 1,
        }} />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: '3rem' }}>
          
          {/* Left Column: Logo & Copyright */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '300px', flex: 1.5, minWidth: '250px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
                <img src="/icon.jpg" alt="Logo" style={{ height: '40px', borderRadius: '8px' }} />
                <span style={{ fontWeight: 700, fontSize: '1.4rem', color: '#fff', letterSpacing: '-0.5px' }}>Ambuj Kumar Tripathi's <span style={{ color: '#d946ef' }}>Workspace</span></span>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <a href="https://www.linkedin.com/in/ambuj-tripathi-042b4a118/" target="_blank" rel="noreferrer" style={{ color: '#a1a1aa', transition: 'color 0.2s' }} onMouseOver={e=>e.currentTarget.style.color='#fff'} onMouseOut={e=>e.currentTarget.style.color='#a1a1aa'}><FaLinkedin size={22} /></a>
                <a href="https://x.com/Ambuj_KTripathi" target="_blank" rel="noreferrer" style={{ color: '#a1a1aa', transition: 'color 0.2s' }} onMouseOver={e=>e.currentTarget.style.color='#fff'} onMouseOut={e=>e.currentTarget.style.color='#a1a1aa'}><FaXTwitter size={22} /></a>
                <a href="https://github.com/Ambuj123-lab" target="_blank" rel="noreferrer" style={{ color: '#a1a1aa', transition: 'color 0.2s' }} onMouseOver={e=>e.currentTarget.style.color='#fff'} onMouseOut={e=>e.currentTarget.style.color='#a1a1aa'}><FaGithub size={22} /></a>
              </div>

              {/* QR Code Section */}
              <div style={{ marginTop: '2.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px', display: 'inline-block', maxWidth: '100%', transition: 'border-color 0.3s' }} onMouseOver={(e) => e.currentTarget.style.borderColor='rgba(14,165,233,0.4)'} onMouseOut={(e) => e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'}>
                <h4 style={{ fontSize: '0.85rem', color: '#fff', marginBottom: '12px', fontWeight: 600, letterSpacing: '0.5px' }}>Connect with the Architect</h4>
                <a href="https://ambuj-ai-portfolio.vercel.app/" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none' }}>
                  <img src="/qr-code.png" alt="Portfolio QR Code" style={{ width: '70px', height: '70px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: '#fff', padding: '2px' }} />
                  <div style={{ fontSize: '0.75rem', color: '#9CA3AF', lineHeight: '1.6' }}>
                    Scan or click to view <br/>
                    <strong style={{ color: '#d946ef', fontWeight: 600, textDecoration: 'underline' }}>My Portfolio</strong> & Resume.
                  </div>
                </a>
              </div>
            </div>

            <div style={{ marginTop: 'auto' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '1rem', fontSize: '0.8rem', color: '#6b7280' }}>
                <span style={{ color: '#9CA3AF' }}>Version: <span style={{ color: '#fff' }}>v2.0 Beta</span></span>
                <span style={{ color: '#9CA3AF' }}>Deployment: <span style={{ color: '#fff' }}>Vercel / Local MCP</span></span>
                <span style={{ color: '#9CA3AF' }}>API Uptime: <a href="https://stats.uptimerobot.com/4tYmSQnuBE?utm_source=status_badge&utm_medium=referral" target="_blank" rel="noreferrer" style={{ color: '#10B981', textDecoration: 'none' }} onMouseOver={e=>e.currentTarget.style.textDecoration='underline'} onMouseOut={e=>e.currentTarget.style.textDecoration='none'}>{uptimeData ? `${uptimeData.uptime} • 99.998% SLA` : '99.998% SLA (30-Day Rolling)'}</a></span>
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

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="back-to-top-btn"
          title="Back to Top"
          aria-label="Back to Top"
        >
          <ArrowUp size={18} />
        </button>
      )}
    </div>
  );
}
