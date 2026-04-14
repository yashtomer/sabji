'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const links = [
  { href: '/', icon: 'home', label: 'Home', desc: 'Browse products' },
  { href: '/cart', icon: 'shopping_bag', label: 'Cart', desc: 'Your shopping cart' },
  { href: '/orders', icon: 'receipt_long', label: 'My Orders', desc: 'Order history' },
  { href: '/profile', icon: 'person', label: 'Profile', desc: 'Account settings' },
];

const adminLinks = [
  { href: '/admin/orders', icon: 'assignment', label: 'Manage Orders', desc: 'Admin order dashboard' },
  { href: '/admin/inventory', icon: 'inventory_2', label: 'Manage Inventory', desc: 'Products & pricing' },
  { href: '/admin/customers', icon: 'people', label: 'Customers', desc: 'Customer list & balances' },
];

function Portal({ children }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(children, document.body);
}

export default function AppDrawer() {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, token, logout, updateProfile } = useAuth();
  const fileRef = useRef(null);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const handleAvatarUpload = async (file) => {
    if (!file || !token) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/avatar', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        // Update local user state with new avatar
        const saved = JSON.parse(localStorage.getItem('sabji_user') || '{}');
        saved.avatar = data.url;
        localStorage.setItem('sabji_user', JSON.stringify(saved));
        if (updateProfile) await updateProfile({ avatar: data.url });
      }
    } catch {}
    setUploading(false);
  };

  const renderLink = (item, isAdminLink) => {
    const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
    const accentColor = isAdminLink ? 'var(--color-saffron)' : 'var(--color-forest)';
    const bgGrad = isAdminLink ? 'linear-gradient(160deg, var(--color-saffron), #d49520)' : 'linear-gradient(160deg, var(--color-leaf), var(--color-forest))';
    const bgLight = isAdminLink ? 'rgba(232,168,56,0.08)' : 'var(--color-sand)';

    return (
      <Link key={item.label} href={item.href} onClick={() => setOpen(false)} style={{
        display: 'flex', alignItems: 'center', gap: 14, padding: '11px 20px', textDecoration: 'none',
        background: active ? (isAdminLink ? 'rgba(232,168,56,0.06)' : 'rgba(45,107,63,0.06)') : 'transparent',
        borderLeft: active ? `3px solid ${accentColor}` : '3px solid transparent',
        transition: 'all 0.15s ease',
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: active ? bgGrad : bgLight,
          boxShadow: active ? `0 2px 8px ${isAdminLink ? 'rgba(232,168,56,0.15)' : 'rgba(26,58,42,0.15)'}` : 'none',
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18, color: active ? '#fff' : (isAdminLink ? 'var(--color-saffron)' : 'var(--color-muted)'), fontVariationSettings: active ? "'FILL' 1" : undefined }}>{item.icon}</span>
        </div>
        <div>
          <p className="font-body" style={{ fontSize: 14, fontWeight: active ? 700 : 500, color: active ? accentColor : 'var(--color-soil)' }}>{item.label}</p>
          <p className="font-body" style={{ fontSize: 10, color: 'var(--color-muted)' }}>{item.desc}</p>
        </div>
      </Link>
    );
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="hover:bg-soil/5 transition-colors" style={{ padding: 4, borderRadius: 10 }}>
        <span className="material-symbols-outlined text-soil/60" style={{ fontSize: 22 }}>menu</span>
      </button>

      {open && (
        <Portal>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 9998, background: 'rgba(14,34,24,0.5)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', animation: 'fadeUp 0.2s ease both' }} />

          <div style={{ position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 9999, width: 290, maxWidth: '80vw', background: 'var(--color-parchment)', boxShadow: '8px 0 40px rgba(14,34,24,0.15)', display: 'flex', flexDirection: 'column', animation: 'slideRight 0.3s cubic-bezier(0.22, 1, 0.36, 1) both' }}>

            {/* Header */}
            <div style={{ padding: '24px 20px 20px', background: 'linear-gradient(170deg, var(--color-forest-deep) 0%, var(--color-forest) 100%)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
                  <div className="flex items-center" style={{ gap: 6 }}>
                    <h2 className="font-display font-800 text-white" style={{ fontSize: 20 }}>Sanjay</h2>
                    <span className="font-body text-white/25" style={{ fontSize: 10 }}>Fruits & Vegetables</span>
                  </div>
                  <button onClick={() => setOpen(false)} className="text-white/40 hover:text-white transition-colors" style={{ padding: 4 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
                  </button>
                </div>

                {user ? (
                  <div className="flex items-center" style={{ gap: 12 }}>
                    {/* Avatar — tap to upload */}
                    <div
                      onClick={() => fileRef.current?.click()}
                      style={{ width: 48, height: 48, borderRadius: 14, overflow: 'hidden', border: '2px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer', position: 'relative' }}
                    >
                      {user.avatar ? (
                        <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span className="material-symbols-outlined text-white/70" style={{ fontSize: 24, fontVariationSettings: "'FILL' 1" }}>person</span>
                      )}
                      {uploading && (
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span className="material-symbols-outlined text-white animate-spin" style={{ fontSize: 18 }}>progress_activity</span>
                        </div>
                      )}
                      {!uploading && (
                        <div style={{ position: 'absolute', bottom: -1, right: -1, width: 18, height: 18, borderRadius: 6, background: 'var(--color-saffron)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 10, color: 'var(--color-soil)' }}>photo_camera</span>
                        </div>
                      )}
                      <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleAvatarUpload(e.target.files?.[0])} />
                    </div>
                    <div>
                      <p className="font-body font-600 text-white" style={{ fontSize: 15 }}>{user.name}</p>
                      <p className="font-body text-white/40" style={{ fontSize: 11 }}>
                        {isAdmin ? 'Administrator' : 'Customer'}{user.phone ? ` • +91 ${user.phone}` : ''}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="font-body text-white/40" style={{ fontSize: 12 }}>Sign in to place orders</p>
                )}
              </div>
              <div style={{ position: 'absolute', right: -20, top: -20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(232,168,56,0.08)' }} />
            </div>

            {/* Nav */}
            <nav style={{ flex: 1, padding: '14px 0', overflowY: 'auto' }}>
              {isAdmin && <p className="font-body font-600 uppercase" style={{ fontSize: 9, letterSpacing: '0.14em', color: 'var(--color-muted)', padding: '0 20px 8px' }}>General</p>}
              {links.map(item => renderLink(item, false))}

              {isAdmin && (
                <>
                  <div style={{ height: 1, background: 'var(--color-khaki)', margin: '12px 20px' }} />
                  <p className="font-body font-600 uppercase" style={{ fontSize: 9, letterSpacing: '0.14em', color: 'var(--color-saffron)', padding: '4px 20px 8px' }}>Admin</p>
                  {adminLinks.map(item => renderLink(item, true))}
                </>
              )}
            </nav>

            {/* Footer */}
            <div style={{ padding: '14px 20px', borderTop: '1px solid var(--color-khaki)' }}>
              {user ? (
                <button onClick={() => { setOpen(false); logout(); router.push('/login'); }} className="w-full flex items-center justify-center transition-colors font-body font-600" style={{ gap: 8, padding: '11px 0', borderRadius: 14, border: '1px solid var(--color-terra)', fontSize: 13, color: 'var(--color-terra)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>logout</span>Sign Out
                </button>
              ) : (
                <Link href="/login" onClick={() => setOpen(false)} className="w-full flex items-center justify-center transition-colors font-body font-600" style={{ gap: 8, padding: '11px 0', borderRadius: 14, background: 'linear-gradient(160deg, var(--color-leaf), var(--color-forest))', fontSize: 13, color: '#fff', textDecoration: 'none', boxShadow: '0 2px 10px rgba(26,58,42,0.2)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>login</span>Sign In
                </Link>
              )}
              <p className="font-body text-center" style={{ fontSize: 9, color: 'var(--color-dim)', marginTop: 10 }}>Sanjay Fruits & Vegetables</p>
            </div>
          </div>
        </Portal>
      )}
    </>
  );
}
