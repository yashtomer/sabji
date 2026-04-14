'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import ProductCard from '@/components/ProductCard';
import BottomNav from '@/components/BottomNav';

const S = { page: { padding: '0 16px' }, mx: { marginLeft: 16, marginRight: 16 } };

const CATEGORIES = [
  { label: 'All', icon: 'apps' },
  { label: 'Leafy', icon: 'forest' },
  { label: 'Root', icon: 'nutrition' },
  { label: 'Exotic', icon: 'diamond' },
  { label: 'Seasonal', icon: 'wb_sunny' },
  { label: 'Organic', icon: 'eco' },
];

const LEAFY_IDS = [5, 9, 15];
const ROOT_IDS = [7, 8, 11];
const EXOTIC_IDS = [13, 14, 10];
const SEASONAL_IDS = [1, 2, 3, 4, 13];
const ORGANIC_IDS = [5, 6, 11, 15];

const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    location: 'Indirapuram, Ghaziabad',
    text: 'Azadpur mandi quality at my doorstep! Sabji is always fresh and prices are best.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
  },
  {
    name: 'Rahul Verma',
    location: 'Vaishali, Sector 4',
    text: 'Same day delivery in Vaishali! Mandi fresh sabji at reasonable prices.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
  },
  {
    name: 'Anita Desai',
    location: 'Crossing Republik',
    text: 'Best vegetable delivery near Indirapuram. Organic options are fantastic!',
    rating: 4,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
  },
];

