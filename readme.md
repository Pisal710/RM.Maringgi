# 🍽️ RM Maringgi - Aplikasi Pemesanan Makanan Online

Aplikasi web modern untuk restoran RM Maringgi yang memungkinkan pelanggan memesan makanan secara online dengan berbagai pilihan pembayaran dan metode pengambilan.

---

## ✨ Fitur Utama

### 👥 Sistem Autentikasi
- ✅ **Login** - Untuk pengguna dan admin
- ✅ **Register** - Pendaftaran pengguna baru dengan password hashing (bcrypt)
- ✅ **Session Management** - Proteksi akses ke fitur pemesanan
- ✅ **Logout** - Pembersihan session dan cache

### 🍜 Menu & Keranjang
- ✅ **Daftar Menu** - 9 item makanan/minuman dengan gambar dan harga
- ✅ **Keranjang Belanja** - Tambah/kurangi jumlah item secara real-time
- ✅ **Perhitungan Otomatis** - Subtotal dan PPN (10%)
- ✅ **Persistensi** - Data keranjang tersimpan di localStorage

### 🚗 Metode Pengambilan
1. **Delivery (Antar ke Tempat)**
   - Form input: Nama, No HP, Alamat
   - Auto-lokasi dengan geolocation browser
   - Reverse geocoding otomatis (OpenStreetMap)
   - Estimasi waktu pengantaran 30-50 menit

2. **Takeaway (Ambil Sendiri)**
   - Estimasi waktu persiapan 15-40 menit
   - Struk dengan estimasi waktu selesai
   - Ambil langsung di restoran

### 💳 Sistem Pembayaran
Mendukung 4 kombinasi metode pembayaran:

#### Delivery:
- **COD (Cash On Delivery)** - Bayar saat pesanan tiba
- **Transfer Bank** - Via Virtual Account (auto-generate)

#### Takeaway:
- **Bayar di Tempat** - Bayar saat mengambil pesanan
- **Transfer Bank** - Via Virtual Account sebelum ambil

**Virtual Account Format**: `900XXXXXX` (6 digit random)

### 📋 Struk Pesanan
- ✅ Detail lengkap pesanan
- ✅ Informasi pembayaran sesuai metode
- ✅ Nomor Virtual Account (jika transfer)
- ✅ Fungsi cetak (print)
- ✅ Estimasi waktu pengantaran/persiapan

### 🎛️ Admin Dashboard
- ✅ **Lihat Pesanan Masuk** - Tabel pesanan real-time
- ✅ **Detail Pesanan** - Modal dengan informasi lengkap
- ✅ **Konfirmasi Pesanan** - Update status menjadi confirmed
- ✅ **Batalkan Pesanan** - Batalkan pesanan dengan konfirmasi
- ✅ **Hapus Semua Pesanan** - Bulk delete dengan double confirmation
- ✅ **Refresh Data** - Update real-time tabel pesanan

---

## 🏗️ Struktur Folder

