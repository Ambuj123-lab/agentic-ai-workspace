import React from 'react';

export default function Loading({
  title = "Initializing Autonomous Workspace",
  subtitle = "LangGraph ReAct · FastMCP Protocol · MongoDB Atlas",
  badge = "AGENT RUNTIME ACTIVE",
  progress = null,
}) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.96)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
      fontFamily: "'Outfit', 'Inter', -apple-system, sans-serif",
      overflow: 'hidden',
      animation: 'fadeInLoader 0.25s ease-out',
    }}>
      {/* Ambient Radial Core Glow */}
      <div style={{
        position: 'absolute',
        width: '520px',
        height: '520px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(217, 70, 239, 0.22) 0%, rgba(16, 185, 129, 0.08) 45%, transparent 70%)',
        filter: 'blur(50px)',
        pointerEvents: 'none',
        animation: 'loaderGlowPulse 2.4s ease-in-out infinite',
      }} />

      {/* Cybernetic Orbital Reactor */}
      <div style={{ position: 'relative', width: '130px', height: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '34px' }}>
        {/* Outer Rotating Dashed Ring (Magenta Accent) */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          border: '2.5px dashed rgba(217, 70, 239, 0.75)',
          animation: 'spinClockwise 4.5s linear infinite',
          boxShadow: '0 0 24px rgba(217, 70, 239, 0.35)',
        }} />

        {/* Middle Glowing High-Speed Ring (Emerald Accent) */}
        <div style={{
          position: 'absolute',
          inset: '12px',
          borderRadius: '50%',
          border: '2.5px solid transparent',
          borderTopColor: '#10b981',
          borderRightColor: 'rgba(16, 185, 129, 0.4)',
          animation: 'spinCounterClockwise 1.6s cubic-bezier(0.4, 0, 0.2, 1) infinite',
          boxShadow: '0 0 20px rgba(16, 185, 129, 0.45)',
        }} />

        {/* Inner Reactor Core (Pulsing Diamond / Hexagon) */}
        <div style={{
          position: 'relative',
          width: '52px',
          height: '52px',
          borderRadius: '14px',
          background: 'rgba(28, 14, 38, 0.95)',
          border: '1.5px solid rgba(217, 70, 239, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 28px rgba(217, 70, 239, 0.65), inset 0 0 14px rgba(217, 70, 239, 0.4)',
          animation: 'corePulse 1.6s ease-in-out infinite',
        }}>
          {/* High-Tech Diamond SVG */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f0abfc" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 6px #d946ef)' }}>
            <polygon points="12 2 2 12 12 22 22 12 12 2" />
          </svg>
        </div>
      </div>

      {/* Typography & System Diagnostics */}
      <div style={{ textAlign: 'center', zIndex: 2, padding: '0 24px', maxWidth: '520px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(217, 70, 239, 0.12)',
          border: '1px solid rgba(217, 70, 239, 0.4)',
          borderRadius: '20px',
          padding: '6px 16px',
          marginBottom: '16px',
          boxShadow: '0 0 16px rgba(217, 70, 239, 0.2)',
        }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#d946ef', boxShadow: '0 0 10px #d946ef', animation: 'blinkDot 1.2s infinite' }} />
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#f0abfc', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'monospace' }}>
            {badge}
          </span>
        </div>

        <h2 style={{
          fontSize: 'clamp(1.25rem, 3.5vw, 1.6rem)',
          fontWeight: 800,
          color: '#ffffff',
          letterSpacing: '-0.025em',
          marginBottom: '8px',
          textShadow: '0 2px 20px rgba(0, 0, 0, 0.9)',
        }}>
          {title}
        </h2>

        <p style={{
          fontSize: '0.88rem',
          color: '#94a3b8',
          letterSpacing: '0.01em',
          marginBottom: '26px',
          fontFamily: 'monospace',
          lineHeight: 1.5,
        }}>
          {subtitle}
        </p>

        {/* Dynamic Timed Progress Bar (Smooth 1.35s sweep) */}
        <div style={{
          width: '280px',
          height: '4px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '9999px',
          overflow: 'hidden',
          position: 'relative',
          margin: '0 auto',
          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)',
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            background: 'linear-gradient(90deg, #d946ef 0%, #a855f7 40%, #10b981 100%)',
            borderRadius: '9999px',
            animation: progress ? 'none' : 'timedProgressSweep 1.35s cubic-bezier(0.25, 1, 0.5, 1) forwards',
            width: progress ? `${progress}%` : '100%',
            boxShadow: '0 0 12px rgba(217, 70, 239, 0.9)',
          }} />
        </div>
      </div>

      <style>{`
        @keyframes fadeInLoader {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
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
          50% { transform: scale(1.12); filter: brightness(1.3); }
        }
        @keyframes loaderGlowPulse {
          0%, 100% { opacity: 0.6; transform: scale(0.96); }
          50% { opacity: 0.9; transform: scale(1.06); }
        }
        @keyframes blinkDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.75); }
        }
        @keyframes timedProgressSweep {
          0% { width: 4%; }
          30% { width: 42%; }
          65% { width: 78%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}
