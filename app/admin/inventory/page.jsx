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
  const [uploadingId, setUploadingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', hindi: '', unit: '', price: '' });
  const [adding, setAdding] = useState(false);

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

  const handleImageUpload = async (productId, file) => {
    if (!file) return;
    setUploadingId(productId);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('productId', productId);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setLocalProducts(prev => prev.map(p => p.id === productId ? { ...p, image: data.url } : p));
      }
    } catch {}
    setUploadingId(null);
  };

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.price) return;
    setAdding(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...newItem, price: parseInt(newItem.price) || 0 }),
      });
      if (res.ok) {
        const product = await res.json();
        setLocalProducts(prev => [...prev, product]);
        setNewItem({ name: '', hindi: '', unit: '', price: '' });
        setShowAddForm(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 1500);
      }
    } catch {}
    setAdding(false);
  };

  const handleDeleteItem = async (id, name) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setLocalProducts(prev => prev.filter(p => p.id !== id));
        setEditingId(null);
      }
    } catch {}
  };

  const handleSave = async () => {
    for (const lp of localProducts) {
      const original = allProducts.find(p => p.id === lp.id);
      if (original && (original.price !== lp.price || original.available !== lp.available || original.name !== lp.name || original.unit !== lp.unit || original.hindi !== lp.hindi)) {
        await updateProduct(lp.id, { price: lp.price, available: lp.available, name: lp.name, unit: lp.unit, hindi: lp.hindi }, token);
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
          <div className="flex items-center" style={{ gap: 6 }}>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="font-body font-600 flex items-center bg-saffron/10 text-saffron"
              style={{ padding: '6px 12px', borderRadius: 10, gap: 4, fontSize: 11 }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>add</span>Add
            </button>
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
      </div>

      {/* Add Item Form */}
      {showAddForm && (
        <div className="card-flat" style={{ margin: '12px 16px 0', padding: 14 }}>
          <h3 className="font-display font-700 text-soil" style={{ fontSize: 14, marginBottom: 10 }}>Add New Item</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div className="flex" style={{ gap: 8 }}>
              <div style={{ flex: 2 }}>
                <label className="font-body font-600 text-muted uppercase" style={{ fontSize: 8, letterSpacing: '0.1em' }}>Name *</label>
                <input type="text" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} placeholder="e.g. Potato (Aloo)" className="w-full font-body font-500 text-soil outline-none bg-sand" style={{ marginTop: 3, padding: '8px 10px', borderRadius: 10, fontSize: 13, border: '1px solid var(--color-khaki)' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label className="font-body font-600 text-muted uppercase" style={{ fontSize: 8, letterSpacing: '0.1em' }}>Price * (₹)</label>
                <input type="number" value={newItem.price} onChange={e => setNewItem({ ...newItem, price: e.target.value })} placeholder="50" className="w-full font-body font-500 text-soil outline-none bg-sand" style={{ marginTop: 3, padding: '8px 10px', borderRadius: 10, fontSize: 13, border: '1px solid var(--color-khaki)' }} />
              </div>
            </div>
            <div className="flex" style={{ gap: 8 }}>
              <div style={{ flex: 1 }}>
                <label className="font-body font-600 text-muted uppercase" style={{ fontSize: 8, letterSpacing: '0.1em' }}>Unit</label>
                <input type="text" value={newItem.unit} onChange={e => setNewItem({ ...newItem, unit: e.target.value })} placeholder="Per kg" className="w-full font-body font-500 text-soil outline-none bg-sand" style={{ marginTop: 3, padding: '8px 10px', borderRadius: 10, fontSize: 13, border: '1px solid var(--color-khaki)' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label className="font-body font-600 text-muted uppercase" style={{ fontSize: 8, letterSpacing: '0.1em' }}>Hindi Name</label>
                <input type="text" value={newItem.hindi} onChange={e => setNewItem({ ...newItem, hindi: e.target.value })} placeholder="आलू" className="w-full font-body font-500 text-soil outline-none bg-sand" style={{ marginTop: 3, padding: '8px 10px', borderRadius: 10, fontSize: 13, border: '1px solid var(--color-khaki)' }} />
              </div>
            </div>
            <div className="flex" style={{ gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={() => { setShowAddForm(false); setNewItem({ name: '', hindi: '', unit: '', price: '' }); }} className="font-body font-500 text-muted" style={{ fontSize: 12, padding: '6px 12px' }}>Cancel</button>
              <button onClick={handleAddItem} disabled={adding || !newItem.name || !newItem.price} className={`btn-forest font-body font-600 flex items-center ${!newItem.name || !newItem.price ? 'opacity-50' : ''}`} style={{ padding: '6px 16px', fontSize: 12, gap: 4 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>{adding ? 'progress_activity' : 'add'}</span>
                {adding ? 'Adding...' : 'Add Item'}
              </button>
            </div>
          </div>
        </div>
      )}

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
                  {/* Image upload */}
                  <div className="flex items-center" style={{ gap: 12 }}>
                    <div style={{ position: 'relative', width: 64, height: 64, borderRadius: 14, overflow: 'hidden', flexShrink: 0, border: '1px solid var(--color-khaki)' }}>
                      <img src={product.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      {uploadingId === product.id && (
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span className="material-symbols-outlined text-forest animate-spin" style={{ fontSize: 20 }}>progress_activity</span>
                        </div>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <label className="font-body font-600 text-muted uppercase" style={{ fontSize: 8, letterSpacing: '0.1em', display: 'block', marginBottom: 4 }}>Product Image</label>
                      <label className="flex items-center justify-center font-body font-600 text-forest cursor-pointer" style={{ gap: 4, padding: '6px 12px', borderRadius: 10, border: '1px solid var(--color-leaf)', fontSize: 11 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>upload</span>
                        {uploadingId === product.id ? 'Uploading...' : 'Change Image'}
                        <input type="file" accept="image/*" className="sr-only" onChange={e => handleImageUpload(product.id, e.target.files?.[0])} disabled={uploadingId === product.id} />
                      </label>
                    </div>
                  </div>
                  {/* Name */}
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
                  <button onClick={async () => {
                    const original = allProducts.find(p => p.id === product.id);
                    if (original && (original.name !== product.name || original.unit !== product.unit || original.price !== product.price || original.available !== product.available || original.hindi !== product.hindi)) {
                      await updateProduct(product.id, { name: product.name, unit: product.unit, price: product.price, available: product.available, hindi: product.hindi }, token);
                    }
                    setEditingId(null);
                    setSaved(true);
                    setTimeout(() => setSaved(false), 1500);
                  }} className="btn-forest font-body font-600 self-end flex items-center" style={{ fontSize: 11, padding: '6px 14px', gap: 4 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>check</span>Save & Close
                  </button>
                  <button onClick={() => handleDeleteItem(product.id, product.name)} className="font-body font-500 text-terra self-end flex items-center" style={{ fontSize: 11, padding: '6px 10px', gap: 4 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>delete</span>Delete
                  </button>
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
