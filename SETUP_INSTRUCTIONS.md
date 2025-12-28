# 🍽️ RM. Maringgi - Struktur Project Baru

## 📂 Organisasi Folder

Proyek ini sekarang menggunakan struktur **Backend-Frontend Separation** untuk maintainability yang lebih baik.

### Struktur Tree
```
RM.Maringgi/
├── backend/                    # 🔧 Backend (Flask App)
│   ├── app.py                  # Main Flask application
│   ├── utils/
│   │   ├── register_user.py
│   │   ├── login.py
│   │   ├── order.py
│   │   └── __init__.py
│   ├── koneksi/
│   │   ├── koneksi.py
│   │   └── __init__.py
│   └── __pycache__/
│
├── frontend/                   # 🎨 Frontend (Templates & Static)
│   ├── templates/              # HTML templates
│   │   ├── admin_page.html
│   │   ├── home.html
│   │   ├── login.html
│   │   ├── menu.html
│   │   └── register.html
│   └── static/                 # CSS, JS, Images
│       ├── admin.css
│       ├── admin.js
│       ├── login.css
│       ├── menu.css
│       ├── menu_app.js
│       ├── cart_functions.js
│       ├── delivery_functions.js
│       ├── payment_function.js
│       ├── receipt_functions.js
│       ├── menu_functions.js
│       └── images/
│
├── RPLenv/                     # Python virtual environment
├── run.py                      # Entry point (jalankan aplikasi di sini!)
├── requirements.txt            # Python dependencies
├── .env                        # Environment variables
├── .gitignore                  # Git ignore
├── database_setup.sql          # Database schema
├── DATABASE_DOCUMENTATION.md   # Database documentation
├── FOLDER_STRUCTURE.md         # Dokumentasi struktur folder
└── readme.md                   # Project documentation
```

## 🚀 Cara Menjalankan Aplikasi

### Step 1: Aktifkan Virtual Environment
```bash
cd /home/reul_1001/RM.Maringgi

# Windows
RPLenv\Scripts\activate

# Linux/Mac
source RPLenv/bin/activate
```

### Step 2: Jalankan Aplikasi
```bash
python run.py
```

Aplikasi akan berjalan di: **http://127.0.0.1:5000**

## 📋 Fitur Utama

### 👥 User Features
- ✅ Login & Register
- ✅ Browse Menu
- ✅ Add to Cart
- ✅ Pilih Tipe Pesanan (Delivery/Takeaway)
- ✅ Pilih Metode Pembayaran
- ✅ Input Alamat Pengiriman
- ✅ Lihat Struk Pesanan

### 👨‍💼 Admin Features
- ✅ Dashboard Realtime (Auto-refresh setiap 3 detik)
- ✅ Lihat Semua Pesanan
- ✅ Lihat Detail Pesanan
- ✅ Konfirmasi Pesanan
- ✅ Batalkan Pesanan
- ✅ Hapus Semua Pesanan

## 🗄️ Database

Database yang digunakan: **MySQL 5.7+**

### Login Credentials
```
Host: localhost
User: app_user
Password: app_password
Database: login_rpl
```

### Jalankan Database Setup
```bash
mysql -u app_user -p login_rpl < database_setup.sql
```

## 🔐 Test Credentials

### User Login
- Username: `demo`
- Password: `demo123456`

### Admin Login
- Username: `admin`
- Password: `admin123`

## 📦 Dependensi

```
Flask==3.1.2
Flask-Bcrypt==1.0.1
mysql-connector-python==8.3.0
python-dotenv==1.2.1
```

Install dengan:
```bash
pip install -r requirements.txt
```

## 🏗️ Arsitektur

### Backend (`/backend`)
- **Flask** - Web framework
- **Flask-Bcrypt** - Password hashing
- **MySQL Connector** - Database driver
- **Python-dotenv** - Environment variables

### Frontend (`/frontend`)
- **HTML5** - Markup
- **CSS3** - Styling
- **Vanilla JavaScript** - Interactivity
- **Fetch API** - Client-server communication

## 📚 File Penting

- `backend/app.py` - Main application routes & API endpoints
- `backend/utils/order.py` - Order processing logic
- `backend/utils/login.py` - Authentication logic
- `frontend/templates/admin_page.html` - Admin dashboard
- `frontend/static/admin.js` - Admin dashboard logic
- `frontend/static/menu_app.js` - Menu page logic

## 🔄 API Endpoints

### Orders Management
- `GET /api/orders` - Get all orders
- `GET /api/orders/<id>` - Get order detail
- `PUT /api/orders/<id>/confirm` - Confirm order
- `PUT /api/orders/<id>/cancel` - Cancel order
- `DELETE /api/orders/delete-all` - Delete all orders

### Customers
- `GET /api/customers` - Get customer list

## 🎯 Keuntungan Struktur Baru

1. ✅ **Clear Separation** - Backend logic terpisah dari Frontend files
2. ✅ **Easier Maintenance** - Lebih mudah menemukan & update code
3. ✅ **Scalability** - Bisa expand backend/frontend independently
4. ✅ **Better Organization** - Static files & templates terstruktur baik
5. ✅ **Professional** - Mengikuti best practices development

## 🤝 Contributing

Ketika menambah fitur baru:
1. Backend logic → `/backend`
2. Templates → `/frontend/templates`
3. Styling → `/frontend/static/*.css`
4. Scripts → `/frontend/static/*.js`

## 📝 Notes

- Virtual environment sudah ada di `RPLenv/`
- Environment variables di `.env`
- Database schema di `database_setup.sql`
- Dokumentasi database di `DATABASE_DOCUMENTATION.md`

---

**Last Updated:** December 28, 2025
**Version:** 2.0 (Backend-Frontend Separation)
