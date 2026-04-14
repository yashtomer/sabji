'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import BottomNav from '@/components/BottomNav';

export default function Profile() {
  const router = useRouter();
  const { user, logout, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) router.push('/login');
    else setForm({ name: user.name || '', phone: user.phone || '', address: user.address || '' });
  }, [user, router]);

  if (!user) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile(form);
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 2000);
    } catch { }
    setSaving(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-parchment grain">
      {/* Header */}
      <div className="hero-rich grain" style={{ padding: '32px 20px 28px', borderRadius: '0 0 28px 28px' }}>
        <div className="relative z-10">
          <div className="flex items-center" style={{ gap: 12, marginBottom: 20 }}>
            <Link href="/" className="text-white/50 hover:text-white transition-colors" style={{ padding: 2 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 22 }}>arrow_back</span>
            </Link>
            <h1 className="font-display font-800 text-white" style={{ fontSize: 20 }}>Profile</h1>
          </div>
          <div className="flex items-center" style={{ gap: 14 }}>
            <div className="flex items-center justify-center" style={{ width: 56, height: 56, borderRadius: 18, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}>
              <span className="material-symbols-outlined text-white" style={{ fontSize: 28, fontVariationSettings: "'FILL' 1" }}>person</span>
            </div>
            <div>
              <h2 className="font-display font-700 text-white" style={{ fontSize: 20 }}>{user.name}</h2>
              <p className="font-body text-white/40" style={{ fontSize: 13, marginTop: 2 }}>
                {user.role === 'admin' ? 'Admin' : 'Customer'} {user.phone ? `• +91 ${user.phone}` : ''}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, padding: '20px 16px 88px' }}>
        {/* Edit Profile Card */}
        <div className="card-flat" style={{ padding: 16, marginBottom: 16 }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 14 }}>
            <h3 className="font-display font-700 text-soil" style={{ fontSize: 16 }}>Personal Details</h3>
            {!editing ? (
              <button onClick={() => setEditing(true)} className="font-body font-600 text-forest flex items-center" style={{ gap: 4, fontSize: 12 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>edit</span> Edit
              </button>
            ) : (
              <button onClick={() => { setEditing(false); setForm({ name: user.name || '', phone: user.phone || '', address: user.address || '' }); }} className="font-body font-500 text-muted" style={{ fontSize: 12 }}>
                Cancel
              </button>
            )}
          </div>

          {saved && (
            <div className="flex items-center" style={{ gap: 6, marginBottom: 12, padding: '8px 12px', borderRadius: 10, background: 'rgba(45,107,63,0.08)' }}>
              <span className="material-symbols-outlined text-leaf" style={{ fontSize: 16, fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <span className="font-body font-600 text-leaf" style={{ fontSize: 12 }}>Profile updated!</span>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Name */}
            <div>
              <label className="font-body font-600 text-muted uppercase" style={{ fontSize: 9, letterSpacing: '0.12em', display: 'block', marginBottom: 4 }}>Name</label>
              {editing ? (
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full font-body font-500 text-soil outline-none bg-sand focus:ring-2 focus:ring-forest/10" style={{ padding: '10px 12px', borderRadius: 12, fontSize: 14, border: '1px solid var(--color-khaki)' }} />
              ) : (
                <p className="font-body font-500 text-soil" style={{ fontSize: 14, padding: '10px 0' }}>{user.name || '—'}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="font-body font-600 text-muted uppercase" style={{ fontSize: 9, letterSpacing: '0.12em', display: 'block', marginBottom: 4 }}>Phone Number</label>
              {editing ? (
                <div className="flex items-center overflow-hidden" style={{ borderRadius: 12, border: '1px solid var(--color-khaki)' }}>
                  <span className="font-body font-500 text-muted bg-sand" style={{ padding: '10px 12px', fontSize: 14 }}>+91</span>
                  <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })} className="flex-1 font-body font-500 text-soil outline-none" style={{ padding: '10px 12px', fontSize: 14 }} maxLength={10} />
                </div>
              ) : (
                <p className="font-body font-500 text-soil" style={{ fontSize: 14, padding: '10px 0' }}>{user.phone ? `+91 ${user.phone}` : '—'}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="font-body font-600 text-muted uppercase" style={{ fontSize: 9, letterSpacing: '0.12em', display: 'block', marginBottom: 4 }}>Delivery Address</label>
              {editing ? (
                <textarea value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="House No, Street, Landmark, City..." className="w-full font-body font-500 text-soil outline-none bg-sand focus:ring-2 focus:ring-forest/10" style={{ padding: '10px 12px', borderRadius: 12, fontSize: 14, border: '1px solid var(--color-khaki)', minHeight: 70, resize: 'vertical' }} />
              ) : (
                <p className="font-body font-500 text-soil" style={{ fontSize: 14, padding: '10px 0', lineHeight: 1.4 }}>{user.address || 'No address saved'}</p>
              )}
            </div>
          </div>

          {editing && (
            <button onClick={handleSave} disabled={saving} className={`w-full btn-forest font-body font-700 flex items-center justify-center ${saving ? 'opacity-60' : ''}`} style={{ padding: '12px 0', fontSize: 14, gap: 8, marginTop: 16 }}>
              {saving ? 'Saving...' : 'Save Changes'}
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{saving ? 'progress_activity' : 'check'}</span>
            </button>
          )}
        </div>

        {/* Menu */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { icon: 'shopping_bag', label: 'My Orders', href: '/orders', desc: 'View your order history' },
            { icon: 'headset_mic', label: 'Help & Support', href: '#', desc: 'Get help with your orders' },
            ...(user.role === 'admin' ? [
              { icon: 'assignment', label: 'Admin Orders', href: '/admin/orders', desc: 'Manage all orders' },
              { icon: 'inventory_2', label: 'Admin Inventory', href: '/admin/inventory', desc: 'Manage products & prices' },
            ] : []),
          ].map(item => (
            <Link key={item.label} href={item.href} className="card-flat flex items-center" style={{ padding: '14px 16px', gap: 14, textDecoration: 'none' }}>
              <div className="flex items-center justify-center" style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--color-sand)' }}>
                <span className="material-symbols-outlined text-forest" style={{ fontSize: 20, fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
              </div>
              <div style={{ flex: 1 }}>
                <p className="font-body font-600 text-soil" style={{ fontSize: 14 }}>{item.label}</p>
                <p className="font-body text-muted" style={{ fontSize: 11 }}>{item.desc}</p>
              </div>
              <span className="material-symbols-outlined text-dim" style={{ fontSize: 18 }}>chevron_right</span>
            </Link>
          ))}
        </div>

        {/* Sign Out */}
        <button onClick={() => { logout(); router.push('/login'); }} className="w-full flex items-center justify-center text-terra hover:bg-terra/5 transition-colors font-body font-600" style={{ gap: 8, padding: '14px 0', borderRadius: 16, border: '1px solid var(--color-terra)', fontSize: 14, marginTop: 24 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>logout</span>
          Sign Out
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
