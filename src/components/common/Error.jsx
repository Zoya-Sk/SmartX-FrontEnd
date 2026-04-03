import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Error = () => {
  const navigate = useNavigate();
  const glitchRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (glitchRef.current) {
        glitchRef.current.classList.add('glitch-active');
        setTimeout(() => {
          glitchRef.current?.classList.remove('glitch-active');
        }, 200);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Syne:wght@400;800&display=swap');

        .error-root {
          font-family: 'Syne', sans-serif;
          background: #0B0B0F;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          position: relative;
        }

        /* Subtle grid background */
        .error-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
        }

        /* Glow blob */
        .glow-blob {
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,215,0,0.07) 0%, transparent 70%);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          animation: pulse-blob 4s ease-in-out infinite;
        }

        @keyframes pulse-blob {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
          50% { transform: translate(-50%, -50%) scale(1.15); opacity: 1; }
        }

        .error-container {
          position: relative;
          z-index: 10;
          text-align: center;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
          animation: fade-up 0.7s cubic-bezier(0.16,1,0.3,1) both;
        }

        @keyframes fade-up {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* 404 big number */
        .error-code {
          font-family: 'Share Tech Mono', monospace;
          font-size: clamp(100px, 18vw, 180px);
          font-weight: 400;
          color: #ffffff;
          line-height: 1;
          letter-spacing: -4px;
          position: relative;
          user-select: none;
        }

        .error-code::after {
          content: attr(data-text);
          position: absolute;
          left: 2px;
          top: 0;
          color: #FFD700;
          clip-path: polygon(0 30%, 100% 30%, 100% 50%, 0 50%);
          opacity: 0;
          transition: opacity 0.1s;
        }

        .glitch-active .error-code::after {
          opacity: 1;
          animation: glitch-slice 0.2s steps(1) both;
        }

        @keyframes glitch-slice {
          0%   { clip-path: polygon(0 20%, 100% 20%, 100% 35%, 0 35%); transform: translate(-3px, 0); }
          33%  { clip-path: polygon(0 55%, 100% 55%, 100% 70%, 0 70%); transform: translate(3px, 0); }
          66%  { clip-path: polygon(0 10%, 100% 10%, 100% 25%, 0 25%); transform: translate(-2px, 0); }
          100% { clip-path: polygon(0 60%, 100% 60%, 100% 80%, 0 80%); transform: translate(0, 0); }
        }

        /* Divider line */
        .error-line {
          width: 60px;
          height: 2px;
          background: linear-gradient(90deg, transparent, #FFD700, transparent);
          margin: 1.2rem auto;
          animation: line-expand 0.8s 0.4s cubic-bezier(0.16,1,0.3,1) both;
        }

        @keyframes line-expand {
          from { width: 0; opacity: 0; }
          to   { width: 60px; opacity: 1; }
        }

        .error-title {
          font-size: clamp(18px, 3vw, 22px);
          font-weight: 800;
          color: #ffffff;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin: 0;
          animation: fade-up 0.7s 0.3s cubic-bezier(0.16,1,0.3,1) both;
        }

        .error-subtitle {
          font-family: 'Share Tech Mono', monospace;
          font-size: 13px;
          color: rgba(255,255,255,0.35);
          margin: 0.6rem 0 0;
          letter-spacing: 1px;
          animation: fade-up 0.7s 0.45s cubic-bezier(0.16,1,0.3,1) both;
        }

        /* Button */
        .error-btn {
          margin-top: 2.4rem;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 36px;
          background: transparent;
          border: 1px solid rgba(255,215,0,0.5);
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
          border-radius: 2px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: border-color 0.3s, color 0.3s;
          animation: fade-up 0.7s 0.6s cubic-bezier(0.16,1,0.3,1) both;
        }

        .error-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: #FFD700;
          transform: translateX(-105%);
          transition: transform 0.35s cubic-bezier(0.16,1,0.3,1);
          z-index: 0;
        }

        .error-btn:hover::before { transform: translateX(0); }
        .error-btn:hover { border-color: #FFD700; color: #0B0B0F; }
        .error-btn span { position: relative; z-index: 1; }

        .arrow {
          position: relative;
          z-index: 1;
          transition: transform 0.3s;
        }
        .error-btn:hover .arrow { transform: translateX(5px); }

        /* Status tag */
        .error-tag {
          position: absolute;
          top: 2rem;
          left: 2rem;
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px;
          color: rgba(255,215,0,0.5);
          letter-spacing: 2px;
          text-transform: uppercase;
        }
      `}</style>

      <div className="error-root">
        <div className="glow-blob" />

        <span className="error-tag">// system.error</span>

        <div className="error-container" ref={glitchRef}>
          <div className="error-code" data-text="404">404</div>
          <div className="error-line" />
          <h1 className="error-title">Page Not Found</h1>
          <p className="error-subtitle">The page you're looking for doesn't exist or has been moved.</p>

          <button className="error-btn" onClick={() => navigate("/")}>
            <span>Return Home</span>
            <span className="arrow">→</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Error;