export default function Home() {
  const { products, addToCart, getCartCount } = useCart();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const filtered = products.filter(p => {
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Leafy') return LEAFY_IDS.includes(p.id);
    if (activeCategory === 'Root') return ROOT_IDS.includes(p.id);
    if (activeCategory === 'Exotic') return EXOTIC_IDS.includes(p.id);
    if (activeCategory === 'Seasonal') return SEASONAL_IDS.includes(p.id);
    if (activeCategory === 'Organic') return ORGANIC_IDS.includes(p.id);
    return true;
  }).filter(p => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return p.name.toLowerCase().includes(q) || (p.hindi && p.hindi.includes(q));
  });

  const mango = products.find(p => p.id === 13);
  const kiwi = products.find(p => p.id === 14);
  const gridProducts = filtered.filter(p => p.id !== 13 && p.id !== 14);

  const extraFruits = [
    { name: 'Amrud', price: '\u20B9120', image: 'https://images.unsplash.com/photo-1536511132770-e5058c7e8c46?w=400&h=400&fit=crop' },
    { name: 'Chikoo', price: '\u20B9100', image: 'https://images.unsplash.com/photo-1611183060658-e03b3616eab6?w=400&h=400&fit=crop' },
    { name: 'Pineapple', price: '\u20B9100', image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400&h=400&fit=crop' },
  ];

  const cartCount = getCartCount();

  return (
    <div className="flex flex-col min-h-screen bg-parchment grain">
      {/* --- MOBILE DRAWER --- */}
      {menuOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setMenuOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(45,24,16,0.35)', backdropFilter: 'blur(4px)', animation: 'fadeUp 0.2s ease both' }}
          />
          {/* Drawer */}
          <div
            className="bg-parchment shadow-2xl flex flex-col"
            style={{ position: 'fixed', top: 0, left: 0, zIndex: 201, height: '100%', width: 280, animation: 'slideRight 0.3s cubic-bezier(0.22, 1, 0.36, 1) both' }}
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between" style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-khaki)' }}>
              <div className="flex items-center" style={{ gap: 4 }}>
                <h2 className="font-display font-800 text-forest" style={{ fontSize: 18 }}>Sanjay</h2>
                <span className="font-body text-muted font-500" style={{ fontSize: 10, marginLeft: 4 }}>Fruits & Vegetables</span>
              </div>
              <button onClick={() => setMenuOpen(false)} className="text-soil/40 hover:text-soil transition-colors" style={{ padding: 4 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1" style={{ padding: '12px 0' }}>
              {[
                { icon: 'storefront', label: 'Shop', href: '/' },
                { icon: 'category', label: 'Categories', href: '/categories' },
                { icon: 'shopping_bag', label: 'My Cart', href: '/cart' },
                { icon: 'receipt_long', label: 'My Orders', href: '/cart' },
                { icon: 'person', label: 'Profile', href: '/cart' },
                ...(user?.role === 'admin' ? [
                  { icon: 'assignment', label: 'Admin Orders', href: '/admin/orders' },
                  { icon: 'inventory_2', label: 'Admin Inventory', href: '/admin/inventory' },
                ] : []),
              ].map(item => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center hover:bg-forest/5 transition-colors ${item.label.startsWith('Admin') ? 'text-forest' : 'text-soil/70 hover:text-forest'}`}
                  style={{ gap: 14, padding: '12px 20px' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{item.icon}</span>
                  <span className="font-body font-500" style={{ fontSize: 14 }}>{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* Drawer footer */}
            <div style={{ padding: '16px 20px', borderTop: '1px solid var(--color-khaki)' }}>
              <div className="flex items-center" style={{ gap: 8, marginBottom: 12 }}>
                <span className="material-symbols-outlined text-forest" style={{ fontSize: 16, fontVariationSettings: "'FILL' 1" }}>headset_mic</span>
                <span className="font-body font-500 text-soil/60" style={{ fontSize: 12 }}>Need help? Call us</span>
              </div>
              <p className="font-display font-700 text-forest" style={{ fontSize: 14, marginBottom: 16 }}>+91 98765 43210</p>
              {user && <p className="font-body font-500 text-muted" style={{ fontSize: 10, marginBottom: 8 }}>Signed in as <span className="font-600 text-soil">{user.name}</span></p>}
              <button
                onClick={() => { setMenuOpen(false); logout(); router.push('/login'); }}
                className="w-full flex items-center justify-center text-terra hover:bg-terra/5 transition-colors font-body font-600"
                style={{ gap: 8, padding: '10px 0', borderRadius: 12, border: '1px solid var(--color-terra)', fontSize: 12 }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>logout</span>
                Sign Out
              </button>
              <p className="font-body text-muted text-center" style={{ fontSize: 9, marginTop: 12 }}>&copy; 2026 Sanjay. All rights reserved.</p>
            </div>
          </div>
        </>
      )}

      {/* --- HEADER --- */}
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50" style={{ animation: 'fadeUp 0.4s ease both' }}>
        <div className="flex justify-between items-center bg-parchment/95 backdrop-blur-md" style={{ height: 54, padding: '0 20px' }}>
          <div className="flex items-center" style={{ gap: 8 }}>
            <button onClick={() => setMenuOpen(true)} className="text-soil/50 rounded-xl hover:bg-soil/5 transition-colors" style={{ padding: 4 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>menu</span>
            </button>
            <div>
              <h1 className="font-display font-800 text-forest" style={{ fontSize: 17, letterSpacing: '-0.02em', lineHeight: 1 }}>Sanjay</h1>
              <p className="font-body text-muted font-500" style={{ fontSize: 8, lineHeight: 1 }}>Fruits & Vegetables</p>
            </div>
          </div>
          <Link href="/cart" className="relative rounded-xl hover:bg-soil/5 transition-colors" style={{ padding: 6 }}>
            <span className="material-symbols-outlined text-soil/60" style={{ fontSize: 20 }}>shopping_bag</span>
            {cartCount > 0 && (
              <span className="absolute bg-terra text-white font-body font-bold flex items-center justify-center rounded-full anim-bounce-in shadow-sm" style={{ fontSize: 8, width: 16, height: 16, top: -2, right: -2 }}>
                {cartCount}
              </span>
            )}
          </Link>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-khaki to-transparent" />
      </header>

      <main style={{ paddingTop: 58, paddingBottom: 16 }}>
        {/* --- HERO --- */}
        <section className="hero-rich grain anim-fade-up" style={{ ...S.mx, marginBottom: 16, borderRadius: 24, animationDelay: '60ms' }}>
          <div className="relative z-10" style={{ padding: '24px 20px 28px' }}>
            {/* Badge */}
            <div className="inline-flex items-center bg-saffron/20 backdrop-blur-sm rounded-full" style={{ gap: 6, padding: '4px 12px', marginBottom: 16 }}>
              <span className="material-symbols-outlined text-saffron" style={{ fontSize: 12, fontVariationSettings: "'FILL' 1" }}>verified</span>
              <span className="text-saffron font-body font-600 uppercase" style={{ fontSize: 9, letterSpacing: '0.14em' }}>Farm Verified</span>
            </div>

            {/* Headline */}
            <h2 className="font-display font-800 text-white" style={{ fontSize: 28, lineHeight: 1, letterSpacing: '-0.02em', marginBottom: 8 }}>
              Aaj sb fresh<br />
              <span className="text-saffron-light">aaya hai</span>
            </h2>
            <p className="text-white/40 font-body" style={{ fontSize: 12, lineHeight: 1.4, maxWidth: 200 }}>
              Picked at dawn, delivered by dusk.
            </p>

            {/* Stats row */}
            <div className="flex" style={{ gap: 20, marginTop: 20 }}>
              {[
                { val: '6AM', label: 'Delivery' },
                { val: '150+', label: 'Items' },
                { val: '4.9', label: 'Rating' },
              ].map(s => (
                <div key={s.label}>
                  <p className="font-display font-700 text-white" style={{ fontSize: 15, lineHeight: 1 }}>{s.val}</p>
                  <p className="text-white/30 font-body" style={{ fontSize: 9, marginTop: 2 }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero image peek */}
          <div className="absolute right-0 top-0 bottom-0 overflow-hidden" style={{ width: '40%', borderRadius: '0 24px 24px 0' }}>
            <img
              src="https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=600&fit=crop"
              alt=""
              className="w-full h-full object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-forest-deep via-forest-deep/80 to-transparent" />
          </div>
        </section>

        {/* --- SEARCH WITH AUTOCOMPLETE --- */}
        <div className="anim-fade-up" style={{ ...S.mx, marginBottom: 16, animationDelay: '140ms', position: 'relative', zIndex: 30 }}>
          <div className="search-warm flex items-center" style={{ gap: 10, padding: '10px 16px' }}>
            <span className="material-symbols-outlined text-muted" style={{ fontSize: 18 }}>search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search sabji, fruits..."
              className="flex-1 outline-none bg-transparent text-soil placeholder:text-dim font-body font-500"
              style={{ fontSize: 13 }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-muted hover:text-soil transition-colors">
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>
              </button>
            )}
          </div>
          {/* Autocomplete dropdown */}
          {searchQuery.trim().length > 0 && (() => {
            const q = searchQuery.toLowerCase();
            const matches = products.filter(p => p.name.toLowerCase().includes(q) || (p.hindi && p.hindi.includes(q))).slice(0, 5);
            if (matches.length === 0) return null;
            return (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4, background: 'white', borderRadius: 16, border: '1px solid var(--color-khaki)', boxShadow: '0 8px 24px rgba(45,24,16,0.1)', overflow: 'hidden', zIndex: 31 }}>
                {matches.map(p => (
                  <button
                    key={p.id}
                    onClick={() => { setSearchQuery(p.name); }}
                    style={{ display: 'flex', alignItems: 'center', width: '100%', gap: 10, padding: '10px 14px', textAlign: 'left', borderBottom: '1px solid var(--color-khaki)', background: 'none', border: 'none', cursor: 'pointer', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--color-sand)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    <img src={p.image} alt="" style={{ width: 36, height: 36, borderRadius: 10, objectFit: 'cover' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p className="font-display font-700 text-soil" style={{ fontSize: 12, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                      <p className="font-body text-muted" style={{ fontSize: 10 }}>{p.unit}</p>
                    </div>
                    <span className="price" style={{ fontSize: 14, flexShrink: 0 }}><span className="sym">₹</span>{p.price}</span>
                  </button>
                ))}
              </div>
            );
          })()}
        </div>

        {/* --- BENEFITS STRIP --- */}
        <div className="grid grid-cols-3 anim-fade-up" style={{ ...S.mx, gap: 8, marginBottom: 20, animationDelay: '190ms' }}>
          {[
            { icon: 'local_shipping', label: 'Free Delivery', sub: 'All Orders', bg: 'bg-forest/6', clr: 'text-forest' },
            { icon: 'schedule', label: 'Same Day', sub: 'Order by 2PM', bg: 'bg-terra/6', clr: 'text-terra' },
            { icon: 'eco', label: 'Farm Fresh', sub: '100% Natural', bg: 'bg-saffron/8', clr: 'text-saffron' },
          ].map(b => (
            <div key={b.label} className="flex flex-col items-center text-center bg-sand/60" style={{ padding: '12px 8px', borderRadius: 16 }}>
              <div className={`flex items-center justify-center ${b.bg}`} style={{ width: 36, height: 36, borderRadius: 12, marginBottom: 6 }}>
                <span className={`material-symbols-outlined ${b.clr}`} style={{ fontSize: 17, fontVariationSettings: "'FILL' 1" }}>{b.icon}</span>
              </div>
              <p className="font-body font-600 text-soil" style={{ fontSize: 10, lineHeight: 1.2 }}>{b.label}</p>
              <p className="font-body text-muted" style={{ fontSize: 9 }}>{b.sub}</p>
            </div>
          ))}
        </div>

        {/* --- CATEGORIES --- */}
        <section className="anim-fade-up" style={{ marginBottom: 16, paddingLeft: 16, animationDelay: '230ms' }}>
          <div className="chip-scroll" style={{ paddingRight: 16 }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.label}
                onClick={() => setActiveCategory(cat.label)}
                className={`flex items-center font-body font-600 transition-all duration-200 ${
                  activeCategory === cat.label
                    ? 'btn-forest'
                    : 'bg-sand text-muted hover:text-soil hover:bg-khaki'
                }`}
                style={{ gap: 6, padding: '8px 16px', borderRadius: 999, fontSize: 11 }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 14, fontVariationSettings: activeCategory === cat.label ? "'FILL' 1" : undefined }}>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </section>

        {/* --- SECTION HEADER --- */}
        <div className="flex items-end justify-between anim-fade-up" style={{ ...S.mx, marginBottom: 12, animationDelay: '270ms' }}>
          <div>
            <h2 className="section-label" style={{ fontSize: 18 }}>Fresh Picks</h2>
            <p className="font-body text-muted" style={{ fontSize: 10, marginTop: 2 }}>{gridProducts.length} items available today</p>
          </div>
        </div>

        {/* --- PRODUCT GRID --- */}
        <div className="grid grid-cols-2 stagger" style={{ ...S.mx, gap: 12 }}>
          {gridProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* --- MANGO FEATURE --- */}
        {mango && activeCategory === 'All' && (
          <div className="anim-fade-up" style={{ ...S.mx, marginTop: 20, borderRadius: 24, overflow: 'hidden', background: 'linear-gradient(135deg, #fef3e2 0%, #fde8c8 100%)' }}>
            <div className="flex" style={{ padding: 16, gap: 14 }}>
              <div className="bg-white/80 shadow-sm flex-shrink-0 overflow-hidden" style={{ width: 80, height: 80, borderRadius: 16 }}>
                <img className="w-full h-full object-cover" src={mango.image} alt={mango.name} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="inline-block font-body font-700 text-terra uppercase bg-terra/10" style={{ fontSize: 8, letterSpacing: '0.1em', padding: '2px 8px', borderRadius: 8, marginBottom: 4 }}>Season&#39;s Best</span>
                <h3 className="font-display font-700 text-soil" style={{ fontSize: 15, lineHeight: 1.2 }}>Aam (Mango)</h3>
                <p className="font-body text-muted" style={{ fontSize: 10, marginTop: 2, marginBottom: 10 }}>Premium Alphonso</p>
                <div className="flex items-center justify-between" style={{ gap: 8 }}>
                  <span className="price" style={{ fontSize: 17 }}><span className="sym">{'\u20B9'}</span>{mango.price}<span className="font-body text-muted font-500" style={{ fontSize: 9 }}>/kg</span></span>
                  <button onClick={() => addToCart(mango)} className="btn-terra flex items-center flex-shrink-0" style={{ padding: '6px 12px', gap: 4, fontSize: 10, borderRadius: 12 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 13 }}>add</span>Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- KIWI FEATURE --- */}
        {kiwi && activeCategory === 'All' && (
          <div className="bg-sand flex items-center anim-fade-up" style={{ ...S.mx, marginTop: 12, padding: 14, borderRadius: 24, gap: 14, border: '1px solid var(--color-khaki)' }}>
            <div className="bg-white shadow-sm flex-shrink-0 overflow-hidden" style={{ width: 56, height: 56, borderRadius: 12 }}>
              <img className="w-full h-full object-cover" src={kiwi.image} alt={kiwi.name} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between" style={{ marginBottom: 2 }}>
                <h3 className="font-display font-700 text-soil" style={{ fontSize: 13 }}>Kiwi Special</h3>
                <span className="font-body font-700 text-saffron bg-saffron/10" style={{ fontSize: 8, padding: '2px 8px', borderRadius: 8 }}>1 PKT</span>
              </div>
              <p className="font-body text-muted" style={{ fontSize: 10, marginBottom: 8 }}>Imported &middot; Vitamin C</p>
              <div className="flex items-center justify-between" style={{ gap: 8 }}>
                <span className="price" style={{ fontSize: 16 }}><span className="sym">{'\u20B9'}</span>{kiwi.price}</span>
                <button onClick={() => addToCart(kiwi)} className="btn-forest flex items-center flex-shrink-0" style={{ padding: '6px 12px', gap: 4, fontSize: 10, borderRadius: 12 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 12 }}>add</span>Add
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- MORE FRUITS --- */}
        {activeCategory === 'All' && (
          <div style={{ ...S.mx, marginTop: 24 }}>
            <h2 className="section-label" style={{ fontSize: 15, marginBottom: 12 }}>More Fruits</h2>
            <div className="grid grid-cols-3" style={{ gap: 10 }}>
              {extraFruits.map(fruit => (
                <div key={fruit.name} className="card-flat flex flex-col items-center group hover:shadow-md transition-all duration-300" style={{ padding: 10 }}>
                  <div className="w-full aspect-square bg-sand overflow-hidden" style={{ borderRadius: 12, marginBottom: 8 }}>
                    <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={fruit.image} alt={fruit.name} />
                  </div>
                  <p className="font-body font-600 text-soil text-center truncate w-full" style={{ fontSize: 10 }}>{fruit.name}</p>
                  <p className="font-display font-700 text-forest" style={{ fontSize: 11, marginTop: 2 }}>{fruit.price}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TESTIMONIALS --- */}
        <section style={{ marginTop: 28, marginBottom: 20 }}>
          <div className="flex items-center" style={{ gap: 8, marginBottom: 12, ...S.mx }}>
            <span className="material-symbols-outlined text-saffron" style={{ fontSize: 16, fontVariationSettings: "'FILL' 1" }}>star</span>
            <h2 className="section-label" style={{ fontSize: 15 }}>What Customers Say</h2>
          </div>
          <div className="testimonial-scroll" style={{ paddingLeft: 16, paddingRight: 8 }}>
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="card-flat flex flex-col" style={{ padding: 16 }}>
                <div className="flex" style={{ gap: 2, marginBottom: 10 }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="material-symbols-outlined" style={{ fontSize: 12, fontVariationSettings: "'FILL' 1", color: i < t.rating ? 'var(--color-saffron)' : 'var(--color-khaki)' }}>star</span>
                  ))}
                </div>
                <p className="font-body text-soil/70 italic flex-1" style={{ fontSize: 12, lineHeight: 1.5, marginBottom: 12 }}>&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center" style={{ gap: 10, paddingTop: 12, borderTop: '1px solid var(--color-khaki)' }}>
                  <img src={t.avatar} alt={t.name} className="rounded-full object-cover ring-2 ring-forest/10" style={{ width: 32, height: 32 }} />
                  <div>
                    <h4 className="font-body font-600 text-soil" style={{ fontSize: 11 }}>{t.name}</h4>
                    <p className="font-body text-muted" style={{ fontSize: 9 }}>{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- FOOTER --- */}
        <footer className="overflow-hidden" style={{ ...S.mx, borderRadius: 24, marginBottom: 8 }}>
          <div className="hero-rich grain text-white relative" style={{ padding: 20 }}>
            <div className="relative z-10">
              {/* Brand */}
              <div style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <h3 className="font-display font-800" style={{ fontSize: 18 }}>Sanjay</h3>
                <p className="font-body text-white/40" style={{ fontSize: 10 }}>Fruits & Vegetables</p>
              </div>

              {/* Delivery */}
              <div className="flex items-center" style={{ gap: 12, marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="bg-saffron/15 flex items-center justify-center flex-shrink-0" style={{ width: 36, height: 36, borderRadius: 10 }}>
                  <span className="material-symbols-outlined text-saffron" style={{ fontSize: 16, fontVariationSettings: "'FILL' 1" }}>local_shipping</span>
                </div>
                <div>
                  <h4 className="font-body font-600" style={{ fontSize: 12 }}>Free Delivery on All Orders</h4>
                  <p className="font-body text-white/30" style={{ fontSize: 10, marginTop: 1 }}>Early morning slots available</p>
                </div>
              </div>

              {/* Contact */}
              <div style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="font-body font-600 text-white/25 uppercase" style={{ fontSize: 9, letterSpacing: '0.15em', marginBottom: 10 }}>Contact Us</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div className="flex items-center" style={{ gap: 8 }}>
                    <span className="material-symbols-outlined text-white/25" style={{ fontSize: 14 }}>phone</span>
                    <span className="font-body text-white/50" style={{ fontSize: 11 }}>+91 98765 43210</span>
                  </div>
                  <div className="flex items-center" style={{ gap: 8 }}>
                    <span className="material-symbols-outlined text-white/25" style={{ fontSize: 14 }}>mail</span>
                    <span className="font-body text-white/50" style={{ fontSize: 11 }}>hello@sanjayfruits.in</span>
                  </div>
                  <div className="flex items-start" style={{ gap: 8 }}>
                    <span className="material-symbols-outlined text-white/25" style={{ fontSize: 14, marginTop: 1 }}>location_on</span>
                    <span className="font-body text-white/50" style={{ fontSize: 11, lineHeight: 1.4 }}>Sector 45, Gurgaon, Haryana</span>
                  </div>
                </div>
              </div>

              <p className="font-body text-white/15 text-center" style={{ fontSize: 9 }}>
                &copy; 2026 Sanjay Fruits & Vegetables. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </main>

      <div style={{ height: 88 }} />

      {/* --- FLOATING CART FAB --- */}
      {cartCount > 0 && (
        <Link href="/cart" className="cart-fab btn-saffron flex items-center justify-center shadow-xl anim-bounce-in" style={{ width: 48, height: 48, borderRadius: 16 }}>
          <span className="material-symbols-outlined text-soil" style={{ fontSize: 20, fontVariationSettings: "'FILL' 1" }}>shopping_bag</span>
          <span className="absolute bg-terra text-white font-body font-700 rounded-full flex items-center justify-center" style={{ fontSize: 9, width: 18, height: 18, top: -4, right: -4 }}>{cartCount}</span>
        </Link>
      )}

      <BottomNav />
    </div>
  );
}
