# 🍽️ RM Maringgi - Aplikasi Pemesanan Makanan Online

Aplikasi web untuk restoran RM Maringgi dengan sistem login, menu, keranjang belanja, dan admin dashboard.

## ✨ Fitur

- **Login/Register** - Autentikasi user dengan password hashing
- **Menu & Keranjang** - 9 item menu dengan perhitungan otomatis
- **Delivery & Takeaway** - 2 metode pengambilan pesanan
- **Pembayaran** - COD dan Transfer Bank (Virtual Account)
- **Struk Pesanan** - Print receipt dengan estimasi waktu
- **Admin Dashboard** - Kelola pesanan masuk

## 🏗️ Struktur Folder

```
RM.Maringgi/
├── backend/              # Flask App
│   ├── app.py           # Main app + API endpoints
│   ├── utils/           # Login, register, order functions
│   └── koneksi/         # MySQL connector
├── frontend/            # Templates & Static files
│   ├── templates/       # HTML pages
│   └── static/          # CSS, JS, Images
├── run.py              # Entry point
└── requirements.txt    # Dependencies
```

## 🚀 Setup Cepat (Windows)

### 1. Prasyarat
- Python 3.8+
- MySQL 5.7+

### 2. Virtual Environment
```bash
python -m venv RPLenv
RPLenv\Scripts\activate
pip install -r requirements.txt
```

### 3. Database Setup
```bash
# Buat user MySQL
mysql -u root -p
CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'app_password';
GRANT ALL PRIVILEGES ON *.* TO 'app_user'@'localhost';
EXIT;

# Import database
mysql -u app_user -p login_rpl < database_setup.sql
```

### 4. Jalankan Aplikasi
```bash
python run.py
```

Buka: **http://localhost:5000**

## 👤 Test Credentials
- **Username**: admin
- **Password**: admin123
