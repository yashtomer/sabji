'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) return;
    setError('');
    setIsLoading(true);
    try {
      const user = await login(username, password);
      router.push(user.role === 'admin' ? '/admin/orders' : '/');
    } catch (err) {
      setError(err.message || 'Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-parchment">
      {/* --- HERO TOP --- */}
      <div className="hero-rich grain" style={{ padding: '48px 24px 40px', borderRadius: '0 0 32px 32px' }}>
        <div className="relative z-10">
          <div className="anim-fade-up" style={{ marginBottom: 32 }}>
            <h1 className="font-display font-800 text-white" style={{ fontSize: 28, lineHeight: 1, letterSpacing: '-0.02em' }}>Sanjay</h1>
            <p className="font-body text-white/40" style={{ fontSize: 11, marginTop: 4 }}>Fruits & Vegetables</p>
          </div>
          <div className="anim-fade-up" style={{ animationDelay: '100ms' }}>
            <h2 className="font-display font-700 text-white" style={{ fontSize: 22, lineHeight: 1.2, marginBottom: 6 }}>
              Welcome<br />
              <span className="text-saffron-light">back!</span>
            </h2>
            <p className="font-body text-white/35" style={{ fontSize: 12 }}>
              Sign in to order fresh fruits & vegetables
            </p>
          </div>
        </div>
        <div className="absolute opacity-20" style={{ right: 20, top: 30, width: 80, height: 80, borderRadius: '50%', background: 'radial-gradient(circle, var(--color-saffron) 0%, transparent 70%)' }} />
      </div>

      {/* --- FORM --- */}
      <div style={{ flex: 1, padding: '28px 20px 32px' }}>
        <form onSubmit={handleLogin}>
          {/* Username */}
          <div className="anim-fade-up" style={{ marginBottom: 16, animationDelay: '200ms' }}>
            <label className="font-body font-600 text-muted uppercase" style={{ fontSize: 9, letterSpacing: '0.12em', display: 'block', marginBottom: 6 }}>
              Username
            </label>
            <div className="flex items-center bg-sand" style={{ borderRadius: 14, border: '1.5px solid var(--color-khaki)' }}>
              <span className="material-symbols-outlined text-muted flex-shrink-0" style={{ fontSize: 18, marginLeft: 14 }}>person</span>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="flex-1 font-body font-500 text-soil outline-none bg-transparent placeholder:text-dim"
                style={{ padding: '12px 14px', fontSize: 13 }}
              />
            </div>
          </div>

          {/* Password */}
          <div className="anim-fade-up" style={{ marginBottom: 8, animationDelay: '260ms' }}>
            <label className="font-body font-600 text-muted uppercase" style={{ fontSize: 9, letterSpacing: '0.12em', display: 'block', marginBottom: 6 }}>
              Password
            </label>
            <div className="flex items-center bg-sand" style={{ borderRadius: 14, border: '1.5px solid var(--color-khaki)' }}>
              <span className="material-symbols-outlined text-muted flex-shrink-0" style={{ fontSize: 18, marginLeft: 14 }}>lock</span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="flex-1 font-body font-500 text-soil outline-none bg-transparent placeholder:text-dim"
                style={{ padding: '12px 14px', fontSize: 13 }}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-muted hover:text-soil transition-colors flex-shrink-0" style={{ padding: '8px 12px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{showPassword ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="flex items-center" style={{ gap: 6, marginBottom: 8, marginTop: 8 }}>
              <span className="material-symbols-outlined text-terra" style={{ fontSize: 14 }}>error</span>
              <p className="font-body font-500 text-terra" style={{ fontSize: 11 }}>{error}</p>
            </div>
          )}

          {/* Forgot password */}
          <div className="anim-fade-up" style={{ textAlign: 'right', marginBottom: 24, animationDelay: '300ms' }}>
            <Link href="/forgot-password" className="font-body font-600 text-forest hover:underline" style={{ fontSize: 11 }}>
              Forgot Password?
            </Link>
          </div>

          {/* Login button */}
          <button
            type="submit"
            disabled={!username || !password || isLoading}
            className={`w-full btn-forest font-body font-700 flex items-center justify-center anim-fade-up ${(!username || !password) ? 'opacity-50' : ''}`}
            style={{ padding: '14px 0', fontSize: 14, borderRadius: 16, gap: 8, animationDelay: '340ms', transition: 'opacity 0.2s' }}
          >
            {isLoading ? (
              <>
                <span className="material-symbols-outlined animate-spin" style={{ fontSize: 18 }}>progress_activity</span>
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
              </>
            )}
          </button>
        </form>

        {/* Sign up link */}
        <div className="text-center anim-fade-up" style={{ marginTop: 28, animationDelay: '380ms' }}>
          <p className="font-body text-muted" style={{ fontSize: 12 }}>
            New here?{' '}
            <Link href="/register" className="font-600 text-forest hover:underline">Create an Account</Link>
          </p>
        </div>
      </div>

      <div className="text-center" style={{ padding: '0 20px 24px' }}>
        <p className="font-body text-dim" style={{ fontSize: 9 }}>Farm Fresh, Daily Delivered</p>
      </div>
    </div>
  );
}
