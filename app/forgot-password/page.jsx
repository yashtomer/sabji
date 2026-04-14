'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPassword() {
  const [phone, setPhone] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (phone.length === 10) setSent(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-parchment">
      {/* Hero */}
      <div className="hero-rich grain" style={{ padding: '48px 24px 40px', borderRadius: '0 0 32px 32px' }}>
        <div className="relative z-10">
          <div className="flex items-center anim-fade-up" style={{ gap: 12, marginBottom: 28 }}>
            <Link href="/login" className="text-white/50 hover:text-white transition-colors" style={{ padding: 2 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_back</span>
            </Link>
            <div>
              <h1 className="font-display font-800 text-white" style={{ fontSize: 20, lineHeight: 1 }}>Sanjay</h1>
              <p className="font-body text-white/40" style={{ fontSize: 9 }}>Fruits & Vegetables</p>
            </div>
          </div>
          <div className="anim-fade-up" style={{ animationDelay: '100ms' }}>
            <h2 className="font-display font-700 text-white" style={{ fontSize: 22, lineHeight: 1.2, marginBottom: 6 }}>
              Forgot your<br /><span className="text-saffron-light">password?</span>
            </h2>
            <p className="font-body text-white/35" style={{ fontSize: 12 }}>
              We&apos;ll send a reset link to your phone
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div style={{ flex: 1, padding: '28px 20px 32px' }}>
        {sent ? (
          <div className="text-center anim-fade-up" style={{ paddingTop: 24 }}>
            <div className="bg-forest/8 flex items-center justify-center" style={{ width: 64, height: 64, borderRadius: 20, margin: '0 auto 20px' }}>
              <span className="material-symbols-outlined text-forest" style={{ fontSize: 28, fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>
            <h3 className="font-display font-700 text-soil" style={{ fontSize: 18, marginBottom: 6 }}>Reset Link Sent!</h3>
            <p className="font-body text-muted" style={{ fontSize: 12, lineHeight: 1.5, marginBottom: 28 }}>
              We&apos;ve sent a password reset link to<br />
              <span className="font-600 text-soil">+91 {phone}</span>
            </p>
            <Link href="/login" className="btn-forest font-body font-700 inline-flex items-center" style={{ padding: '12px 24px', fontSize: 13, gap: 8 }}>
              Back to Login
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="anim-fade-up" style={{ marginBottom: 24, animationDelay: '200ms' }}>
              <label className="font-body font-600 text-muted uppercase" style={{ fontSize: 9, letterSpacing: '0.12em', display: 'block', marginBottom: 6 }}>
                Phone Number
              </label>
              <div className="flex items-center overflow-hidden bg-sand" style={{ borderRadius: 14, border: '1.5px solid var(--color-khaki)' }}>
                <div className="flex items-center flex-shrink-0 bg-khaki/40" style={{ padding: '12px 12px' }}>
                  <span className="font-body font-600 text-soil" style={{ fontSize: 13 }}>+91</span>
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="Enter your mobile number"
                  className="flex-1 font-body font-500 text-soil outline-none bg-transparent placeholder:text-dim"
                  style={{ padding: '12px 14px', fontSize: 13 }}
                />
                {phone.length === 10 && (
                  <span className="material-symbols-outlined text-leaf flex-shrink-0" style={{ fontSize: 18, marginRight: 12, fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={phone.length !== 10}
              className={`w-full btn-forest font-body font-700 flex items-center justify-center anim-fade-up ${phone.length !== 10 ? 'opacity-50' : ''}`}
              style={{ padding: '14px 0', fontSize: 14, borderRadius: 16, gap: 8, animationDelay: '260ms', transition: 'opacity 0.2s' }}
            >
              Send Reset Link
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>send</span>
            </button>
          </form>
        )}

        <div className="text-center anim-fade-up" style={{ marginTop: 28, animationDelay: '320ms' }}>
          <p className="font-body text-muted" style={{ fontSize: 12 }}>
            Remember your password?{' '}
            <Link href="/login" className="font-600 text-forest hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
