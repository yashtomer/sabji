'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import BottomNav from '@/components/BottomNav';

export default function Cart() {
  const router = useRouter();
  const {
    cart, updateQuantity,
    applyPromo, promoApplied, promoCode,
    getSubtotal, getDeliveryFee, getDiscount, getTotal
  } = useCart();
  const [code, setCode] = useState('');
  const [promoError, setPromoError] = useState('');

  const handleApplyPromo = () => {
    if (applyPromo(code)) setPromoError('');
    else setPromoError('Invalid promo code');
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-parchment grain">
        <div className="flex-1 flex flex-col items-center justify-center anim-fade-up" style={{ padding: 32 }}>
          <div className="bg-forest/5 flex items-center justify-center" style={{ width: 80, height: 80, borderRadius: 24, marginBottom: 20 }}>
            <span className="material-symbols-outlined text-forest/20" style={{ fontSize: 36 }}>shopping_bag</span>
          </div>
          <h2 className="font-display font-800 text-soil text-center" style={{ fontSize: 20 }}>Your cart is empty</h2>
          <p className="font-body text-muted text-center" style={{ fontSize: 13, marginTop: 4, marginBottom: 24 }}>Add some fresh veggies to get started!</p>
          <Link href="/" className="btn-forest font-body" style={{ padding: '12px 24px', fontSize: 13 }}>Browse Products</Link>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-parchment grain">
      <div style={{ flex: 1, paddingBottom: 80 }}>
        {/* Header */}
        <div className="flex items-center bg-parchment/95 backdrop-blur-md sticky top-0 z-40" style={{ gap: 12, padding: '12px 20px', borderBottom: '1px solid var(--color-khaki)' }}>
          <button onClick={() => router.push('/')} className="text-soil/50" style={{ padding: 4 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_back</span>
          </button>
          <h1 className="font-display font-800 text-soil" style={{ fontSize: 17 }}>Your Cart</h1>
          <span className="font-body text-muted" style={{ fontSize: 11, marginLeft: 'auto' }}>{cart.length} items</span>
        </div>

        {/* Items */}
        <div className="stagger" style={{ padding: '0 16px', marginTop: 12 }}>
          {cart.map((item, i) => (
            <div key={item.id} className="card-flat flex items-center anim-fade-up" style={{ padding: 12, gap: 12, marginBottom: 8 }}>
              <img src={item.image} alt={item.name} className="rounded-xl object-cover" style={{ width: 52, height: 52 }} />
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-700 text-soil truncate" style={{ fontSize: 12 }}>{item.name}</h3>
                <p className="font-body text-muted" style={{ fontSize: 10 }}>{item.unit}</p>
                <p className="price text-forest" style={{ fontSize: 14, marginTop: 2 }}><span className="sym">{'\u20B9'}</span>{item.price}</p>
              </div>
              <div className="qty-stepper">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>{'\u2212'}</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              </div>
            </div>
          ))}
        </div>

        {/* Promo */}
        <div style={{ padding: '0 16px', marginTop: 20 }}>
          <p className="font-body font-600 text-muted uppercase" style={{ fontSize: 10, letterSpacing: '0.12em', marginBottom: 8 }}>Offers & Coupons</p>
          <div className="flex" style={{ gap: 8 }}>
            <div className="flex-1 search-warm flex items-center" style={{ padding: '0 12px' }}>
              <span className="material-symbols-outlined text-forest" style={{ fontSize: 15, marginRight: 8 }}>sell</span>
              <input type="text" value={promoApplied ? promoCode : code} onChange={e => setCode(e.target.value)} placeholder="Enter Promo Code" disabled={promoApplied} className="flex-1 outline-none bg-transparent font-body font-500 text-soil" style={{ fontSize: 12, padding: '10px 0' }} />
            </div>
            <button onClick={handleApplyPromo} disabled={promoApplied} className={`font-body font-600 transition-all ${promoApplied ? 'bg-forest/8 text-forest' : 'btn-terra'}`} style={{ padding: '10px 16px', borderRadius: 14, fontSize: 11 }}>
              {promoApplied ? '\u2713 Applied' : 'Apply'}
            </button>
          </div>
          {promoError && <p className="text-terra font-body font-500" style={{ fontSize: 10, marginTop: 6 }}>{promoError}</p>}
        </div>

        {/* Bill */}
        <div style={{ padding: '0 16px', marginTop: 20, marginBottom: 16 }}>
          <div className="card-flat" style={{ padding: 16 }}>
            <h3 className="font-display font-700 text-soil" style={{ fontSize: 13, marginBottom: 12 }}>Bill Details</h3>
            <div style={{ fontSize: 12 }}>
              <div className="flex justify-between font-body" style={{ marginBottom: 8 }}>
                <span className="text-muted">Item Total</span>
                <span className="font-600 text-soil">{'\u20B9'}{getSubtotal().toFixed(2)}</span>
              </div>
              {promoApplied && (
                <div className="flex justify-between font-body text-forest" style={{ marginBottom: 8 }}>
                  <span className="font-500">Discount (FARM20)</span>
                  <span className="font-700">-{'\u20B9'}{getDiscount().toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center" style={{ paddingTop: 10, marginTop: 4, borderTop: '1px solid var(--color-khaki)' }}>
                <span className="font-body font-700 text-soil" style={{ fontSize: 13 }}>Total</span>
                <span className="price text-forest" style={{ fontSize: 20 }}><span className="sym">{'\u20B9'}</span>{getTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="sticky bottom-0 bg-parchment/90 backdrop-blur-xl" style={{ padding: 16, borderTop: '1px solid var(--color-khaki)' }}>
        <button onClick={() => router.push('/checkout')} className="w-full btn-forest font-body font-700 flex items-center justify-center" style={{ padding: '14px 0', fontSize: 13, gap: 8 }}>
          Proceed to Checkout
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
