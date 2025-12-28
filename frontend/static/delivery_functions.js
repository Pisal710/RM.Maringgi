// delivery_functions.js - Fungsi-fungsi terkait pengantaran

// Fungsi untuk mendapatkan lokasi dari browser
function getLocationFromBrowser() {
  const statusElement = document.getElementById("locationStatus");
  
  if (!navigator.geolocation) {
    statusElement.innerHTML = "Geolocation tidak didukung oleh browser ini.";
    return;
  }

  statusElement.innerHTML = "Mengakses lokasi Anda...";
  navigator.geolocation.getCurrentPosition(
    // Sukses
    (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      const accuracy = position.coords.accuracy; // Akurasi dalam meter
      
      statusElement.innerHTML = `Mendapatkan detail lokasi... (akurasi: ${accuracy.toFixed(0)}m)`;
      
      // Gunakan reverse geocoding untuk mendapatkan alamat dari koordinat
      // Kita akan menggunakan OpenStreetMap API untuk reverse geocoding
      fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`)
        .then(response => response.json())
        .then(data => {
          const address = data.address;
          let fullAddress = '';
          
          // Gunakan display_name yang lebih lengkap jika tersedia
          if(data.display_name) {
            fullAddress = data.display_name;
          } else if(address) {
            // Fallback ke alamat yang disusun dari elemen individu
            fullAddress = [
              address.house_number,
              address.road,
              address.suburb,
              address.city,
              address.state,
              address.postcode
            ].filter(part => part !== undefined).join(', ');
          }
          
          // Isi textarea alamat dengan hasil reverse geocoding
          document.getElementById("alamat").value = fullAddress;

          statusElement.innerHTML = `Lokasi ditemukan! (akurasi: ${accuracy.toFixed(0)}m)`;
          
          // Tambahkan data lokasi ke variabel global agar bisa digunakan saat submit
          window.deliveryLocation = { 
            lat, 
            lng, 
            accuracy, // Simpan akurasi untuk referensi
            address: fullAddress 
          };
        })
        .catch(error => {
          console.error('Error reverse geocoding:', error);
          statusElement.innerHTML = "Gagal mendapatkan alamat dari lokasi.";
          
          // Tetap simpan koordinat meskipun reverse geocoding gagal
          window.deliveryLocation = { 
            lat, 
            lng, 
            accuracy,
            address: document.getElementById("alamat").value 
          };
        });
    },
    // Gagal
    (error) => {
      let errorMessage = '';
      switch(error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = "Izin akses lokasi ditolak. Mohon aktifkan izin lokasi dan isi manual.";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = "Informasi lokasi tidak tersedia.";
          break;
        case error.TIMEOUT:
          errorMessage = "Request lokasi timeout.";
          break;
        case error.UNKNOWN_ERROR:
          errorMessage = "Error yang tidak diketahui terjadi.";
          break;
      }
      statusElement.innerHTML = errorMessage;
      
      // Fokus ke textbox alamat agar user bisa mengisi manual
      document.getElementById("alamat").focus();
    },
    {
      enableHighAccuracy: true, // Aktifkan akurasi tinggi
      timeout: 15000,           // Tambahkan timeout
      maximumAge: 0             // Jangan gunakan cache
    }
  );
}

// Batal dari form delivery
function batalDelivery() {
  document.getElementById("formDelivery").style.display = "none";
  // Reset kembali konten modal ke versi semula
  document.getElementById("formDelivery").innerHTML = `
    <div style="background:#006aff; padding:30px; border-radius:10px; width:90%; max-width:400px; color:white;">
      <h2 style="text-align:center; margin-bottom:20px; color:#e7e7e7;">Antar ke Tempat</h2>
      <input type="text" id="nama" placeholder="Nama Lengkap"
        style="width:100%; padding:14px; margin:10px 0; border:none; border-radius:10px;">
      <input type="text" id="hp" placeholder="No. HP / WA"
        style="width:100%; padding:14px; margin:10px 0; border:none; border-radius:10px;">
      <div style="position:relative;">
        <textarea id="alamat" placeholder="Alamat lengkap + patokan (contoh: Kompleks Marinda Blok B2 No.10)"
          style="width:100%; height:90px; padding:14px; margin:10px 0; border:none; border-radius:10px;"></textarea>
        <button id="getLocationBtn"
          style="position:absolute; bottom:10px; right:10px; padding:5px 10px; background:#4CAF50; color:white; border:none; border-radius:5px; font-size:0.9em; z-index:1000;">Gunakan Lokasi Saat Ini</button>
      </div>
      <div id="locationStatus" style="font-size:0.9em; margin:5px 0; color:#ffeb3b;"></div>
      <div style="text-align:right; margin-top:15px;">
        <button id="btnBatalDelivery"
          style="padding:12px 20px; background:#ffcd07; color:white; border:none; border-radius:10px; margin-right:10px;">Batal</button>
        <button id="btnKirimDelivery"
          style="padding:12px 28px; background:#9000ff; color:rgb(255, 255, 255); border:none; border-radius:10px; font-weight:bold;">Kirim
          Pesanan</button>
      </div>
    </div>
  `;
  // Hapus data lokasi jika batal
  delete window.deliveryLocation;
  // Hapus status metode yang dipilih saat batal
  localStorage.removeItem('selectedMethod');
}

// Kirim pesanan delivery (sekarang hanya untuk validasi, nanti pilih pembayaran)
function kirimDelivery() {
  const nama = document.getElementById("nama").value.trim();
  const hp = document.getElementById("hp").value.trim();
  const alamat = document.getElementById("alamat").value.trim();
  
  if (!nama || !hp || !alamat) {
    return alert("Isi semua dulu bro!");
  }

  // Hitung total biaya
  const subtotal = keranjang.reduce((s, i) => s + i.harga * i.jumlah, 0);
  const tax = subtotal * 0.1; // PPN 10%
  const total = subtotal + tax;

  // Sembunyikan form delivery dan tampilkan pilihan metode pembayaran
  document.getElementById("formDelivery").style.display = "none";
  
  // Tampilkan pilihan pembayaran untuk delivery
  showDeliveryPaymentMethod(nama, hp, alamat, subtotal, tax, total);
}

// Fungsi untuk menyelesaikan proses delivery receipt dan menutup modal
function selesaiDeliveryReceipt() {
  // Kirim order ke backend sebelum tutup
  submitOrder();
  
  document.getElementById("formDelivery").style.display = "none";
  // Reset kembali konten modal ke versi semula
  document.getElementById("formDelivery").innerHTML = `
    <div style="background:#006aff; padding:30px; border-radius:10px; width:90%; max-width:400px; color:white;">
      <h2 style="text-align:center; margin-bottom:20px; color:#e7e7e7;">Antar ke Tempat</h2>
      <input type="text" id="nama" placeholder="Nama Lengkap"
        style="width:100%; padding:14px; margin:10px 0; border:none; border-radius:10px;">
      <input type="text" id="hp" placeholder="No. HP / WA"
        style="width:100%; padding:14px; margin:10px 0; border:none; border-radius:10px;">
      <div style="position:relative;">
        <textarea id="alamat" placeholder="Alamat lengkap + patokan (contoh: Kompleks Marinda Blok B2 No.10)"
          style="width:100%; height:90px; padding:14px; margin:10px 0; border:none; border-radius:10px;"></textarea>
        <button id="getLocationBtn"
          style="position:absolute; bottom:10px; right:10px; padding:5px 10px; background:#4CAF50; color:white; border:none; border-radius:5px; font-size:0.9em; z-index:1000;">Gunakan Lokasi Saat Ini</button>
      </div>
      <div id="locationStatus" style="font-size:0.9em; margin:5px 0; color:#ffeb3b;"></div>
      <div style="text-align:right; margin-top:15px;">
        <button id="btnBatalDelivery"
          style="padding:12px 20px; background:#ffcd07; color:white; border:none; border-radius:10px; margin-right:10px;">Batal</button>
        <button id="btnKirimDelivery"
          style="padding:12px 28px; background:#9000ff; color:rgb(255, 255, 255); border:none; border-radius:10px; font-weight:bold;">Kirim
          Pesanan</button>
      </div>
    </div>
  `;
  // Hapus status metode yang dipilih saat selesai
  localStorage.removeItem('selectedMethod');
}

// Export fungsi-fungsi jika menggunakan module system
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getLocationFromBrowser, batalDelivery, kirimDelivery, selesaiDeliveryReceipt };
}