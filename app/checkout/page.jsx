'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function Checkout() {
  const router = useRouter();
  const { cart, getSubtotal, getDeliveryFee, getDiscount, getTotal, getCartCount, clearCart } = useCart();
  const { token } = useAuth();
  const [selectedSlot, setSelectedSlot] = useState('early');
  const [form, setForm] = useState({ fullName: '', phone: '', address: '' });

  const steps = ['DELIVERY', 'PAYMENT', 'REVIEW'];
  const slots = [
    { id: 'early', label: 'Early Morning', tag: 'FASTEST', time: 'Tomorrow, 6\u20139 AM' },
    { id: 'afternoon', label: 'Afternoon', tag: null, time: 'Tomorrow, 1\u20134 PM' },
    { id: 'evening', label: 'Evening', tag: null, time: 'Tomorrow, 5\u20138 PM' },
  ];

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!form.fullName || !form.phone || !form.address) { alert('Please fill in all shipping details'); return; }
    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          items: cart.map(i => ({ id: i.id, quantity: i.quantity, price: i.price })),
          address: form.address,
          phone: form.phone,
          delivery_slot: selectedSlot,
          delivery_fee: 0,
          discount: getDiscount(),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        clearCart();
        sessionStorage.setItem('orderData', JSON.stringify({ order: data.order, upi: data.upi }));
        router.push('/order-confirmed');
      } else {
        alert(data.error || 'Failed to place order');
      }
    } catch {
      alert('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (cart.length === 0) {
      router.push('/');
    }
  }, [cart.length, router]);

  if (cart.length === 0) return null;

  return (
    <div className="flex flex-col min-h-screen bg-parchment grain">
      {/* Header */}
      <div className="flex items-center bg-parchment/95 backdrop-blur-md sticky top-0 z-40" style={{ gap: 12, padding: '12px 20px', borderBottom: '1px solid var(--color-khaki)' }}>
        <button onClick={() => router.push('/cart')} className="text-soil/50" style={{ padding: 4 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_back</span>
        </button>
        <h1 className="font-display font-800 text-soil" style={{ fontSize: 17 }}>Checkout</h1>
      </div>

      {/* Steps */}
      <div className="flex items-center justify-center bg-white" style={{ gap: 6, padding: '12px 0', borderBottom: '1px solid var(--color-khaki)' }}>
        {steps.map((step, i) => (
          <div key={step} className="flex items-center" style={{ gap: 6 }}>
            <span className={`font-body font-600 ${i === 0 ? 'btn-forest' : 'bg-sand text-dim'}`} style={{ fontSize: 10, padding: '6px 12px', borderRadius: 999 }}>{step}</span>
            {i < steps.length - 1 && <div style={{ width: 20, height: 1, background: 'var(--color-khaki)' }} />}
          </div>
        ))}
      </div>

      <div style={{ flex: 1, padding: '16px 16px 112px' }}>
        {/* Shipping */}
        <div className="card-flat anim-fade-up" style={{ padding: 16, marginBottom: 12 }}>
          <h2 className="font-display font-700 text-soil flex items-center" style={{ fontSize: 14, gap: 8, marginBottom: 16 }}>
            <span className="btn-forest rounded-full flex items-center justify-center" style={{ width: 24, height: 24 }}>
              <span className="material-symbols-outlined text-white" style={{ fontSize: 12 }}>location_on</span>
            </span>
            Shipping Details
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label className="font-body font-600 text-muted uppercase" style={{ fontSize: 9, letterSpacing: '0.12em' }}>Full Name</label>
              <input type="text" placeholder="e.g. Rahul Sharma" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} className="w-full font-body font-500 text-soil outline-none focus:ring-2 focus:ring-forest/10 transition bg-sand" style={{ marginTop: 4, padding: '10px 12px', borderRadius: 12, fontSize: 12, border: '1px solid var(--color-khaki)' }} />
            </div>
            <div>
              <label className="font-body font-600 text-muted uppercase" style={{ fontSize: 9, letterSpacing: '0.12em' }}>Phone Number</label>
              <div className="flex items-center overflow-hidden" style={{ marginTop: 4, borderRadius: 12, border: '1px solid var(--color-khaki)' }}>
                <span className="font-body font-500 text-muted bg-sand" style={{ padding: '10px 12px', fontSize: 12 }}>+91</span>
                <input type="tel" placeholder="98765-43210" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="flex-1 font-body font-500 text-soil outline-none" style={{ padding: '10px 12px', fontSize: 12 }} />
              </div>
            </div>
            <div>
              <label className="font-body font-600 text-muted uppercase" style={{ fontSize: 9, letterSpacing: '0.12em' }}>Delivery Address</label>
              <input type="text" placeholder="House No, Street, City..." value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="w-full font-body font-500 text-soil outline-none focus:ring-2 focus:ring-forest/10 transition bg-sand" style={{ marginTop: 4, padding: '10px 12px', borderRadius: 12, fontSize: 12, border: '1px solid var(--color-khaki)' }} />
            </div>
          </div>
        </div>

        {/* Slots */}
        <div className="card-flat anim-fade-up" style={{ padding: 16, marginBottom: 12, animationDelay: '80ms' }}>
          <h2 className="font-display font-700 text-soil flex items-center" style={{ fontSize: 14, gap: 8, marginBottom: 16 }}>
            <span className="btn-forest rounded-full flex items-center justify-center" style={{ width: 24, height: 24 }}>
              <span className="material-symbols-outlined text-white" style={{ fontSize: 12 }}>schedule</span>
            </span>
            Preferred Slot
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {slots.map(slot => (
              <button key={slot.id} onClick={() => setSelectedSlot(slot.id)} className={`w-full flex items-center text-left transition-all ${selectedSlot === slot.id ? 'bg-forest/5 shadow-sm' : 'hover:bg-sand'}`} style={{ gap: 12, padding: 12, borderRadius: 12, border: `1.5px solid ${selectedSlot === slot.id ? 'var(--color-leaf)' : 'var(--color-khaki)'}` }}>
                <div className="flex items-center justify-center" style={{ width: 16, height: 16, borderRadius: 999, border: `2px solid ${selectedSlot === slot.id ? 'var(--color-forest)' : 'var(--color-khaki)'}` }}>
                  {selectedSlot === slot.id && <div className="bg-forest" style={{ width: 8, height: 8, borderRadius: 999 }} />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center" style={{ gap: 8 }}>
                    <span className="font-body font-600 text-soil" style={{ fontSize: 12 }}>{slot.label}</span>
                    {slot.tag && <span className="font-body font-700 text-terra bg-terra/10" style={{ fontSize: 8, padding: '2px 8px', borderRadius: 8 }}>{slot.tag}</span>}
                  </div>
                  <p className="font-body text-muted" style={{ fontSize: 10, marginTop: 2 }}>{slot.time}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="card-flat anim-fade-up" style={{ padding: 16, animationDelay: '160ms' }}>
          <h2 className="font-display font-700 text-soil" style={{ fontSize: 14, marginBottom: 12 }}>Order Summary</h2>
          <div className="flex items-center" style={{ gap: 8, marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid var(--color-khaki)' }}>
            <span className="material-symbols-outlined text-forest" style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}>shopping_bag</span>
            <span className="font-body font-600 text-soil" style={{ fontSize: 12 }}>{getCartCount()} Items in Cart</span>
          </div>
          <div className="font-body" style={{ fontSize: 12 }}>
            <div className="flex justify-between" style={{ marginBottom: 8 }}><span className="text-muted">Subtotal</span><span className="font-600">{'\u20B9'}{getSubtotal().toFixed(2)}</span></div>
            {getDiscount() > 0 && <div className="flex justify-between text-forest" style={{ marginBottom: 8 }}><span>Discount</span><span className="font-700">-{'\u20B9'}{getDiscount().toFixed(2)}</span></div>}
            <div className="flex justify-between items-center" style={{ paddingTop: 10, borderTop: '1px solid var(--color-khaki)' }}>
              <span className="font-700 text-soil" style={{ fontSize: 13 }}>Total</span>
              <span className="price text-forest" style={{ fontSize: 20 }}><span className="sym">{'\u20B9'}</span>{getTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="sticky bottom-0 bg-parchment/90 backdrop-blur-xl" style={{ padding: 16, borderTop: '1px solid var(--color-khaki)' }}>
        <button onClick={handleSubmit} disabled={submitting} className={`w-full btn-saffron font-body font-700 text-soil flex items-center justify-center ${submitting ? 'opacity-60' : ''}`} style={{ padding: '14px 0', fontSize: 13, gap: 8 }}>
          {submitting ? 'Placing Order...' : 'Place Order & Pay'}
          <span className="material-symbols-outlined text-soil" style={{ fontSize: 16 }}>{submitting ? 'progress_activity' : 'arrow_forward'}</span>
        </button>
      </div>
    </div>
  );
}
