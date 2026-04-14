'use client';

import { useCart } from '@/context/CartContext';

const BADGES = {
  1: { label: 'Fresh', bg: 'bg-forest', text: 'text-white' },
  4: { label: 'Rich', bg: 'bg-terra', text: 'text-white' },
  12: { label: 'Combo', bg: 'bg-saffron', text: 'text-soil' },
};

export default function ProductCard({ product }) {
  const { cart, addToCart, updateQuantity } = useCart();
  const cartItem = cart.find(item => item.id === product.id);
  const badge = BADGES[product.id];

  return (
    <div className="card-warm anim-scale-in flex flex-col">
      {/* Image */}
      <div className="relative aspect-square bg-sand overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 will-change-transform hover:scale-110"
          loading="lazy"
        />
        {badge && (
          <div
            className={`absolute ${badge.bg} ${badge.text} backdrop-blur-md font-body font-700 uppercase shadow-sm`}
            style={{ top: 10, left: 10, padding: '4px 10px', borderRadius: 8, fontSize: 10, letterSpacing: '0.06em' }}
          >
            {badge.label}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1" style={{ padding: 12 }}>
        <h3 className="font-display font-700 text-soil truncate" style={{ fontSize: 14, lineHeight: 1.2 }}>{product.name}</h3>
        <p className="font-body text-muted" style={{ fontSize: 12, marginTop: 3, marginBottom: 10 }}>{product.unit}</p>
        <div className="flex items-center justify-between" style={{ marginTop: 'auto' }}>
          <span className="price" style={{ fontSize: 19 }}>
            <span className="sym">{'\u20B9'}</span>{product.price}
          </span>
          {cartItem ? (
            <div className="qty-stepper">
              <button onClick={() => updateQuantity(product.id, cartItem.quantity - 1)}>{'\u2212'}</button>
              <span>{cartItem.quantity}</span>
              <button onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}>+</button>
            </div>
          ) : (
            <button
              onClick={() => addToCart(product)}
              className="btn-forest flex items-center justify-center active:scale-90 transition-transform"
              style={{ width: 34, height: 34, borderRadius: 12 }}
            >
              <span className="material-symbols-outlined text-white" style={{ fontSize: 18 }}>add</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
