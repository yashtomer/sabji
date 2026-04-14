'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [allProducts, setAllProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setAllProducts(data); })
      .catch(() => {});
  }, []);

  const products = allProducts.filter(p => p.available);

  const fetchAllProducts = async (token) => {
    const res = await fetch('/api/products?all=true', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) setAllProducts(data);
    }
  };

  const updateProduct = async (id, updates, token) => {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      const updated = await res.json();
      setAllProducts(prev => prev.map(p => p.id === id ? updated : p));
    }
  };

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => setCart(prev => prev.filter(item => item.id !== productId));

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) { removeFromCart(productId); return; }
    setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => setCart([]);

  const applyPromo = (code) => {
    if (code.toUpperCase() === 'FARM20') { setPromoCode(code); setPromoApplied(true); return true; }
    return false;
  };

  const getSubtotal = () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const getDiscount = () => promoApplied ? 20 : 0;
  const getTotal = () => getSubtotal() - getDiscount();
  const getCartCount = () => cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart, products, allProducts, addToCart, removeFromCart, updateQuantity, updateProduct,
      fetchAllProducts, clearCart, applyPromo, promoCode, promoApplied,
      getSubtotal, getDiscount, getTotal, getCartCount,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
