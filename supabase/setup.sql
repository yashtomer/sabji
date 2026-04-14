-- Sabji Database Setup — Run this in Supabase SQL Editor
-- https://supabase.com/dashboard/project/thlscqajffiijvrbisks/sql

-- 1. Create Tables
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(10) DEFAULT 'customer' CHECK (role IN ('admin','customer')),
  phone VARCHAR(15) DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  hindi VARCHAR(100) DEFAULT '',
  unit VARCHAR(50) DEFAULT '',
  price INT NOT NULL,
  available BOOLEAN DEFAULT TRUE,
  image VARCHAR(500) DEFAULT ''
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  order_id VARCHAR(20) UNIQUE NOT NULL,
  user_id INT REFERENCES users(id),
  total DECIMAL(10,2) NOT NULL,
  discount DECIMAL(10,2) DEFAULT 0,
  delivery_status VARCHAR(20) DEFAULT 'Pending' CHECK (delivery_status IN ('Pending','Dispatched','Delivered')),
  payment_status VARCHAR(10) DEFAULT 'Unpaid' CHECK (payment_status IN ('Unpaid','Paid')),
  address TEXT,
  phone VARCHAR(15) DEFAULT '',
  delivery_slot VARCHAR(50) DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(id),
  product_id INT REFERENCES products(id),
  quantity INT NOT NULL,
  price INT NOT NULL
);

-- 2. Seed Users (passwords are bcrypt hash of '123')
INSERT INTO users (id, username, password, name, role, phone) VALUES
  (1, 'sanjay', '$2a$10$8K1p/a0dL7kRZKFqq6xCJ.PSzSNoC0n8v8wK5a2fv1aRp2rDe5pHK', 'Sanjay', 'admin', '9876543210'),
  (2, 'yash', '$2a$10$8K1p/a0dL7kRZKFqq6xCJ.PSzSNoC0n8v8wK5a2fv1aRp2rDe5pHK', 'Yash', 'customer', '9876543211')
ON CONFLICT (username) DO UPDATE SET password = EXCLUDED.password, name = EXCLUDED.name, role = EXCLUDED.role;

-- 3. Seed Products
INSERT INTO products (id, name, hindi, unit, price, available, image) VALUES
  (1, 'Bananas (Kela)', 'केला', '1 Dozen (approx. 12kg)', 60, true, 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop'),
  (2, 'Watermelon (Tarbooj)', 'तरबूज', 'Per piece (approx. 3kg)', 120, true, 'https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?w=400&h=400&fit=crop'),
  (3, 'Muskmelon (Kharbuja)', 'खरबूजा', 'Per piece (approx. 800g)', 45, true, 'https://images.unsplash.com/photo-1571575173700-afb9492e6a50?w=400&h=400&fit=crop'),
  (4, 'Pomegranate (Anar)', 'अनार', 'Per kg', 180, true, 'https://images.unsplash.com/photo-1541344999736-83eca272f6fc?w=400&h=400&fit=crop'),
  (5, 'Okra (Bhindi)', 'भिंडी', 'Per 500g', 30, true, 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=400&h=400&fit=crop'),
  (6, 'Tomato (Tamatar)', 'टमाटर', 'Per kg', 40, true, 'https://images.unsplash.com/photo-1558818498-28c1e002b655?w=400&h=400&fit=crop'),
  (7, 'Onion (Pyaaz)', 'प्याज', 'Per kg', 35, true, 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&h=400&fit=crop'),
  (8, 'Potato (Aloo)', 'आलू', 'Per kg', 25, true, 'https://images.unsplash.com/photo-1590165482129-1b8b27698780?w=400&h=400&fit=crop'),
  (9, 'Green Chilli (Hari Mirch)', 'हरी मिर्च', 'Per 250g', 15, true, 'https://images.unsplash.com/photo-1526346698789-22fd84314424?w=400&h=400&fit=crop'),
  (10, 'Capsicum (Shimla Mirch)', 'शिमला मिर्च', 'Per kg', 60, true, 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&h=400&fit=crop'),
  (11, 'Carrot (Gajar)', 'गाजर', 'Per kg', 45, true, 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=400&fit=crop'),
  (12, 'Kaam Special Combo', 'कॉम्बो', 'Mixed pack', 199, true, 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=400&fit=crop'),
  (13, 'Alphonso Mango (Aam)', 'आम', 'Per kg', 200, true, 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400&h=400&fit=crop'),
  (14, 'Kiwi', 'कीवी', 'Per 3pc', 90, true, 'https://images.unsplash.com/photo-1616684000067-36952fde56ec?w=400&h=400&fit=crop'),
  (15, 'Peas (Matar)', 'मटर', 'Per 500g', 50, true, 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=400&h=400&fit=crop'),
  (16, 'Brinjal (Baingan)', 'बैंगन', 'Per 500g', 30, true, 'https://images.unsplash.com/photo-1613743983303-b3e89f8a2b80?w=400&h=400&fit=crop')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, hindi = EXCLUDED.hindi, unit = EXCLUDED.unit, price = EXCLUDED.price, image = EXCLUDED.image;

-- 4. Reset sequences
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));
