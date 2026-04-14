-- Users
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(10) DEFAULT 'customer' CHECK (role IN ('admin','customer')),
  phone VARCHAR(15) DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  hindi VARCHAR(100) DEFAULT '',
  unit VARCHAR(50) DEFAULT '',
  price INT NOT NULL,
  available BOOLEAN DEFAULT TRUE,
  image VARCHAR(500) DEFAULT ''
);

-- Orders
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

-- Order Items
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(id),
  product_id INT REFERENCES products(id),
  quantity INT NOT NULL,
  price INT NOT NULL
);
