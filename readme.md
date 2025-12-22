# RM Maranggi - Aplikasi Pemesanan Makanan

Aplikasi web untuk restoran RM Maranggi yang memungkinkan pelanggan memesan makanan secara online dengan pilihan pengantaran atau ambil sendiri.

## Fitur Utama

### 1. Sistem Login
- Login untuk pengguna dan admin
- Proteksi akses ke fitur pemesanan

### 2. Daftar Menu
- Menampilkan daftar menu makanan
- Harga dan gambar untuk setiap item

### 3. Keranjang Belanja
- Menambah/mengurangi jumlah item
- Perhitungan otomatis subtotal

### 4. Metode Pengambilan
- **Ambil Sendiri**: Tampilkan struk dan estimasi waktu selesai
- **Antar ke Tempat**: Form pengantaran dengan lokasi otomatis

### 5. Fitur Pengantaran
- Permintaan akses lokasi pengguna
- Reverse geocoding otomatis
- Estimasi waktu pengantaran
- Pengisian manual alamat jika diperlukan

### 6. Struk Pesanan
- Untuk pengambilan sendiri: struk dengan estimasi waktu selesai
- Untuk pengantaran: struk dengan detail pengiriman
- Fungsi cetak struk

### 7. Persistensi Data
- Data keranjang disimpan di localStorage
- Informasi pengiriman disimpan saat redirect ke login
- Pemulihan data setelah login selesai

## Struktur File

```
RM.maringgi/
├── app.py                 # Aplikasi Flask utama
├── requirements.txt       # Dependencies
├── .env                   # Konfigurasi lingkungan
├── static/
│   ├── menu_functions.js  # Fungsi-fungsi menu
│   ├── cart_functions.js  # Fungsi-fungsi keranjang
│   ├── delivery_functions.js # Fungsi-fungsi pengantaran
│   ├── receipt_functions.js # Fungsi-fungsi struk
│   ├── menu_app.js       # Inisialisasi aplikasi
│   └── menu.css          # Styling
├── templates/
│   ├── menu.html         # Halaman pemesanan
│   ├── login.html        # Halaman login
│   ├── register.html     # Halaman pendaftaran
│   └── ...
├── utils/
│   ├── login.py          # Fungsi login
│   ├── register_user.py  # Fungsi pendaftaran
│   └── order.py          # Fungsi pemesanan
└── koneksi/
    └── koneksi.py        # Koneksi database
```

## Instalasi

1. Pastikan Python 3.x terinstal
2. Buat virtual environment:
   ```
   python -m venv env
   ```
3. Aktifkan virtual environment:
   ```
   env\Scripts\activate  # Windows
   ```
4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
5. Konfigurasi database di file `.env`
6. Jalankan aplikasi:
   ```
   python app.py
   ```

## Konfigurasi Database

Pastikan file `.env` berisi:
```
DB_HOST=your_host
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=your_database
```

## Penggunaan

1. Buka browser dan akses `http://localhost:5000`
2. Login atau register terlebih dahulu
3. Pilih menu yang diinginkan
4. Tambahkan ke keranjang
5. Klik "Pesan" dan pilih metode pengambilan:
   - Ambil Sendiri: Tampilkan struk dan estimasi waktu
   - Antar ke Tempat: Isi form pengantaran (nama, HP, alamat) dan pilih lokasi

## Teknologi yang Digunakan

- **Backend**: Python Flask
- **Database**: MySQL
- **Frontend**: HTML, CSS, JavaScript (modular)
- **Geocoding**: OpenStreetMap Nominatim API
