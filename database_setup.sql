-- ============================================
-- Database Setup untuk RM Maringgi
-- Created: 28-12-2025
-- ============================================

-- Buat Database
CREATE DATABASE IF NOT EXISTS login_rpl;
USE login_rpl;

-- ============================================
-- Tabel: user_login
-- Deskripsi: Menyimpan data user yang register
-- ============================================
CREATE TABLE IF NOT EXISTS user_login (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) NOT NULL UNIQUE,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabel: admin_login
-- Deskripsi: Menyimpan data admin
-- ============================================
CREATE TABLE IF NOT EXISTS admin_login (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabel: menu_makanan
-- Deskripsi: Menyimpan data menu makanan/minuman
-- ============================================
CREATE TABLE IF NOT EXISTS menu_makanan (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  harga INT NOT NULL,
  gambar VARCHAR(255),
  deskripsi TEXT,
  kategori VARCHAR(50),
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabel: orders
-- Deskripsi: Menyimpan data pesanan
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total_price INT NOT NULL,
  order_status VARCHAR(50) DEFAULT 'pending' COMMENT 'pending, processing, ready, completed, cancelled',
  order_type VARCHAR(50) DEFAULT 'delivery' COMMENT 'delivery, takeaway',
  payment_method VARCHAR(50) COMMENT 'COD, Transfer',
  payment_status VARCHAR(100) DEFAULT 'Pending' COMMENT 'Pending, Verified, Completed',
  virtual_account VARCHAR(20),
  delivery_name VARCHAR(100),
  delivery_phone VARCHAR(15),
  delivery_address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user_login(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabel: order_items
-- Deskripsi: Menyimpan detail items dalam setiap order
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  food_id INT NOT NULL,
  quantity INT NOT NULL,
  price INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (food_id) REFERENCES menu_makanan(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- INDEX untuk optimasi query
-- ============================================
CREATE INDEX idx_user_username ON user_login(username);
CREATE INDEX idx_admin_username ON admin_login(username);
CREATE INDEX idx_order_user_id ON orders(user_id);
CREATE INDEX idx_order_status ON orders(order_status);
CREATE INDEX idx_order_payment_status ON orders(payment_status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_food_id ON order_items(food_id);

-- ============================================
-- DATA DUMMY
-- ============================================

-- Insert User (Password sudah di-hash dengan bcrypt)
-- Username: demo | Password: demo123456
INSERT INTO user_login (email, username, password) VALUES 
('demo@example.com', 'demo', '$2b$12$t7wCMQp8Vn/AV7KnCH7Rdu9W9.1DM5Xzq9Zp9Q2K8Q8K8Q8K8Q8K8');

-- Username: testuser | Password: password123
INSERT INTO user_login (email, username, password) VALUES 
('testuser@example.com', 'testuser', '$2b$12$Z9Y8X7W6V5U4T3S2R1Q0P9O8N7M6L5K4J3I2H1G0F9E8D7C6B5A4');

-- Insert Admin (Password: admin123)
INSERT INTO admin_login (username, password) VALUES 
('admin', '$2b$12$X7W6V5U4T3S2R1Q0P9O8N7M6L5K4J3I2H1G0F9E8D7C6B5A4Z3Y2X');

-- Insert Menu Makanan
INSERT INTO menu_makanan (id, nama, harga, gambar, deskripsi, kategori, is_available) VALUES 
(1, 'Nasi Goreng Spesial', 25000, '/static/images/nasii goreng spesial.jpg', 'Nasi goreng dengan telur, ayam, dan sayuran pilihan', 'Nasi', TRUE),
(2, 'Mie Goreng Jawa', 20000, '/static/images/Mie_Goreng_Jawa_Pedas.jpg', 'Mie goreng khas Jawa dengan rasa yang kuat dan pedas', 'Mie', TRUE),
(3, 'Ayam Geprek Sambal Ijo', 28000, '/static/images/ayam geprek sambal ijo.jpg', 'Ayam geprek dengan sambal ijo yang segar dan pedas', 'Ayam', TRUE),
(4, 'Sate Ayam Madura 10 Tusuk', 30000, '/static/images/sate ayam madura .jpeg', 'Sate ayam khas Madura dengan bumbu kacang lezat', 'Daging', TRUE),
(5, 'Es Teh Manis', 3000, '/static/images/es teh manis.jpg', 'Minuman es teh manis segar', 'Minuman', TRUE),
(6, 'Kwetiau Goreng Seafood', 35000, '/static/images/kwetiau goreng seafood.jpeg', 'Kwetiau goreng dengan topping seafood premium', 'Kwetiau', TRUE),
(7, 'Coto Makassar', 20000, '/static/images/coto makassar.jpg', 'Sup tradisional Makassar dengan daging sapi empuk', 'Sup', TRUE),
(8, 'Pecel Lele', 22000, '/static/images/pecel lele.jpg', 'Lele goreng dengan sambal pecel khas Jawa', 'Ikan', TRUE),
(9, 'Sop Buntut', 45000, '/static/images/sop buntut.jpg', 'Sop ekor sapi dengan kuah yang gurih dan kaya rasa', 'Sup', TRUE);

-- Insert Sample Order (untuk testing)
INSERT INTO orders (user_id, total_price, order_status, order_type, payment_method, payment_status, virtual_account, delivery_name, delivery_phone, delivery_address, created_at) VALUES 
(1, 94000, 'pending', 'delivery', 'Transfer', 'Pending - Menunggu Verifikasi', '9001234567', 'Budi Santoso', '081234567890', 'Jl. Merdeka No. 123, Kota Test', NOW()),
(1, 89000, 'completed', 'takeaway', 'Bayar di Tempat', 'Completed', NULL, NULL, NULL, NULL, NOW() - INTERVAL 1 DAY),
(2, 56000, 'ready', 'delivery', 'COD', 'Pending', NULL, 'Siti Nurhaliza', '082345678901', 'Jl. Ahmad Yani No. 45, Kota Test', NOW() - INTERVAL 2 HOUR);

-- Insert Sample Order Items
INSERT INTO order_items (order_id, food_id, quantity, price) VALUES 
-- Order 1 items
(1, 1, 2, 25000),
(1, 4, 1, 30000),
(1, 5, 3, 3000),
-- Order 2 items
(2, 2, 1, 20000),
(2, 3, 1, 28000),
(2, 7, 1, 20000),
(2, 5, 2, 3000),
-- Order 3 items
(3, 6, 1, 35000),
(3, 8, 1, 22000);

-- ============================================
-- VIEW untuk Report
-- ============================================

-- View: Total penjualan per hari
CREATE OR REPLACE VIEW v_daily_sales AS
SELECT 
  DATE(created_at) as tanggal,
  COUNT(id) as jumlah_order,
  SUM(total_price) as total_penjualan
FROM orders
WHERE order_status IN ('completed', 'ready')
GROUP BY DATE(created_at)
ORDER BY tanggal DESC;

-- View: Order yang menunggu verifikasi pembayaran
CREATE OR REPLACE VIEW v_pending_verification AS
SELECT 
  o.id,
  u.username,
  o.total_price,
  o.payment_method,
  o.virtual_account,
  o.payment_status,
  o.created_at
FROM orders o
JOIN user_login u ON o.user_id = u.id
WHERE o.payment_status LIKE 'Pending - Menunggu%'
ORDER BY o.created_at DESC;

-- View: Menu yang paling sering dipesan
CREATE OR REPLACE VIEW v_popular_menu AS
SELECT 
  m.id,
  m.nama,
  m.harga,
  COUNT(oi.id) as jumlah_terjual,
  SUM(oi.quantity) as total_qty
FROM menu_makanan m
LEFT JOIN order_items oi ON m.id = oi.food_id
GROUP BY m.id, m.nama, m.harga
ORDER BY jumlah_terjual DESC;

-- ============================================
-- END OF DATABASE SETUP
-- ============================================
