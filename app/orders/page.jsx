'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import BottomNav from '@/components/BottomNav';

export default function MyOrders() {
  const router = useRouter();
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    if (token) {
      fetch('/api/orders', { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json())
        .then(data => { if (Array.isArray(data)) setOrders(data); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [user, token, router]);

  if (!user) return null;

  const formatDate = (d) => {
    const dt = new Date(d);
    return dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) + ', ' +
      dt.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const statusColor = (s) => {
    if (s === 'Delivered') return { bg: 'rgba(45,107,63,0.1)', color: 'var(--color-leaf)' };
    if (s === 'Dispatched') return { bg: 'rgba(232,168,56,0.1)', color: 'var(--color-saffron)' };
    return { bg: 'rgba(200,90,58,0.08)', color: 'var(--color-terra)' };
  };

  return (
    <div className="flex flex-col min-h-screen bg-parchment grain">
      {/* Header */}
      <div className="bg-parchment/95 backdrop-blur-md sticky top-0 z-40" style={{ borderBottom: '1px solid var(--color-khaki)' }}>
        <div className="flex items-center" style={{ gap: 12, padding: '14px 20px' }}>
          <Link href="/" className="text-soil/50" style={{ padding: 4 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 22 }}>arrow_back</span>
          </Link>
          <h1 className="font-display font-800 text-soil" style={{ fontSize: 19 }}>My Orders</h1>
        </div>
      </div>

      <div style={{ flex: 1, padding: '16px 16px 88px' }}>
        {loading ? (
          <div className="text-center" style={{ paddingTop: 60 }}>
            <span className="material-symbols-outlined text-muted animate-spin" style={{ fontSize: 32 }}>progress_activity</span>
            <p className="font-body text-muted" style={{ fontSize: 14, marginTop: 12 }}>Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center" style={{ paddingTop: 60 }}>
            <div className="flex items-center justify-center" style={{ width: 72, height: 72, borderRadius: 22, background: 'var(--color-sand)', margin: '0 auto 16px' }}>
              <span className="material-symbols-outlined text-dim" style={{ fontSize: 32 }}>receipt_long</span>
            </div>
            <h2 className="font-display font-700 text-soil" style={{ fontSize: 18 }}>No orders yet</h2>
            <p className="font-body text-muted" style={{ fontSize: 13, marginTop: 4, marginBottom: 24 }}>Your order history will appear here</p>
            <Link href="/" className="btn-forest font-body font-600 inline-flex items-center" style={{ padding: '12px 24px', fontSize: 14, gap: 8 }}>
              Start Shopping
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {orders.map(order => {
              const sc = statusColor(order.delivery_status);
              return (
                <div key={order.id} className="card-flat" style={{ padding: 16 }}>
                  {/* Top row */}
                  <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
                    <div>
                      <p className="font-display font-700 text-soil" style={{ fontSize: 15 }}>{order.order_id}</p>
                      <p className="font-body text-muted" style={{ fontSize: 11, marginTop: 2 }}>{formatDate(order.created_at)}</p>
                    </div>
                    <span className="font-body font-700" style={{ fontSize: 11, padding: '4px 10px', borderRadius: 10, background: sc.bg, color: sc.color }}>
                      {order.delivery_status}
                    </span>
                  </div>

                  {/* Items */}
                  {order.items?.length > 0 && (
                    <div style={{ marginBottom: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {order.items.slice(0, 4).map((item, i) => (
                        <div key={i} className="flex items-center" style={{ gap: 6, background: 'var(--color-sand)', padding: '4px 10px 4px 4px', borderRadius: 10 }}>
                          {item.image && <img src={item.image} alt="" style={{ width: 24, height: 24, borderRadius: 6, objectFit: 'cover' }} />}
                          <span className="font-body font-500 text-soil" style={{ fontSize: 11 }}>{item.name?.split('(')[0]?.trim()}</span>
                          <span className="font-body text-muted" style={{ fontSize: 10 }}>x{item.quantity}</span>
                        </div>
                      ))}
                      {order.items.length > 4 && (
                        <span className="font-body text-muted" style={{ fontSize: 11, padding: '4px 8px' }}>+{order.items.length - 4} more</span>
                      )}
                    </div>
                  )}

                  {/* Bottom row */}
                  <div className="flex items-center justify-between" style={{ paddingTop: 10, borderTop: '1px solid var(--color-khaki)' }}>
                    <span className="price" style={{ fontSize: 18 }}>
                      <span className="sym">₹</span>{parseFloat(order.total).toFixed(0)}
                    </span>
                    <span className={`font-body font-700 ${order.payment_status === 'Paid' ? 'text-forest' : 'text-terra'}`} style={{ fontSize: 11, padding: '3px 10px', borderRadius: 8, background: order.payment_status === 'Paid' ? 'rgba(45,107,63,0.08)' : 'rgba(200,90,58,0.08)' }}>
                      {order.payment_status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
