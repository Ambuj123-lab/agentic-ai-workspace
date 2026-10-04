import React from 'react';

export default function Loading({
  title = "Initializing Autonomous Workspace",
  subtitle = "LangGraph ReAct • FastMCP Protocol • MongoDB Atlas",
  badge = "AGENT RUNTIME ACTIVE",
}) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      width: '100vw',
      height: '100vh',
      background: '#000000',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
      fontFamily: "'Outfit', 'Inter', -apple-system, sans-serif",
      overflow: 'hidden',
    }}>
      {/* Ambient Radial Core Glow */}
      <div style={{
        position: 'absolute',
        width: '450px',
        height: '450px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(217, 70, 239, 0.18) 0%, rgba(16, 185, 129, 0.06) 45%, transparent 70%)',
        filter: 'blur(40px)',
        pointerEvents: 'none',
        animation: 'loaderGlowPulse 3s ease-in-out infinite',
      }} />

      {/* Cybernetic Orbital Reactor */}
      <div style={{ position: 'relative', width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}>
        {/* Outer Rotating Dashed Ring (Magenta Accent) */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          border: '2px dashed rgba(217, 70, 239, 0.65)',
          animation: 'spinClockwise 8s linear infinite',
        }} />

        {/* Middle Glowing High-Speed Ring (Emerald Accent) */}
        <div style={{
          position: 'absolute',
          inset: '12px',
          borderRadius: '50%',
          border: '2px solid transparent',
          borderTopColor: '#10b981',
          borderRightColor: 'rgba(16, 185, 129, 0.3)',
          animation: 'spinCounterClockwise 2.4s cubic-bezier(0.4, 0, 0.2, 1) infinite',
          boxShadow: '0 0 16px rgba(16, 185, 129, 0.35)',
        }} />

        {/* Inner Reactor Core (Pulsing Diamond / Hexagon) */}
        <div style={{
          position: 'relative',
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: 'rgba(28, 16, 38, 0.95)',
          border: '1.5px solid rgba(217, 70, 239, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 24px rgba(217, 70, 239, 0.6), inset 0 0 12px rgba(217, 70, 239, 0.35)',
          animation: 'corePulse 2s ease-in-out infinite',
        }}>
          {/* High-Tech Diamond SVG */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e879f9" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 2 12 12 22 22 12 12 2" />
          </svg>
        </div>
      </div>

      {/* Typography & System Diagnostics */}
      <div style={{ textAlign: 'center', zIndex: 2, padding: '0 20px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(217, 70, 239, 0.1)',
          border: '1px solid rgba(217, 70, 239, 0.35)',
          borderRadius: '20px',
          padding: '6px 16px',
          marginBottom: '16px',
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#d946ef', boxShadow: '0 0 8px #d946ef' }} />
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#e879f9', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'monospace' }}>
            {badge}
          </span>
        </div>

        <h2 style={{
          fontSize: 'clamp(1.2rem, 3.5vw, 1.5rem)',
          fontWeight: 800,
          color: '#ffffff',
          letterSpacing: '-0.02em',
          marginBottom: '8px',
        }}>
          {title}
        </h2>

        <p style={{
          fontSize: '0.85rem',
          color: '#94a3b8',
          letterSpacing: '0.02em',
          marginBottom: '24px',
          fontFamily: 'monospace',
        }}>
          {subtitle}
        </p>

        {/* Shimmering Linear Progress Bar */}
        <div style={{
          width: '240px',
          height: '3px',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '9999px',
          overflow: 'hidden',
          position: 'relative',
          margin: '0 auto',
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: '45%',
            background: 'linear-gradient(90deg, transparent 0%, #d946ef 50%, #34d399 100%)',
            borderRadius: '9999px',
            animation: 'shimmerSlide 1.8s ease-in-out infinite',
            boxShadow: '0 0 10px rgba(217, 70, 239, 0.8)',
          }} />
        </div>
      </div>

      <style>{`
        @keyframes spinClockwise {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes spinCounterClockwise {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }
        @keyframes corePulse {
          0%, 100% { transform: scale(1); filter: brightness(1); }
          50% { transform: scale(1.08); filter: brightness(1.25); }
        }
        @keyframes loaderGlowPulse {
          0%, 100% { opacity: 0.5; transform: scale(0.95); }
          50% { opacity: 0.85; transform: scale(1.05); }
        }
        @keyframes shimmerSlide {
          0% { left: -45%; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  );
}
