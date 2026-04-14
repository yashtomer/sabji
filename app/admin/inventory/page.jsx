'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export default function AdminInventory() {
  const { user, token, logout } = useAuth();
  const { allProducts, fetchAllProducts, updateProduct } = useCart();
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [localProducts, setLocalProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/login');
      return;
    }
  }, [user, router]);

  useEffect(() => {
    if (token) fetchAllProducts(token);
  }, [token]);

  useEffect(() => {
    setLocalProducts(allProducts.map(p => ({ ...p })));
  }, [allProducts]);

  if (!user || user.role !== 'admin') return null;

  const handleFieldChange = (id, field, value) => {
    setLocalProducts(prev => prev.map(p => p.id === id ? { ...p, [field]: field === 'price' ? (parseInt(value) || 0) : value } : p));
  };

  const handleAvailabilityToggle = (id) => {
    setLocalProducts(prev => prev.map(p => p.id === id ? { ...p, available: !p.available } : p));
  };

  const handleSave = async () => {
    for (const lp of localProducts) {
      const original = allProducts.find(p => p.id === lp.id);
      if (original && (original.price !== lp.price || original.available !== lp.available || original.name !== lp.name || original.unit !== lp.unit)) {
        await updateProduct(lp.id, { price: lp.price, available: lp.available, name: lp.name, unit: lp.unit }, token);
      }
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const availableCount = localProducts.filter(p => p.available).length;

  return (
    <div className="flex flex-col min-h-screen bg-parchment grain">
      {/* Header */}
      <div className="bg-parchment/95 backdrop-blur-md sticky top-0 z-40" style={{ borderBottom: '1px solid var(--color-khaki)' }}>
        <div className="flex items-center justify-between" style={{ padding: '12px 20px' }}>
          <div className="flex items-center" style={{ gap: 12 }}>
            <Link href="/admin/orders" className="text-soil/50" style={{ padding: 4 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_back</span>
            </Link>
            <div>
              <h1 className="font-display font-800 text-soil" style={{ fontSize: 17 }}>Inventory</h1>
              <p className="font-body text-muted" style={{ fontSize: 10 }}>{availableCount} of {localProducts.length} items live</p>
            </div>
          </div>
          <button
            onClick={handleSave}
            className={`font-body font-600 flex items-center ${saved ? 'bg-forest/10 text-forest' : 'btn-forest'}`}
            style={{ padding: '6px 14px', borderRadius: 10, gap: 4, fontSize: 11, transition: 'all 0.2s' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>{saved ? 'check' : 'save'}</span>
            {saved ? 'Saved!' : 'Save'}
          </button>
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: '12px 16px 0' }}>
        <div className="search-warm flex items-center" style={{ gap: 10, padding: '8px 14px' }}>
          <span className="material-symbols-outlined text-muted" style={{ fontSize: 18 }}>search</span>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="flex-1 outline-none bg-transparent text-soil placeholder:text-dim font-body font-500" style={{ fontSize: 14 }} />
          {search && <button onClick={() => setSearch('')} className="text-muted hover:text-soil"><span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span></button>}
        </div>
      </div>

      {/* Product list */}
      <div style={{ padding: '12px 16px', flex: 1 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {localProducts.filter(p => {
            if (!search.trim()) return true;
            const q = search.toLowerCase();
            return p.name.toLowerCase().includes(q) || (p.hindi && p.hindi.toLowerCase().includes(q));
          }).map(product => {
            const isEditing = editingId === product.id;
            return (
            <div
              key={product.id}
              className="card-flat"
              style={{ padding: 12, opacity: product.available ? 1 : 0.5, transition: 'opacity 0.2s' }}
            >
              {/* Main row */}
              <div className="flex items-center" style={{ gap: 12 }}>
                <img src={product.image} alt={product.name} className="rounded-xl object-cover flex-shrink-0" style={{ width: 48, height: 48 }} />
                <div className="flex-1 min-w-0" style={{ cursor: 'pointer' }} onClick={() => setEditingId(isEditing ? null : product.id)}>
                  <p className="font-display font-700 text-soil truncate" style={{ fontSize: 13 }}>{product.name}</p>
                  <p className="font-body text-muted" style={{ fontSize: 10 }}>{product.unit}{product.hindi ? ` • ${product.hindi}` : ''}</p>
                </div>
                <div className="flex items-center bg-sand flex-shrink-0" style={{ borderRadius: 10, border: '1px solid var(--color-khaki)', padding: '0 8px' }}>
                  <span className="font-body font-500 text-muted" style={{ fontSize: 12 }}>{'\u20B9'}</span>
                  <input
                    type="number"
                    value={product.price}
                    onChange={e => handleFieldChange(product.id, 'price', e.target.value)}
                    className="font-body font-600 text-soil outline-none bg-transparent text-right"
                    style={{ width: 44, padding: '6px 0 6px 4px', fontSize: 13 }}
                  />
                </div>
              <label className="relative flex-shrink-0 cursor-pointer" style={{ width: 40, height: 22 }}>
                <input type="checkbox" checked={product.available} onChange={() => handleAvailabilityToggle(product.id)} className="sr-only" />
                <div style={{ width: 40, height: 22, borderRadius: 11, background: product.available ? 'var(--color-forest)' : 'var(--color-khaki)', transition: 'background 0.2s', position: 'relative' }}>
                  <div style={{ width: 18, height: 18, borderRadius: 9, background: 'white', position: 'absolute', top: 2, left: product.available ? 20 : 2, transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }} />
                </div>
              </label>
              </div>

              {/* Edit section */}
              {isEditing && (
                <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--color-khaki)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div>
                    <label className="font-body font-600 text-muted uppercase" style={{ fontSize: 8, letterSpacing: '0.1em' }}>Item Name</label>
                    <input type="text" value={product.name} onChange={e => handleFieldChange(product.id, 'name', e.target.value)} className="w-full font-body font-500 text-soil outline-none bg-sand" style={{ marginTop: 3, padding: '8px 10px', borderRadius: 10, fontSize: 13, border: '1px solid var(--color-khaki)' }} />
                  </div>
                  <div className="flex" style={{ gap: 8 }}>
                    <div style={{ flex: 1 }}>
                      <label className="font-body font-600 text-muted uppercase" style={{ fontSize: 8, letterSpacing: '0.1em' }}>Unit / Quantity</label>
                      <input type="text" value={product.unit} onChange={e => handleFieldChange(product.id, 'unit', e.target.value)} className="w-full font-body font-500 text-soil outline-none bg-sand" style={{ marginTop: 3, padding: '8px 10px', borderRadius: 10, fontSize: 13, border: '1px solid var(--color-khaki)' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label className="font-body font-600 text-muted uppercase" style={{ fontSize: 8, letterSpacing: '0.1em' }}>Hindi Name</label>
                      <input type="text" value={product.hindi || ''} onChange={e => handleFieldChange(product.id, 'hindi', e.target.value)} className="w-full font-body font-500 text-soil outline-none bg-sand" style={{ marginTop: 3, padding: '8px 10px', borderRadius: 10, fontSize: 13, border: '1px solid var(--color-khaki)' }} />
                    </div>
                  </div>
                  <button onClick={() => setEditingId(null)} className="font-body font-500 text-muted self-end" style={{ fontSize: 11, padding: '4px 8px' }}>Done</button>
                </div>
              )}
            </div>
          );
          })}
        </div>
      </div>

      {/* Bottom */}
      <div style={{ padding: '12px 16px 24px', borderTop: '1px solid var(--color-khaki)' }}>
        <div className="flex" style={{ gap: 8 }}>
          <Link href="/admin/orders" className="flex-1 btn-forest font-body font-600 text-center flex items-center justify-center" style={{ padding: '12px 0', fontSize: 12, gap: 6 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>receipt_long</span>
            Orders
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
