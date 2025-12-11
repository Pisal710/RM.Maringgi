# RM.Maringgi - Aplikasi Pemesanan Makanan

Aplikasi web berbasis **Flask** untuk pemesanan makanan dengan sistem login, menu interaktif, keranjang belanja, dan penyimpanan pesanan ke database MySQL.
---
🛠️ Cara Menjalankan Project

### 1. Clone Repository
        Pastikan sudah install Git di komputer. Lalu jalankan:
        '''
        git clone https://github.com/Pisal710/RM.Maringgi.git
        cd RM.Maringgi
        '''

        2.buat virtual env(opsional tapi disarankan)
        jalankan:
        "python -m venv env"

        -aktifkan env
        "venv\Scripts\activate" 

        3.install dependencies
        "pip install -r requirements.txt"

        4.buat database phpmyadmin
            "create database rpl_login"

        -- Tabel user_login
        CREATE TABLE user_login (
            id INT(255) NOT NULL AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL,
            username VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL
        );

        -- Tabel admin_login
        CREATE TABLE admin_login (
            id INT(255) NOT NULL AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL
        );

        -- Tabel orders
        CREATE TABLE orders (
            id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
            user_id INT(11) NOT NULL,
            subtotal DECIMAL(12,2) NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES user_login(id)
        );

        -- Tabel order_items
        CREATE TABLE order_items (
            id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
            order_id INT(11) NOT NULL,
            menu_id INT(11) NOT NULL,
            nama VARCHAR(100) NOT NULL,
            harga DECIMAL(12,2) NOT NULL,
            jumlah INT(11) NOT NULL,
            CONSTRAINT fk_order FOREIGN KEY (order_id) REFERENCES orders(id)
        );

### 2.struktur folder
RM.Maringgi/
├── app.py
├── orders.py
├── utils/
├── koneksi/
├── templates/
├── requirements.txt
└── README.md


### 3.run aplikasi
    "python app.py" atau "flask run"


NOTE1: untuk admin masukkan memangmi datanya di table "admin_login" supaya terverifikasi nanti kalau mau login admin 
NOTE2: di folder templates disimpan frontend(UI/UX) dll,di folder static untuk css atau js

