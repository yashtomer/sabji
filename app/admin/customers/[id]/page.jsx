'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function CustomerOrders({ params }) {
  const { id } = use(params);
  const { user, token } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') { router.push('/login'); return; }
    if (!token) return;

    // Fetch all orders, filter by customer ID
    fetch('/api/orders', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          const customerOrders = data.filter(o => o.user_id === parseInt(id));
          setOrders(customerOrders);
          if (customerOrders.length > 0) {
            setCustomer({ name: customerOrders[0].customer_name });
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // Fetch customer details
    fetch('/api/customers', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          const c = data.find(c => c.id === parseInt(id));
          if (c) setCustomer(c);
        }
      });
  }, [user, token, id, router]);

  if (!user || user.role !== 'admin') return null;

  const pendingBalance = orders.filter(o => o.payment_status === 'Unpaid').reduce((s, o) => s + parseFloat(o.total), 0);

  const formatDate = (d) => {
    const dt = new Date(d);
    return dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) + ', ' +
      dt.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const updateStatus = async (orderId, field, value) => {
    await fetch(`/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ [field]: value }),
    });
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, [field]: value } : o));
  };

  return (
    <div className="flex flex-col min-h-screen bg-parchment grain">
      {/* Header */}
      <div className="bg-parchment/95 backdrop-blur-md sticky top-0 z-40" style={{ borderBottom: '1px solid var(--color-khaki)' }}>
        <div className="flex items-center justify-between" style={{ padding: '12px 20px' }}>
          <div className="flex items-center" style={{ gap: 12 }}>
            <Link href="/admin/customers" className="text-soil/50" style={{ padding: 4 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_back</span>
            </Link>
            <div>
              <h1 className="font-display font-800 text-soil" style={{ fontSize: 17 }}>{customer?.name || 'Customer'}</h1>
              <p className="font-body text-muted" style={{ fontSize: 10 }}>
                {customer?.phone ? `+91 ${customer.phone}` : ''}{customer?.address ? ` • ${customer.address}` : ''}
              </p>
            </div>
          </div>
          {pendingBalance > 0 && (
            <span className="font-display font-800 text-terra" style={{ fontSize: 16 }}>
              <span style={{ fontSize: 10, opacity: 0.6 }}>₹</span>{pendingBalance.toFixed(0)}
            </span>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="flex" style={{ padding: '12px 16px', gap: 6 }}>
        <div className="card-flat flex-1 text-center" style={{ padding: 10 }}>
          <p className="font-display font-700 text-soil" style={{ fontSize: 16 }}>{orders.length}</p>
          <p className="font-body text-muted" style={{ fontSize: 9 }}>Orders</p>
        </div>
        <div className="card-flat flex-1 text-center" style={{ padding: 10 }}>
          <p className="font-display font-700 text-forest" style={{ fontSize: 16 }}>₹{orders.filter(o => o.payment_status === 'Paid').reduce((s, o) => s + parseFloat(o.total), 0).toFixed(0)}</p>
          <p className="font-body text-muted" style={{ fontSize: 9 }}>Paid</p>
        </div>
        <div className="card-flat flex-1 text-center" style={{ padding: 10 }}>
          <p className="font-display font-700 text-terra" style={{ fontSize: 16 }}>₹{pendingBalance.toFixed(0)}</p>
          <p className="font-body text-muted" style={{ fontSize: 9 }}>Pending</p>
        </div>
      </div>

      {/* Orders */}
      <div style={{ flex: 1, padding: '4px 16px 24px' }}>
        {loading ? (
          <div className="text-center" style={{ paddingTop: 40 }}>
            <span className="material-symbols-outlined text-muted animate-spin" style={{ fontSize: 28 }}>progress_activity</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center" style={{ paddingTop: 40 }}>
            <span className="material-symbols-outlined text-dim" style={{ fontSize: 40 }}>receipt_long</span>
            <p className="font-display font-700 text-soil" style={{ fontSize: 16, marginTop: 10 }}>No orders</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {orders.map(order => (
              <div key={order.id} className="card-flat" style={{ padding: 14 }}>
                <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
                  <div>
                    <p className="font-display font-700 text-soil" style={{ fontSize: 14 }}>{order.order_id}</p>
                    <p className="font-body text-muted" style={{ fontSize: 10, marginTop: 1 }}>{formatDate(order.created_at)}</p>
                  </div>
                  <span className={`font-body font-700 ${order.payment_status === 'Paid' ? 'text-forest bg-forest/8' : 'text-terra bg-terra/8'}`} style={{ fontSize: 10, padding: '3px 10px', borderRadius: 8 }}>
                    {order.payment_status}
                  </span>
                </div>

                {order.items?.length > 0 && (
                  <div style={{ marginBottom: 10, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {order.items.map((item, i) => (
                      <span key={i} className="font-body text-soil bg-sand" style={{ fontSize: 10, padding: '3px 8px', borderRadius: 6 }}>
                        {item.name?.split('(')[0]?.trim()} x{item.quantity}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between" style={{ paddingTop: 8, borderTop: '1px solid var(--color-khaki)' }}>
                  <span className="font-display font-700 text-soil" style={{ fontSize: 16 }}>
                    <span style={{ fontSize: 10, opacity: 0.5 }}>₹</span>{parseFloat(order.total).toFixed(0)}
                  </span>
                  <div className="flex items-center" style={{ gap: 6 }}>
                    <select value={order.delivery_status} onChange={e => updateStatus(order.id, 'delivery_status', e.target.value)} className="font-body font-600 text-soil bg-sand outline-none cursor-pointer" style={{ fontSize: 11, padding: '4px 6px', borderRadius: 8, border: '1px solid var(--color-khaki)' }}>
                      <option value="Pending">Pending</option>
                      <option value="Dispatched">Dispatched</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                    <select value={order.payment_status} onChange={e => updateStatus(order.id, 'payment_status', e.target.value)} className="font-body font-600 text-soil bg-sand outline-none cursor-pointer" style={{ fontSize: 11, padding: '4px 6px', borderRadius: 8, border: '1px solid var(--color-khaki)' }}>
                      <option value="Unpaid">Unpaid</option>
                      <option value="Paid">Paid</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
