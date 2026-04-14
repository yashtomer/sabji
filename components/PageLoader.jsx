'use client';

export default function PageLoader({ message }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 999,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(255,250,245,0.85)', backdropFilter: 'blur(8px)',
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 16,
        background: 'linear-gradient(160deg, var(--color-leaf) 0%, var(--color-forest) 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 20px rgba(26,58,42,0.2)',
        animation: 'pulseLoader 1.2s ease-in-out infinite',
      }}>
        <span className="material-symbols-outlined text-white" style={{ fontSize: 24, fontVariationSettings: "'FILL' 1" }}>eco</span>
      </div>
      {message && (
        <p className="font-body font-600 text-soil" style={{ fontSize: 13, marginTop: 14 }}>{message}</p>
      )}
      <style>{`
        @keyframes pulseLoader {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(0.9); opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
