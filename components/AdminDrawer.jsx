'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const links = [
  { href: '/admin/orders', icon: 'assignment', label: 'Orders', desc: 'Manage customer orders' },
  { href: '/admin/inventory', icon: 'inventory_2', label: 'Inventory', desc: 'Products & pricing' },
  { href: '/', icon: 'home', label: 'Home', desc: 'Go to shop page' },
  { href: '/profile', icon: 'person', label: 'Profile', desc: 'Account settings' },
];

function DrawerPortal({ children }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(children, document.body);
}

export default function AdminDrawer() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  // Prevent body scroll when open
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <button onClick={() => setOpen(true)} className="hover:bg-soil/5 transition-colors" style={{ padding: 4, borderRadius: 10 }}>
        <span className="material-symbols-outlined text-soil/60" style={{ fontSize: 22 }}>menu</span>
      </button>

      {open && (
        <DrawerPortal>
          {/* Backdrop */}
          <div
            onClick={() => setOpen(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 9998,
              background: 'rgba(14,34,24,0.5)',
              backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
              animation: 'fadeUp 0.2s ease both',
            }}
          />

          {/* Drawer panel */}
          <div
            style={{
              position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 9999,
              width: 290, maxWidth: '80vw',
              background: 'var(--color-parchment)',
              boxShadow: '8px 0 40px rgba(14,34,24,0.15)',
              display: 'flex', flexDirection: 'column',
              animation: 'slideRight 0.3s cubic-bezier(0.22, 1, 0.36, 1) both',
            }}
          >
            {/* Header */}
            <div style={{ padding: '24px 20px 20px', background: 'linear-gradient(170deg, var(--color-forest-deep) 0%, var(--color-forest) 100%)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
                  <div className="flex items-center" style={{ gap: 4 }}>
                    <h2 className="font-display font-800 text-white" style={{ fontSize: 20 }}>Sanjay</h2>
                    <span className="font-body text-white/30" style={{ fontSize: 11 }}>Admin</span>
                  </div>
                  <button onClick={() => setOpen(false)} className="text-white/40 hover:text-white transition-colors" style={{ padding: 4 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
                  </button>
                </div>
                <div className="flex items-center" style={{ gap: 10 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="material-symbols-outlined text-white/80" style={{ fontSize: 22, fontVariationSettings: "'FILL' 1" }}>admin_panel_settings</span>
                  </div>
                  <div>
                    <p className="font-body font-600 text-white" style={{ fontSize: 14 }}>{user?.name || 'Admin'}</p>
                    <p className="font-body text-white/40" style={{ fontSize: 11 }}>{user?.phone ? `+91 ${user.phone}` : 'Administrator'}</p>
                  </div>
                </div>
              </div>
              {/* Decorative orb */}
              <div style={{ position: 'absolute', right: -20, top: -20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(232,168,56,0.08)' }} />
            </div>

            {/* Nav links */}
            <nav style={{ flex: 1, padding: '16px 0' }}>
              {links.map(item => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: '12px 20px', textDecoration: 'none',
                      background: active ? 'rgba(45,107,63,0.06)' : 'transparent',
                      borderLeft: active ? '3px solid var(--color-forest)' : '3px solid transparent',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{
                      width: 38, height: 38, borderRadius: 11,
                      background: active ? 'linear-gradient(160deg, var(--color-leaf) 0%, var(--color-forest) 100%)' : 'var(--color-sand)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: active ? '0 2px 8px rgba(26,58,42,0.15)' : 'none',
                      transition: 'all 0.2s ease',
                    }}>
                      <span className="material-symbols-outlined" style={{
                        fontSize: 18,
                        color: active ? '#fff' : 'var(--color-muted)',
                        fontVariationSettings: active ? "'FILL' 1" : undefined,
                      }}>{item.icon}</span>
                    </div>
                    <div>
                      <p className="font-body" style={{ fontSize: 14, fontWeight: active ? 700 : 500, color: active ? 'var(--color-forest)' : 'var(--color-soil)' }}>{item.label}</p>
                      <p className="font-body" style={{ fontSize: 10, color: 'var(--color-muted)', marginTop: 1 }}>{item.desc}</p>
                    </div>
                  </Link>
                );
              })}
            </nav>

            {/* Footer */}
            <div style={{ padding: '16px 20px', borderTop: '1px solid var(--color-khaki)' }}>
              <button
                onClick={() => { setOpen(false); logout(); router.push('/login'); }}
                className="w-full flex items-center justify-center transition-colors font-body font-600"
                style={{ gap: 8, padding: '12px 0', borderRadius: 14, border: '1px solid var(--color-terra)', fontSize: 13, color: 'var(--color-terra)' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>logout</span>
                Sign Out
              </button>
              <p className="font-body text-center" style={{ fontSize: 9, color: 'var(--color-dim)', marginTop: 12 }}>Sanjay Fruits & Vegetables</p>
            </div>
          </div>
        </DrawerPortal>
      )}
    </>
  );
}
