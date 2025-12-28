# DATABASE SETUP RM MARINGGI

## Deskripsi
File `database_setup.sql` berisi semua perintah SQL untuk membuat database aplikasi RM Maringgi beserta struktur tabel, index, view, dan data dummy.

## Struktur Database

### 1. Tabel: `user_login`
Menyimpan data user yang sudah register

**Kolom:**
- `id` - ID user (Primary Key, Auto Increment)
- `email` - Email user (Unique)
- `username` - Username untuk login (Unique)
- `password` - Password yang sudah di-hash dengan bcrypt
- `created_at` - Waktu pembuatan akun
- `updated_at` - Waktu update terakhir

**Data Dummy:**
- Username: `demo` | Password: `demo123456` | Email: `demo@example.com`
- Username: `testuser` | Password: `password123` | Email: `testuser@example.com`

---

### 2. Tabel: `admin_login`
Menyimpan data admin

**Kolom:**
- `id` - ID admin (Primary Key, Auto Increment)
- `username` - Username untuk login admin (Unique)
- `password` - Password yang sudah di-hash dengan bcrypt
- `created_at` - Waktu pembuatan akun
- `updated_at` - Waktu update terakhir

**Data Dummy:**
- Username: `admin` | Password: `admin123`

---

### 3. Tabel: `menu_makanan`
Menyimpan data menu makanan dan minuman

**Kolom:**
- `id` - ID menu (Primary Key)
- `nama` - Nama menu
- `harga` - Harga menu (dalam Rupiah)
- `gambar` - Path gambar menu
- `deskripsi` - Deskripsi singkat menu
- `kategori` - Kategori menu (Nasi, Mie, Ayam, dll)
- `is_available` - Status ketersediaan menu (TRUE/FALSE)
- `created_at` - Waktu pembuatan
- `updated_at` - Waktu update terakhir

**Data Dummy (9 Menu):**
1. Nasi Goreng Spesial - Rp 25.000
2. Mie Goreng Jawa - Rp 20.000
3. Ayam Geprek Sambal Ijo - Rp 28.000
4. Sate Ayam Madura 10 Tusuk - Rp 30.000
5. Es Teh Manis - Rp 3.000
6. Kwetiau Goreng Seafood - Rp 35.000
7. Coto Makassar - Rp 20.000
8. Pecel Lele - Rp 22.000
9. Sop Buntut - Rp 45.000

---

### 4. Tabel: `orders`
Menyimpan data pesanan

**Kolom:**
- `id` - ID pesanan (Primary Key, Auto Increment)
- `user_id` - ID user yang memesan (Foreign Key → user_login)
- `total_price` - Total harga pesanan
- `order_status` - Status pesanan (pending, processing, ready, completed, cancelled)
- `order_type` - Tipe pesanan (delivery, takeaway)
- `payment_method` - Metode pembayaran (COD, Transfer)
- `payment_status` - Status pembayaran (Pending, Verified - Menunggu Verifikasi, Completed)
- `virtual_account` - Nomor Virtual Account (jika transfer)
- `delivery_name` - Nama penerima (jika delivery)
- `delivery_phone` - No HP penerima (jika delivery)
- `delivery_address` - Alamat pengiriman (jika delivery)
- `created_at` - Waktu pemesanan
- `updated_at` - Waktu update terakhir

---

### 5. Tabel: `order_items`
Menyimpan detail items dalam setiap pesanan

**Kolom:**
- `id` - ID item (Primary Key, Auto Increment)
- `order_id` - ID pesanan (Foreign Key → orders)
- `food_id` - ID menu makanan (Foreign Key → menu_makanan)
- `quantity` - Jumlah item yang dipesan
- `price` - Harga satuan saat pesanan dibuat
- `created_at` - Waktu pembuatan

---

## View (Laporan)

### 1. `v_daily_sales`
Menampilkan total penjualan per hari

**Kolom:**
- `tanggal` - Tanggal
- `jumlah_order` - Jumlah pesanan
- `total_penjualan` - Total penjualan hari itu

---

### 2. `v_pending_verification`
Menampilkan pesanan yang menunggu verifikasi pembayaran transfer

**Kolom:**
- `id` - ID pesanan
- `username` - Username pemesan
- `total_price` - Total harga
- `payment_method` - Metode pembayaran
- `virtual_account` - Nomor virtual account
- `payment_status` - Status pembayaran
- `created_at` - Waktu pemesanan

---

### 3. `v_popular_menu`
Menampilkan menu yang paling sering dipesan

**Kolom:**
- `id` - ID menu
- `nama` - Nama menu
- `harga` - Harga menu
- `jumlah_terjual` - Berapa kali menu ini dipesan
- `total_qty` - Total kuantitas menu yang dipesan

---

## Cara Menggunakan

### 1. Import Database via Terminal MySQL
```bash
mysql -u root -p < database_setup.sql
```

### 2. Import Database via MySQL Workbench
1. Buka MySQL Workbench
2. Klik `File` → `Open SQL Script`
3. Pilih file `database_setup.sql`
4. Klik `Execute All` atau tekan `Ctrl+Shift+Enter`

### 3. Import Database via phpMyAdmin
1. Login ke phpMyAdmin
2. Klik tab `Import`
3. Pilih file `database_setup.sql`
4. Klik `Go`

---

## Update Password Default

Untuk mengubah password default, Anda perlu hash password baru terlebih dahulu menggunakan bcrypt.

Contoh di Python (dengan bcrypt):
```python
from flask_bcrypt import Bcrypt
bcrypt = Bcrypt()
hashed_password = bcrypt.generate_password_hash('password_baru').decode('utf-8')
print(hashed_password)
```

Kemudian update di database:
```sql
UPDATE user_login SET password = '[HASHED_PASSWORD]' WHERE username = 'demo';
```

---

## Catatan Penting

1. **Password Hashing**: Semua password di database sudah di-hash dengan bcrypt
2. **Foreign Key**: Menggunakan FOREIGN KEY dengan ON DELETE CASCADE untuk menjaga integritas data
3. **Charset**: Menggunakan UTF-8 untuk mendukung karakter Indonesia
4. **Index**: Sudah dibuat index untuk kolom yang sering di-query (username, order_status, dll)

---

## Testing

Setelah setup database, Anda bisa test dengan query:

```sql
-- Lihat semua user
SELECT * FROM user_login;

-- Lihat semua menu
SELECT * FROM menu_makanan;

-- Lihat semua pesanan dengan detail user
SELECT o.*, u.username 
FROM orders o 
JOIN user_login u ON o.user_id = u.id;

-- Lihat daily sales
SELECT * FROM v_daily_sales;

-- Lihat pending verification
SELECT * FROM v_pending_verification;

-- Lihat popular menu
SELECT * FROM v_popular_menu;
```

---

**Created: 28-12-2025**
**Database: rm_maringgi**
**Version: 1.0**
