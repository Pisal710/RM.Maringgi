# RM. Maringgi - Struktur Folder

## 📁 Backend (`/backend`)
```
backend/
├── app.py              # Main Flask application
├── utils/
│   ├── register_user.py
│   ├── login.py
│   ├── order.py
│   └── __init__.py
├── koneksi/
│   ├── koneksi.py
│   └── __init__.py
└── __pycache__/
```

## 🎨 Frontend (`/frontend`)
```
frontend/
├── templates/          # HTML templates
│   ├── admin_page.html
│   ├── home.html
│   ├── login.html
│   ├── menu.html
│   └── register.html
└── static/            # CSS, JS, Images
    ├── admin.css
    ├── admin.js
    ├── login.css
    ├── menu.css
    ├── menu_app.js
    ├── cart_functions.js
    ├── delivery_functions.js
    ├── payment_function.js
    ├── receipt_functions.js
    ├── menu_functions.js
    └── images/
```

## 🔧 Root Files
```
/
├── run.py                    # Entry point untuk menjalankan aplikasi
├── app.py                    # (deprecated - akan dihapus)
├── requirements.txt          # Python dependencies
├── .env                      # Environment variables
├── .gitignore               # Git ignore rules
├── database_setup.sql       # Database schema
├── DATABASE_DOCUMENTATION.md # Database docs
└── readme.md                # Project documentation
```

## ⚡ Cara Menjalankan

### Terminal 1 - Aktifkan Virtual Environment
```bash
cd /home/reul_1001/RM.Maringgi
source RPLenv/bin/activate  # Linux/Mac
# atau
RPLenv\Scripts\activate      # Windows
```

### Terminal 2 - Jalankan Aplikasi
```bash
python run.py
```

Aplikasi akan berjalan di: http://127.0.0.1:5000

## 📝 Notes
- Backend dan Frontend sudah terpisah untuk struktur yang lebih clean
- All imports dalam app.py sudah diupdate untuk reflect struktur baru
- Frontend files bisa di-serve terpisah jika diperlukan di masa depan
