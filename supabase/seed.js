// Run: node supabase/seed.js
// Seeds users and products into Supabase

const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://thlscqajffiijvrbisks.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SERVICE_KEY) {
  // Try loading from .env.local
  const fs = require('fs');
  const envFile = fs.readFileSync('.env.local', 'utf8');
  const match = envFile.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/);
  if (match) {
    process.env.SUPABASE_SERVICE_ROLE_KEY = match[1].trim();
  }
}

const supabase = createClient(
  SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || SERVICE_KEY
);

const PRODUCTS = [
  { id: 1, name: 'Bananas (Kela)', hindi: 'केला', unit: '1 Dozen (approx. 12kg)', price: 60, available: true, image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop' },
  { id: 2, name: 'Watermelon (Tarbooj)', hindi: 'तरबूज', unit: 'Per piece (approx. 3kg)', price: 120, available: true, image: 'https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?w=400&h=400&fit=crop' },
  { id: 3, name: 'Muskmelon (Kharbuja)', hindi: 'खरबूजा', unit: 'Per piece (approx. 800g)', price: 45, available: true, image: 'https://images.unsplash.com/photo-1571575173700-afb9492e6a50?w=400&h=400&fit=crop' },
  { id: 4, name: 'Pomegranate (Anar)', hindi: 'अनार', unit: 'Per kg', price: 180, available: true, image: 'https://images.unsplash.com/photo-1541344999736-83eca272f6fc?w=400&h=400&fit=crop' },
  { id: 5, name: 'Okra (Bhindi)', hindi: 'भिंडी', unit: 'Per 500g', price: 30, available: true, image: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=400&h=400&fit=crop' },
  { id: 6, name: 'Tomato (Tamatar)', hindi: 'टमाटर', unit: 'Per kg', price: 40, available: true, image: 'https://images.unsplash.com/photo-1558818498-28c1e002b655?w=400&h=400&fit=crop' },
  { id: 7, name: 'Onion (Pyaaz)', hindi: 'प्याज', unit: 'Per kg', price: 35, available: true, image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&h=400&fit=crop' },
  { id: 8, name: 'Potato (Aloo)', hindi: 'आलू', unit: 'Per kg', price: 25, available: true, image: 'https://images.unsplash.com/photo-1590165482129-1b8b27698780?w=400&h=400&fit=crop' },
  { id: 9, name: 'Green Chilli (Hari Mirch)', hindi: 'हरी मिर्च', unit: 'Per 250g', price: 15, available: true, image: 'https://images.unsplash.com/photo-1526346698789-22fd84314424?w=400&h=400&fit=crop' },
  { id: 10, name: 'Capsicum (Shimla Mirch)', hindi: 'शिमला मिर्च', unit: 'Per kg', price: 60, available: true, image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&h=400&fit=crop' },
  { id: 11, name: 'Carrot (Gajar)', hindi: 'गाजर', unit: 'Per kg', price: 45, available: true, image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=400&fit=crop' },
  { id: 12, name: 'Kaam Special Combo', hindi: 'कॉम्बो', unit: 'Mixed pack', price: 199, available: true, image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=400&fit=crop' },
  { id: 13, name: 'Alphonso Mango (Aam)', hindi: 'आम', unit: 'Per kg', price: 200, available: true, image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400&h=400&fit=crop' },
  { id: 14, name: 'Kiwi', hindi: 'कीवी', unit: 'Per 3pc', price: 90, available: true, image: 'https://images.unsplash.com/photo-1616684000067-36952fde56ec?w=400&h=400&fit=crop' },
  { id: 15, name: 'Peas (Matar)', hindi: 'मटर', unit: 'Per 500g', price: 50, available: true, image: 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=400&h=400&fit=crop' },
  { id: 16, name: 'Brinjal (Baingan)', hindi: 'बैंगन', unit: 'Per 500g', price: 30, available: true, image: 'https://images.unsplash.com/photo-1613743983303-b3e89f8a2b80?w=400&h=400&fit=crop' },
];

async function seed() {
  console.log('Seeding users...');
  const adminPass = await bcrypt.hash('123', 10);
  const customerPass = await bcrypt.hash('123', 10);

  const { error: u1 } = await supabase.from('users').upsert(
    { id: 1, username: 'sanjay', password: adminPass, name: 'Sanjay', role: 'admin', phone: '9876543210' },
    { onConflict: 'username' }
  );
  if (u1) console.error('User sanjay error:', u1.message);

  const { error: u2 } = await supabase.from('users').upsert(
    { id: 2, username: 'yash', password: customerPass, name: 'Yash', role: 'customer', phone: '9876543211' },
    { onConflict: 'username' }
  );
  if (u2) console.error('User yash error:', u2.message);

  console.log('Seeding products...');
  const { error: pErr } = await supabase.from('products').upsert(PRODUCTS, { onConflict: 'id' });
  if (pErr) console.error('Products error:', pErr.message);

  console.log('✓ Seeded 2 users + 16 products');
}

seed().catch(err => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
