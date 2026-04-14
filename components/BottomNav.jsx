'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const accountHref = user ? (user.role === 'admin' ? '/admin/orders' : '/cart') : '/login';

  const navItems = [
    { href: '/', icon: 'storefront', label: 'Shop' },
    { href: '/cart', icon: 'shopping_bag', label: 'Cart' },
    { href: accountHref, icon: 'person', label: user ? user.name : 'Account' },
  ];

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: 430,
      zIndex: 50,
      padding: '0 14px 14px',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        height: 62,
        borderRadius: 22,
        background: 'rgba(255,250,245,0.92)',
        backdropFilter: 'blur(20px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
        border: '1px solid rgba(232,224,212,0.7)',
        boxShadow: '0 -4px 30px rgba(45,24,16,0.05), 0 2px 8px rgba(45,24,16,0.03)',
      }}>
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                padding: active ? '8px 24px' : '8px 20px',
                borderRadius: 16,
                background: active ? 'linear-gradient(160deg, var(--color-leaf) 0%, var(--color-forest) 100%)' : 'transparent',
                boxShadow: active ? '0 2px 12px rgba(26,58,42,0.2)' : 'none',
                transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: 23,
                  color: active ? '#fff' : 'var(--color-dim)',
                  fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0",
                  transition: 'all 0.25s ease',
                }}
              >
                {item.icon}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 11,
                  marginTop: 2,
                  fontWeight: active ? 700 : 500,
                  color: active ? '#fff' : 'var(--color-dim)',
                  transition: 'all 0.25s ease',
                  letterSpacing: '0.02em',
                  lineHeight: 1,
                }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
