'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', phone: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleRegister = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.password) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push('/');
    }, 800);
  };

  return (
    <div className="flex flex-col min-h-screen bg-parchment">
      {/* --- HERO TOP --- */}
      <div className="hero-rich grain" style={{ padding: '48px 24px 40px', borderRadius: '0 0 32px 32px' }}>
        <div className="relative z-10">
          {/* Back + Logo */}
          <div className="flex items-center anim-fade-up" style={{ gap: 12, marginBottom: 28 }}>
            <Link href="/login" className="text-white/50 hover:text-white transition-colors" style={{ padding: 2 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_back</span>
            </Link>
            <div>
              <h1 className="font-display font-800 text-white" style={{ fontSize: 20, lineHeight: 1 }}>Sanjay</h1>
              <p className="font-body text-white/40" style={{ fontSize: 9 }}>Fruits & Vegetables</p>
            </div>
          </div>

          {/* Welcome text */}
          <div className="anim-fade-up" style={{ animationDelay: '100ms' }}>
            <h2 className="font-display font-700 text-white" style={{ fontSize: 22, lineHeight: 1.2, marginBottom: 6 }}>
              Create your<br />
              <span className="text-saffron-light">account</span>
            </h2>
            <p className="font-body text-white/35" style={{ fontSize: 12 }}>
              Join us for farm-fresh deliveries
            </p>
          </div>
        </div>

        {/* Decorative */}
        <div className="absolute opacity-15" style={{ right: 16, top: 40, width: 90, height: 90, borderRadius: '50%', background: 'radial-gradient(circle, var(--color-saffron) 0%, transparent 70%)' }} />
      </div>

      {/* --- FORM --- */}
      <div style={{ flex: 1, padding: '28px 20px 32px' }}>
        <form onSubmit={handleRegister}>
          {/* Name */}
          <div className="anim-fade-up" style={{ marginBottom: 14, animationDelay: '180ms' }}>
            <label className="font-body font-600 text-muted uppercase" style={{ fontSize: 9, letterSpacing: '0.12em', display: 'block', marginBottom: 6 }}>
              Full Name
            </label>
            <div className="flex items-center bg-sand" style={{ borderRadius: 14, border: '1.5px solid var(--color-khaki)' }}>
              <span className="material-symbols-outlined text-muted flex-shrink-0" style={{ fontSize: 18, marginLeft: 14 }}>person</span>
              <input
                type="text"
                value={form.name}
                onChange={e => update('name', e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="flex-1 font-body font-500 text-soil outline-none bg-transparent placeholder:text-dim"
                style={{ padding: '12px 14px', fontSize: 13 }}
              />
            </div>
          </div>

          {/* Phone */}
          <div className="anim-fade-up" style={{ marginBottom: 14, animationDelay: '240ms' }}>
            <label className="font-body font-600 text-muted uppercase" style={{ fontSize: 9, letterSpacing: '0.12em', display: 'block', marginBottom: 6 }}>
              Phone Number
            </label>
            <div className="flex items-center overflow-hidden bg-sand" style={{ borderRadius: 14, border: '1.5px solid var(--color-khaki)' }}>
              <div className="flex items-center flex-shrink-0 bg-khaki/40" style={{ padding: '12px 12px', gap: 4 }}>
                <span className="font-body font-600 text-soil" style={{ fontSize: 13 }}>+91</span>
              </div>
              <input
                type="tel"
                value={form.phone}
                onChange={e => update('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="Enter mobile number"
                className="flex-1 font-body font-500 text-soil outline-none bg-transparent placeholder:text-dim"
                style={{ padding: '12px 14px', fontSize: 13 }}
                maxLength={10}
              />
              {form.phone.length === 10 && (
                <span className="material-symbols-outlined text-leaf flex-shrink-0" style={{ fontSize: 18, marginRight: 12, fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              )}
            </div>
          </div>

          {/* Password */}
          <div className="anim-fade-up" style={{ marginBottom: 24, animationDelay: '300ms' }}>
            <label className="font-body font-600 text-muted uppercase" style={{ fontSize: 9, letterSpacing: '0.12em', display: 'block', marginBottom: 6 }}>
              Create Password
            </label>
            <div className="flex items-center bg-sand" style={{ borderRadius: 14, border: '1.5px solid var(--color-khaki)' }}>
              <span className="material-symbols-outlined text-muted flex-shrink-0" style={{ fontSize: 18, marginLeft: 14 }}>lock</span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={e => update('password', e.target.value)}
                placeholder="Min 6 characters"
                className="flex-1 font-body font-500 text-soil outline-none bg-transparent placeholder:text-dim"
                style={{ padding: '12px 14px', fontSize: 13 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted hover:text-soil transition-colors flex-shrink-0"
                style={{ padding: '8px 12px' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {/* Register button */}
          <button
            type="submit"
            disabled={!form.name || !form.phone || !form.password || isLoading}
            className={`w-full btn-saffron font-body font-700 text-soil flex items-center justify-center anim-fade-up ${(!form.name || !form.phone || !form.password) ? 'opacity-50' : ''}`}
            style={{ padding: '14px 0', fontSize: 14, borderRadius: 16, gap: 8, animationDelay: '360ms', transition: 'opacity 0.2s' }}
          >
            {isLoading ? (
              <>
                <span className="material-symbols-outlined animate-spin" style={{ fontSize: 18 }}>progress_activity</span>
                Creating account...
              </>
            ) : (
              <>
                Create Account
                <span className="material-symbols-outlined text-soil" style={{ fontSize: 16 }}>arrow_forward</span>
              </>
            )}
          </button>
        </form>

        {/* Terms */}
        <p className="font-body text-dim text-center anim-fade-up" style={{ fontSize: 10, marginTop: 16, lineHeight: 1.5, animationDelay: '400ms' }}>
          By creating an account, you agree to our<br />
          <span className="text-forest font-500">Terms of Service</span> & <span className="text-forest font-500">Privacy Policy</span>
        </p>

        {/* Sign in link */}
        <div className="text-center anim-fade-up" style={{ marginTop: 28, animationDelay: '440ms' }}>
          <p className="font-body text-muted" style={{ fontSize: 12 }}>
            Already have an account?{' '}
            <Link href="/login" className="font-600 text-forest hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* --- BOTTOM BRANDING --- */}
      <div className="text-center" style={{ padding: '0 20px 24px' }}>
        <p className="font-body text-dim" style={{ fontSize: 9 }}>Farm Fresh, Daily Delivered</p>
      </div>
    </div>
  );
}
