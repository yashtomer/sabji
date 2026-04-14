'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AdminOrders() {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/login');
      return;
    }
  }, [user, router]);

  useEffect(() => {
    if (token) {
      fetch('/api/orders', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => { setOrders(Array.isArray(data) ? data : []); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [token]);

  if (!user || user.role !== 'admin') return null;

  const filteredOrders = orders.filter(o => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return o.order_id?.toLowerCase().includes(q) || o.customer_name?.toLowerCase().includes(q) || o.items?.some(i => i.name?.toLowerCase().includes(q));
  });

  const updateStatus = async (id, field, value) => {
    await fetch(`/api/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ [field]: value }),
    });
    setOrders(prev => prev.map(o => o.id === id ? { ...o, [field]: value } : o));
  };

  const formatDate = (d) => {
    const dt = new Date(d);
    return dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) + ', ' +
      dt.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  return (
    <div className="flex flex-col min-h-screen bg-parchment grain">
      {/* Header */}
      <div className="bg-parchment/95 backdrop-blur-md sticky top-0 z-40" style={{ borderBottom: '1px solid var(--color-khaki)' }}>
        <div className="flex items-center justify-between" style={{ padding: '12px 20px' }}>
          <div>
            <h1 className="font-display font-800 text-soil" style={{ fontSize: 17 }}>Orders</h1>
            <p className="font-body text-muted" style={{ fontSize: 10 }}>Admin Dashboard</p>
          </div>
          <Link href="/admin/inventory" className="bg-forest/8 text-forest flex items-center font-body font-600" style={{ padding: '6px 12px', borderRadius: 10, gap: 4, fontSize: 11 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>inventory_2</span>
            Inventory
          </Link>
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: '12px 16px 0' }}>
        <div className="search-warm flex items-center" style={{ gap: 10, padding: '8px 14px' }}>
          <span className="material-symbols-outlined text-muted" style={{ fontSize: 18 }}>search</span>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search order ID, customer..." className="flex-1 outline-none bg-transparent text-soil placeholder:text-dim font-body font-500" style={{ fontSize: 14 }} />
          {search && <button onClick={() => setSearch('')} className="text-muted hover:text-soil"><span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span></button>}
        </div>
      </div>

      {/* Orders list */}
      <div style={{ padding: '12px 16px', flex: 1 }}>
        {loading ? (
          <p className="font-body text-muted text-center" style={{ fontSize: 12, paddingTop: 40 }}>Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="text-center" style={{ paddingTop: 40 }}>
            <span className="material-symbols-outlined text-muted/30" style={{ fontSize: 48 }}>receipt_long</span>
            <p className="font-display font-700 text-soil" style={{ fontSize: 16, marginTop: 12 }}>No orders yet</p>
            <p className="font-body text-muted" style={{ fontSize: 12, marginTop: 4 }}>Orders will appear here when customers place them</p>
          </div>
        ) : (
          <>
            <p className="font-body font-500 text-muted" style={{ fontSize: 10, marginBottom: 12 }}>{filteredOrders.length} of {orders.length} orders</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filteredOrders.map(order => (
                <div key={order.id} className="card-flat" style={{ padding: 14 }}>
                  <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
                    <div>
                      <p className="font-display font-700 text-soil" style={{ fontSize: 13 }}>{order.order_id}</p>
                      <p className="font-body text-muted" style={{ fontSize: 10 }}>{formatDate(order.created_at)}</p>
                    </div>
                    <span className={`font-body font-700 ${order.payment_status === 'Paid' ? 'text-forest bg-forest/8' : 'text-terra bg-terra/8'}`} style={{ fontSize: 9, padding: '3px 8px', borderRadius: 8 }}>
                      {order.payment_status}
                    </span>
                  </div>

                  <div style={{ marginBottom: 10 }}>
                    <p className="font-body font-600 text-soil" style={{ fontSize: 12 }}>{order.customer_name || 'Customer'}</p>
                    <p className="font-body text-muted" style={{ fontSize: 10, marginTop: 2 }}>
                      {order.items?.map(i => i.name).join(', ') || 'Items'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between" style={{ paddingTop: 10, borderTop: '1px solid var(--color-khaki)' }}>
                    <span className="font-display font-700 text-soil" style={{ fontSize: 15 }}>
                      <span style={{ fontSize: 10, opacity: 0.5 }}>{'\u20B9'}</span>{parseFloat(order.total).toFixed(0)}
                    </span>
                    <div className="flex items-center" style={{ gap: 6 }}>
                      <select
                        value={order.delivery_status}
                        onChange={e => updateStatus(order.id, 'delivery_status', e.target.value)}
                        className="font-body font-600 text-soil bg-sand outline-none cursor-pointer"
                        style={{ fontSize: 11, padding: '4px 8px', borderRadius: 8, border: '1px solid var(--color-khaki)' }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Dispatched">Dispatched</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                      <select
                        value={order.payment_status}
                        onChange={e => updateStatus(order.id, 'payment_status', e.target.value)}
                        className="font-body font-600 text-soil bg-sand outline-none cursor-pointer"
                        style={{ fontSize: 11, padding: '4px 8px', borderRadius: 8, border: '1px solid var(--color-khaki)' }}
                      >
                        <option value="Unpaid">Unpaid</option>
                        <option value="Paid">Paid</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Bottom */}
      <div style={{ padding: '12px 16px 24px', borderTop: '1px solid var(--color-khaki)' }}>
        <div className="flex" style={{ gap: 8 }}>
          <Link href="/admin/inventory" className="flex-1 btn-forest font-body font-600 text-center flex items-center justify-center" style={{ padding: '12px 0', fontSize: 12, gap: 6 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>inventory_2</span>
            Inventory
          </Link>
          <button onClick={() => { logout(); router.push('/login'); }} className="flex-1 font-body font-600 text-terra flex items-center justify-center" style={{ padding: '12px 0', fontSize: 12, gap: 6, borderRadius: 14, border: '1px solid var(--color-terra)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>logout</span>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
