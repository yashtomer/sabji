'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import BottomNav from '@/components/BottomNav';

export default function Profile() {
  const router = useRouter();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user) router.push('/login');
  }, [user, router]);

  if (!user) return null;

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
                {user.role === 'admin' ? 'Admin' : 'Customer'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div style={{ flex: 1, padding: '20px 16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { icon: 'shopping_bag', label: 'My Orders', href: '/cart', desc: 'View your order history' },
            { icon: 'location_on', label: 'Delivery Address', href: '#', desc: 'Manage your addresses' },
            { icon: 'headset_mic', label: 'Help & Support', href: '#', desc: 'Get help with your orders' },
            ...(user.role === 'admin' ? [
              { icon: 'assignment', label: 'Admin Orders', href: '/admin/orders', desc: 'Manage all orders' },
              { icon: 'inventory_2', label: 'Admin Inventory', href: '/admin/inventory', desc: 'Manage products & prices' },
            ] : []),
          ].map(item => (
            <Link
              key={item.label}
              href={item.href}
              className="card-flat flex items-center"
              style={{ padding: '14px 16px', gap: 14, textDecoration: 'none' }}
            >
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
        <button
          onClick={() => { logout(); router.push('/login'); }}
          className="w-full flex items-center justify-center text-terra hover:bg-terra/5 transition-colors font-body font-600"
          style={{ gap: 8, padding: '14px 0', borderRadius: 16, border: '1px solid var(--color-terra)', fontSize: 14, marginTop: 24 }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>logout</span>
          Sign Out
        </button>

        <p className="font-body text-dim text-center" style={{ fontSize: 11, marginTop: 20 }}>
          Sanjay Fruits & Vegetables v1.0
        </p>
      </div>

      <div style={{ height: 80 }} />
      <BottomNav />
    </div>
  );
}
