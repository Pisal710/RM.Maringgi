# 🍽️ RM Maringgi - Aplikasi Pemesanan Makanan Online

Aplikasi web untuk restoran **RM Maringgi** dengan sistem login, menu interaktif, keranjang belanja, pembayaran, dan admin dashboard.

Dibangun menggunakan **Python (Flask)** dan **MySQL** sebagai proyek tugas RPL.

---

## ✨ Fitur Utama

- 🔐 **Autentikasi** - Login dan register dengan password hashing
- 🍜 **Menu Dinamis** - 9 item menu dengan detail harga
- 🛒 **Keranjang Belanja** - Tambah/kurang item dengan perhitungan otomatis
- 🚚 **2 Metode Pengambilan** - Delivery atau Takeaway
- 💳 **Pembayaran Fleksibel** - COD atau Transfer Bank (Virtual Account)
- 📜 **Struk Digital** - Print receipt dengan estimasi waktu
- 📊 **Admin Dashboard** - Kelola pesanan masuk secara real-time

---

## 📋 Persyaratan

Pastikan sudah terinstall:

- **Python 3.8+**
- **MySQL** (XAMPP / Laragon / MySQL Server standalone)
- **Git**

---

## 🚀 Cara Menjalankan

### 1) Clone Repository

```bash
git clone <repo_url>
cd RM.Maringgi
```

### 2) Setup Virtual Environment & Install Dependencies

**Windows (CMD):**
```bash
python -m venv RPLenv
RPLenv\Scripts\activate
pip install -r requirements.txt
```

### 3) Setup Database MySQL

Buka MySQL terminal (gunakan XAMPP / Laragon atau MySQL console):

```sql
CREATE DATABASE IF NOT EXISTS login_rpl;
CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'app_password';
GRANT ALL PRIVILEGES ON login_rpl.* TO 'app_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

Import skema dan data awal:

```bash
mysql -u app_user -p login_rpl < database_setup.sql
```

### 4) Konfigurasi Database

Buat file `.env` di root project dengan konten:

```env
DB_HOST=localhost
DB_USER=app_user
DB_PASSWORD=app_password
DB_NAME=login_rpl
```

Aplikasi menggunakan `python-dotenv` untuk membaca file ini. Lihat file `backend/koneksi/koneksi.py` untuk detail koneksi.

### 5) Jalankan Aplikasi

```bash
python run.py
```

Buka di browser: **http://localhost:5000**

---

## 👤 Akun Testing

- **Username:** `admin`
- **Password:** `admin123`

> ⚠️ **Catatan:** Password pada akun testing bisa berubah karena proses hashing tergantung mesin. Jika login gagal, daftarkan user baru melalui halaman Register.

---

## 🗂️ Struktur Project

```
RM.Maringgi/
├── backend/
│   ├── app.py                    # Main Flask app
│   ├── koneksi/
│   │   └── koneksi.py           # Database connector
│   └── utils/
│       ├── login.py             # Login logic
│       ├── register_user.py      # Register logic
│       └── order.py             # Order processing
├── frontend/
│   ├── templates/               # HTML pages
│   │   ├── login.html
│   │   ├── register.html
│   │   ├── home.html
│   │   ├── menu.html
│   │   └── admin_page.html
│   └── static/                  # CSS, JS, Images
│       ├── *.css
│       ├── *.js
│       └── images/
├── run.py                       # Entry point
├── requirements.txt             # Dependencies
├── database_setup.sql          # Database schema
└── readme.md
```

---

## 📝 Catatan Pengembang

- Database koneksi menggunakan context manager untuk error handling yang lebih baik
- Password di-hash menggunakan `flask_bcrypt`
- Session management menggunakan `sessionStorage` di client-side
- Responsive design untuk mobile dan desktop

---

Jika ada pertanyaan atau masalah, cek file dokumentasi di folder project atau hubungi tim development.
