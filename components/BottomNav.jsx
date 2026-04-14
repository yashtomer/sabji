'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', icon: 'storefront', label: 'Shop' },
  { href: '/categories', icon: 'category', label: 'Categories' },
  { href: '/cart', icon: 'shopping_bag', label: 'Cart' },
  { href: '/login', icon: 'person', label: 'Account' },
];

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto z-50" style={{ padding: '0 12px 10px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          height: 62,
          borderRadius: 20,
          background: 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(16px)',
          border: '1px solid var(--color-khaki)',
          boxShadow: '0 -2px 24px rgba(45,24,16,0.06), 0 4px 16px rgba(45,24,16,0.04)',
        }}
      >
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
                padding: '6px 16px',
                borderRadius: 14,
                position: 'relative',
                textDecoration: 'none',
                transition: 'all 0.25s ease',
                background: active ? 'var(--color-forest)' : 'transparent',
                minWidth: 60,
              }}
            >
              {/* Icon */}
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: 22,
                  color: active ? '#fff' : 'var(--color-dim)',
                  fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0",
                  transition: 'all 0.2s ease',
                }}
              >
                {item.icon}
              </span>

              {/* Label */}
              <span
                className="font-body"
                style={{
                  fontSize: 9,
                  marginTop: 2,
                  fontWeight: active ? 600 : 500,
                  color: active ? '#fff' : 'var(--color-dim)',
                  transition: 'color 0.2s ease',
                  letterSpacing: active ? '0.02em' : 0,
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