```
RM.Maringgi/
├── backend/                         # 🔧 Backend (Flask App)
│   ├── app.py                       # Aplikasi Flask utama + API endpoints
│   ├── utils/                       # Utility functions
│   │   ├── login.py                 # Fungsi login & password verification
│   │   ├── register_user.py         # Fungsi register pengguna
│   │   ├── order.py                 # Fungsi save order ke database
│   │   └── __init__.py
│   ├── koneksi/                     # Koneksi database
│   │   ├── koneksi.py               # MySQL connector setup
│   │   └── __init__.py
│   └── __pycache__/
│
├── frontend/                        # 🎨 Frontend (Templates & Static)
│   ├── templates/                   # File HTML (Jinja2)
│   │   ├── admin_page.html          # Dashboard admin
│   │   ├── home.html                # Halaman home
│   │   ├── login.html               # Halaman login
│   │   ├── menu.html                # Halaman pemesanan
│   │   └── register.html            # Halaman register
│   │
│   └── static/                      # File statis (CSS, JS, Images)
│       ├── admin.css                # Styling admin dashboard
│       ├── admin.js                 # Logic admin dashboard
│       ├── login.css                # Styling login
│       ├── menu.css                 # Styling menu
│       ├── menu_functions.js        # Render menu & tambah keranjang
│       ├── cart_functions.js        # Fungsi keranjang belanja
│       ├── delivery_functions.js    # Form delivery & submit order
│       ├── payment_function.js      # Pilihan pembayaran & submit ke backend
│       ├── receipt_functions.js     # Struk & takeaway
│       ├── menu_app.js              # Event listener & inisialisasi
│       └── images/                  # Gambar menu (9 file)
│
├── RPLenv/                          # Python virtual environment
├── run.py                           # ⭐ ENTRY POINT (jalankan dari sini!)
├── requirements.txt                 # Dependencies Python
├── .env                             # Konfigurasi environment
├── database_setup.sql               # Schema & data dummy (BACA INI!)
├── DATABASE_DOCUMENTATION.md        # Dokumentasi database
├── SETUP_INSTRUCTIONS.md            # Setup guide lengkap
├── FOLDER_STRUCTURE.md              # Dokumentasi struktur folder
└── readme.md                        # File ini

```

---

## 🚀 Instalasi & Setup Lengkap

### Prasyarat (Windows)
- **Python 3.8+** sudah terinstall
- **MySQL 5.7+** sudah berjalan
- **Git** sudah terinstall

---

## 1️⃣ Step 1: Clone Project

```bash
git clone https://github.com/username/RM.Maringgi.git
cd RM.Maringgi
```

---

## 2️⃣ Step 2: Buat Virtual Environment

```bash
python -m venv RPLenv
RPLenv\Scripts\activate
```

**Output jika berhasil**: `(RPLenv)` akan muncul di terminal

---

## 3️⃣ Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

**Dependencies yang diinstall:**
- Flask 3.1.2
- Flask-Bcrypt 1.0.1
- MySQL Connector 8.3.0
- python-dotenv 1.2.1

---

## 4️⃣ Step 4: Setup MySQL Database (PENTING!)

### A. Buat MySQL User Baru

Buka Command Prompt atau PowerShell sebagai Administrator:

```bash
# Buka MySQL CLI
mysql -u root -p
# Masukkan password MySQL root jika ada

# Di MySQL prompt, jalankan:
CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'app_password';
GRANT ALL PRIVILEGES ON *.* TO 'app_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

### B. Buat Database dari File SQL

```bash
mysql -u app_user -p login_rpl < database_setup.sql
# Masukkan password: app_password
```

---

### C. Verifikasi Database (Optional)

```bash
mysql -u app_user -p
# Password: app_password

# Di MySQL prompt:
USE login_rpl;
SHOW TABLES;
SELECT * FROM user_login;
EXIT;
```

**Output yang benar:**
```
+------------------+
| Tables_in_login_rpl |
+------------------+
| admin_login      |
| menu_makanan     |
| order_items      |
| orders           |
| user_login       |
+------------------+
```

---

## 5️⃣ Step 5: Konfigurasi .env

File `.env` sudah ada dengan isi:

```env
DB_HOST="localhost"
DB_USER=app_user
DB_PASSWORD="app_password"
DB_NAME=login_rpl

FLASK_APP=app.py
FLASK_ENV=development 
FLASK_DEBUG=1
```

**Jika menggunakan setup berbeda, update nilai di atas**

---

## 6️⃣ Step 6: Jalankan Aplikasi

```bash
python run.py
```

**Output yang benar:**
```
 * Serving Flask app 'backend.app'
 * Debug mode: on
 * Running on http://127.0.0.1:5000
Press CTRL+C to quit
```

Buka browser: **http://localhost:5000**

---

## 👤 Test Credentials

### Admin Account
| Username | Password | Peran |
|----------|----------|-------|
| admin | admin123 | Admin |


## 🚀 Quick Start

**Setup cepat untuk Windows:**
```batch
python -m venv RPLenv
RPLenv\Scripts\activate
pip install -r requirements.txt
mysql -u app_user -p login_rpl < database_setup.sql
python run.py
```
