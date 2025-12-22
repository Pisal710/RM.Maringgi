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

// Kirim pesanan delivery
function kirimDelivery() {
  const btnKirim = document.getElementById("btnKirimDelivery");
  btnKirim.disabled = true; // Disable button to prevent multiple clicks
  btnKirim.innerHTML = "Mengirim...";

  const nama = document.getElementById("nama").value.trim();
  const hp = document.getElementById("hp").value.trim();
  const alamat = document.getElementById("alamat").value.trim();
  if (!nama || !hp || !alamat) {
    btnKirim.disabled = false;
    btnKirim.innerHTML = "Kirim Pesanan";
    return alert("Isi semua dulu bro!");
  }

  const data = {
    items: keranjang,
    subtotal: keranjang.reduce((s, i) => s + i.harga * i.jumlah, 0),
    // Tambahkan informasi lokasi jika tersedia
    delivery_info: {
      nama: nama,
      hp: hp,
      alamat: alamat,
      location: window.deliveryLocation ? window.deliveryLocation : null
    }
  };

  // Simpan keranjang dan informasi pengiriman ke localStorage sebelum mengirim data
  localStorage.setItem('cartItems', JSON.stringify(keranjang));
  localStorage.setItem('cartTimestamp', Date.now().toString());  // Tambahkan timestamp
  localStorage.setItem('deliveryInfo', JSON.stringify({
    nama: nama,
    hp: hp,
    alamat: alamat,
    location: window.deliveryLocation
  }));

  fetch("/menu", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  .then(r => r.json())
  .then(response => {
    if(response.redirect) {
      // Redirect to login if not authenticated
      // Keranjang dan informasi pengiriman sudah disimpan sebelumnya, jadi tidak akan hilang
      window.location.href = response.redirect;
    } else {
      if(response.success) {
        // Hapus informasi pengiriman dari localStorage setelah pesanan berhasil dikirim
        localStorage.removeItem('deliveryInfo');

        // Hitung total waktu pengantaran (misalnya 30 menit + 5 menit per item)
        const deliveryTime = 30 + (keranjang.length * 5);

        // Buat estimasi waktu selesai
        const now = new Date();
        const estimatedTime = new Date(now.getTime() + deliveryTime * 60000); // tambahkan menit dalam milidetik
        const formattedTime = estimatedTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

        // Hitung total biaya
        const subtotal = keranjang.reduce((s, i) => s + i.harga * i.jumlah, 0);
        const tax = subtotal * 0.1; // PPN 10%
        const total = subtotal + tax;

        // Simpan data pesanan ke variabel sementara untuk pencetakan SEBELUM mengubah HTML
        window.currentOrder = {
          items: [...keranjang],
          subtotal: subtotal,
          tax: tax,
          total: total,
          estimatedTime: formattedTime,
          orderDate: now,
          deliveryInfo: {
            nama: nama,
            hp: hp,
            alamat: alamat
          }
        };

        // Buat struk pesanan pengantaran
        let receiptHTML = '<div style="background:white; color:black; padding:20px; border-radius:10px; max-height:70vh; overflow-y:auto;">';
        receiptHTML += '<h2 style="text-align:center; color:#e74c3c;">Struk Pesanan (Pengantaran)</h2>';
        receiptHTML += '<p><strong>Nama Penerima:</strong> ' + nama + '</p>';
        receiptHTML += '<p><strong>No. HP:</strong> ' + hp + '</p>';
        receiptHTML += '<p><strong>Alamat Tujuan:</strong> ' + alamat + '</p>';
        receiptHTML += '<p><strong>Tanggal:</strong> ' + now.toLocaleDateString() + '</p>';
        receiptHTML += '<p><strong>Waktu Order:</strong> ' + now.toLocaleTimeString() + '</p>';
        receiptHTML += '<hr style="margin:10px 0;">';

        // Tampilkan detail pesanan
        receiptHTML += '<h3>Rincian Pesanan:</h3>';
        keranjang.forEach(item => {
          receiptHTML += `<p>${item.nama} x ${item.jumlah} = Rp ${(item.harga * item.jumlah).toLocaleString('id-ID')}</p>`;
        });

        receiptHTML += '<hr style="margin:10px 0;">';
        receiptHTML += `<p><strong>Subtotal:</strong> Rp ${subtotal.toLocaleString('id-ID')}</p>`;
        receiptHTML += `<p><strong>PPN (10%):</strong> Rp ${tax.toLocaleString('id-ID')}</p>`;
        receiptHTML += `<p style="font-size:1.2em;"><strong>Total:</strong> Rp ${total.toLocaleString('id-ID')}</p>`;
        receiptHTML += `<p style="font-size:1.2em; color:#e74c3c;"><strong>Estimasi Sampai:</strong> ${formattedTime}</p>`;
        receiptHTML += '<p style="font-style:italic;">Pesanan Anda sedang diproses dan akan segera dikirimkan.</p>';
        receiptHTML += '<div style="text-align:center; margin-top:20px;">';
        receiptHTML += '<button onclick="selesaiDeliveryReceipt()" style="padding:10px 20px; background:#27ae60; color:white; border:none; border-radius:5px; margin:0 5px;">Tutup</button>';
        receiptHTML += '<button onclick="printDeliveryReceipt()" style="padding:10px 20px; background:#3498db; color:white; border:none; border-radius:5px; margin:0 5px;">Cetak Struk</button>';
        receiptHTML += '</div></div>';

        // Tampilkan struk di modal
        document.getElementById("formDelivery").innerHTML = receiptHTML;
        document.getElementById("formDelivery").style.display = "flex";

        // Hapus keranjang dari localStorage setelah pesanan berhasil
        localStorage.removeItem('cartItems');
        localStorage.removeItem('cartTimestamp');  // Tambahkan penghapusan timestamp

        // Hapus status metode yang dipilih setelah pesanan berhasil
        localStorage.removeItem('selectedMethod');

        // Kosongkan keranjang setelah pesanan berhasil
        keranjang = [];
        updateKeranjang();
      } else {
        alert(response.message);
        // Jika gagal, kosongkan keranjang dan reset form
        keranjang = [];
        updateKeranjang();
        btnKirim.disabled = false;
        btnKirim.innerHTML = "Kirim Pesanan";
      }
    }
  })
  .catch(error => {
    console.error('Error:', error);
    // Tampilkan alert karena error tetap penting untuk diketahui user
    alert('Terjadi kesalahan saat menyimpan pesanan');
    // Pastikan keranjang dikosongkan jika terjadi error
    keranjang = [];
    updateKeranjang();
    btnKirim.disabled = false;
    btnKirim.innerHTML = "Kirim Pesanan";
  });
}

// Fungsi untuk menyelesaikan proses delivery receipt dan menutup modal
function selesaiDeliveryReceipt() {
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