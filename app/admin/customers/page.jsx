'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AppDrawer from '@/components/AppDrawer';

export default function AdminCustomers() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all, unpaid, paid

  useEffect(() => {
    if (!user || user.role !== 'admin') { router.push('/login'); return; }
    if (token) {
      fetch('/api/customers', { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json())
        .then(data => { if (Array.isArray(data)) setCustomers(data); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [user, token, router]);

  if (!user || user.role !== 'admin') return null;

  const totalPending = customers.reduce((sum, c) => sum + c.pendingBalance, 0);

  const filtered = customers.filter(c => {
    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!c.name.toLowerCase().includes(q) && !c.phone?.includes(q) && !c.username?.toLowerCase().includes(q)) return false;
    }
    // Status filter
    if (filter === 'unpaid') return c.pendingBalance > 0;
    if (filter === 'paid') return c.pendingBalance === 0;
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen bg-parchment grain">
      {/* Header */}
      <div className="bg-parchment/95 backdrop-blur-md sticky top-0 z-40" style={{ borderBottom: '1px solid var(--color-khaki)' }}>
        <div className="flex items-center justify-between" style={{ padding: '12px 20px' }}>
          <div className="flex items-center" style={{ gap: 12 }}>
            <AppDrawer />
            <div>
              <h1 className="font-display font-800 text-soil" style={{ fontSize: 17 }}>Customers</h1>
              <p className="font-body text-muted" style={{ fontSize: 10 }}>{customers.length} customers</p>
            </div>
          </div>
          {totalPending > 0 && (
            <div className="text-right">
              <p className="font-body text-terra font-700" style={{ fontSize: 9 }}>PENDING</p>
              <p className="font-display font-800 text-terra" style={{ fontSize: 16 }}>
                <span style={{ fontSize: 10, opacity: 0.6 }}>₹</span>{totalPending.toFixed(0)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: '12px 16px 0' }}>
        <div className="search-warm flex items-center" style={{ gap: 10, padding: '8px 14px' }}>
          <span className="material-symbols-outlined text-muted" style={{ fontSize: 18 }}>search</span>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or phone..." className="flex-1 outline-none bg-transparent text-soil placeholder:text-dim font-body font-500" style={{ fontSize: 14 }} />
          {search && <button onClick={() => setSearch('')} className="text-muted hover:text-soil"><span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span></button>}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex" style={{ padding: '10px 16px', gap: 6 }}>
        {[
          { key: 'all', label: 'All' },
          { key: 'unpaid', label: 'Unpaid' },
          { key: 'paid', label: 'Clear' },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className="font-body font-600"
            style={{
              padding: '6px 14px', borderRadius: 999, fontSize: 12,
              background: filter === f.key ? (f.key === 'unpaid' ? 'rgba(200,90,58,0.1)' : f.key === 'paid' ? 'rgba(45,107,63,0.08)' : 'var(--color-sand)') : 'transparent',
              color: filter === f.key ? (f.key === 'unpaid' ? 'var(--color-terra)' : f.key === 'paid' ? 'var(--color-forest)' : 'var(--color-soil)') : 'var(--color-muted)',
              border: filter === f.key ? 'none' : '1px solid var(--color-khaki)',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Customer list */}
      <div style={{ flex: 1, padding: '4px 16px 24px' }}>
        {loading ? (
          <div className="text-center" style={{ paddingTop: 40 }}>
            <span className="material-symbols-outlined text-muted animate-spin" style={{ fontSize: 28 }}>progress_activity</span>
            <p className="font-body text-muted" style={{ fontSize: 13, marginTop: 10 }}>Loading...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center" style={{ paddingTop: 40 }}>
            <span className="material-symbols-outlined text-dim" style={{ fontSize: 40 }}>people</span>
            <p className="font-display font-700 text-soil" style={{ fontSize: 16, marginTop: 10 }}>No customers found</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p className="font-body text-muted" style={{ fontSize: 10 }}>{filtered.length} results</p>
            {filtered.map(c => (
              <div key={c.id} className="card-flat" style={{ padding: 14 }}>
                <div className="flex items-start justify-between" style={{ marginBottom: 8 }}>
                  <div>
                    <p className="font-display font-700 text-soil" style={{ fontSize: 15 }}>{c.name}</p>
                    <p className="font-body text-muted" style={{ fontSize: 11, marginTop: 2 }}>
                      {c.phone ? `+91 ${c.phone}` : c.username}
                    </p>
                  </div>
                  {c.pendingBalance > 0 ? (
                    <span className="font-body font-700 text-terra bg-terra/8" style={{ fontSize: 10, padding: '3px 10px', borderRadius: 8 }}>
                      ₹{c.pendingBalance.toFixed(0)} due
                    </span>
                  ) : (
                    <span className="font-body font-700 text-forest bg-forest/8" style={{ fontSize: 10, padding: '3px 10px', borderRadius: 8 }}>
                      Clear
                    </span>
                  )}
                </div>

                <div className="flex" style={{ gap: 6, paddingTop: 8, borderTop: '1px solid var(--color-khaki)' }}>
                  <div style={{ flex: 1, textAlign: 'center' }}>
                    <p className="font-display font-700 text-soil" style={{ fontSize: 14 }}>{c.totalOrders}</p>
                    <p className="font-body text-muted" style={{ fontSize: 9 }}>Orders</p>
                  </div>
                  <div style={{ width: 1, background: 'var(--color-khaki)' }} />
                  <div style={{ flex: 1, textAlign: 'center' }}>
                    <p className="font-display font-700 text-forest" style={{ fontSize: 14 }}>₹{c.paidAmount.toFixed(0)}</p>
                    <p className="font-body text-muted" style={{ fontSize: 9 }}>Paid</p>
                  </div>
                  <div style={{ width: 1, background: 'var(--color-khaki)' }} />
                  <div style={{ flex: 1, textAlign: 'center' }}>
                    <p className="font-display font-700 text-terra" style={{ fontSize: 14 }}>₹{c.pendingBalance.toFixed(0)}</p>
                    <p className="font-body text-muted" style={{ fontSize: 9 }}>Pending</p>
                  </div>
                  <div style={{ width: 1, background: 'var(--color-khaki)' }} />
                  <div style={{ flex: 1, textAlign: 'center' }}>
                    <p className="font-display font-700 text-soil" style={{ fontSize: 14 }}>₹{c.totalSpent.toFixed(0)}</p>
                    <p className="font-body text-muted" style={{ fontSize: 9 }}>Total</p>
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
