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

  const handlePriceChange = (id, value) => {
    setLocalProducts(prev => prev.map(p => p.id === id ? { ...p, price: parseInt(value) || 0 } : p));
  };

  const handleAvailabilityToggle = (id) => {
    setLocalProducts(prev => prev.map(p => p.id === id ? { ...p, available: !p.available } : p));
  };

  const handleSave = async () => {
    for (const lp of localProducts) {
      const original = allProducts.find(p => p.id === lp.id);
      if (original && (original.price !== lp.price || original.available !== lp.available)) {
        await updateProduct(lp.id, { price: lp.price, available: lp.available }, token);
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

      {/* Product list */}
      <div style={{ padding: '12px 16px', flex: 1 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {localProducts.map(product => (
            <div
              key={product.id}
              className="card-flat flex items-center"
              style={{ padding: 12, gap: 12, opacity: product.available ? 1 : 0.5, transition: 'opacity 0.2s' }}
            >
              <img src={product.image} alt={product.name} className="rounded-xl object-cover flex-shrink-0" style={{ width: 48, height: 48 }} />
              <div className="flex-1 min-w-0">
                <p className="font-display font-700 text-soil truncate" style={{ fontSize: 12 }}>{product.name}</p>
                <p className="font-body text-muted" style={{ fontSize: 9 }}>{product.unit}</p>
              </div>
              <div className="flex items-center bg-sand flex-shrink-0" style={{ borderRadius: 10, border: '1px solid var(--color-khaki)', padding: '0 8px' }}>
                <span className="font-body font-500 text-muted" style={{ fontSize: 12 }}>{'\u20B9'}</span>
                <input
                  type="number"
                  value={product.price}
                  onChange={e => handlePriceChange(product.id, e.target.value)}
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
          ))}
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
