// receipt_functions.js - Fungsi-fungsi terkait struk

// Fungsi untuk mencetak struk pengantaran
function printDeliveryReceipt() {
  // Cek apakah window.currentOrder tersedia
  if (!window.currentOrder || !window.currentOrder.deliveryInfo) {
    alert('Data pesanan tidak ditemukan. Tidak dapat mencetak struk.');
    return;
  }

  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head>
        <title>Struk Pesanan Pengantaran</title>
        <style>
          body { font-family: Arial, sans-serif; }
          .receipt { max-width: 400px; margin: 0 auto; padding: 20px; border: 1px solid #ccc; }
          .header { text-align: center; border-bottom: 1px solid #ccc; padding-bottom: 10px; }
          .item { display: flex; justify-content: space-between; margin: 5px 0; }
          .total { display: flex; justify-content: space-between; font-weight: bold; border-top: 1px solid #ccc; padding-top: 10px; margin-top: 10px; }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            <h2>RM Maranggi</h2>
            <p>Struk Pesanan (Pengantaran)</p>
          </div>
          <p>Nama Penerima: ${window.currentOrder.deliveryInfo.nama}</p>
          <p>No. HP: ${window.currentOrder.deliveryInfo.hp}</p>
          <p>Alamat Tujuan: ${window.currentOrder.deliveryInfo.alamat}</p>
          <p>Tanggal: ${window.currentOrder.orderDate.toLocaleDateString()}</p>
          <p>Waktu Order: ${window.currentOrder.orderDate.toLocaleTimeString()}</p>
          <p>Estimasi Sampai: ${window.currentOrder.estimatedTime}</p>
          <hr>
          <div class="items">
            ${window.currentOrder.items.map(item =>
              `<div class="item"><span>${item.nama} x ${item.jumlah}</span><span>Rp ${(item.harga * item.jumlah).toLocaleString('id-ID')}</span></div>`
            ).join('')}
          </div>
          <div class="total">
            <span>Subtotal:</span>
            <span>Rp ${window.currentOrder.subtotal.toLocaleString('id-ID')}</span>
          </div>
          <div class="total">
            <span>PPN (10%):</span>
            <span>Rp ${window.currentOrder.tax.toLocaleString('id-ID')}</span>
          </div>
          <div class="total">
            <span>Total:</span>
            <span>Rp ${window.currentOrder.total.toLocaleString('id-ID')}</span>
          </div>
        </div>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
}

// Fungsi untuk mencetak struk
function printReceipt() {
  // Cek apakah window.currentOrder tersedia
  if (!window.currentOrder) {
    alert('Data pesanan tidak ditemukan. Tidak dapat mencetak struk.');
    return;
  }

  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head>
        <title>Struk Pesanan</title>
        <style>
          body { font-family: Arial, sans-serif; }
          .receipt { max-width: 400px; margin: 0 auto; padding: 20px; border: 1px solid #ccc; }
          .header { text-align: center; border-bottom: 1px solid #ccc; padding-bottom: 10px; }
          .item { display: flex; justify-content: space-between; margin: 5px 0; }
          .total { display: flex; justify-content: space-between; font-weight: bold; border-top: 1px solid #ccc; padding-top: 10px; margin-top: 10px; }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            <h2>RM Maranggi</h2>
            <p>Struk Pesanan (Ambil Sendiri)</p>
          </div>
          <p>Nama: ${sessionStorage.getItem('username') || 'Pelanggan'}</p>
          <p>Tanggal: ${window.currentOrder.orderDate.toLocaleDateString()}</p>
          <p>Waktu Order: ${window.currentOrder.orderDate.toLocaleTimeString()}</p>
          <p>Estimasi Selesai: ${window.currentOrder.estimatedTime}</p>
          <hr>
          <div class="items">
            ${window.currentOrder.items.map(item =>
              `<div class="item"><span>${item.nama} x ${item.jumlah}</span><span>Rp ${(item.harga * item.jumlah).toLocaleString('id-ID')}</span></div>`
            ).join('')}
          </div>
          <div class="total">
            <span>Subtotal:</span>
            <span>Rp ${window.currentOrder.subtotal.toLocaleString('id-ID')}</span>
          </div>
          <div class="total">
            <span>PPN (10%):</span>
            <span>Rp ${window.currentOrder.tax.toLocaleString('id-ID')}</span>
          </div>
          <div class="total">
            <span>Total:</span>
            <span>Rp ${window.currentOrder.total.toLocaleString('id-ID')}</span>
          </div>
        </div>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
}

// Pilih Ambil Sendiri → tampilkan struk dan estimasi waktu
function pilihTakeaway() {
  document.getElementById("pilihMetode").style.display = "none";

  // Hitung total waktu persiapan (misalnya 10 menit per item)
  const totalTime = Math.max(keranjang.length * 10, 15); // Minimal 15 menit

  // Buat estimasi waktu selesai
  const now = new Date();
  const estimatedTime = new Date(now.getTime() + totalTime * 60000); // tambahkan menit dalam milidetik
  const formattedTime = estimatedTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

  // Hitung total biaya
  const subtotal = keranjang.reduce((s, i) => s + i.harga * i.jumlah, 0);
  const tax = subtotal * 0.1; // PPN 10%
  const total = subtotal + tax;

  // Buat struk pesanan
  let receiptHTML = '<div style="background:white; color:black; padding:20px; border-radius:10px; max-height:70vh; overflow-y:auto;">';
  receiptHTML += '<h2 style="text-align:center; color:#e74c3c;">Struk Pesanan (Ambil Sendiri)</h2>';
  receiptHTML += '<p><strong>Nama:</strong> ' + (sessionStorage.getItem('username') || 'Pelanggan') + '</p>';
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
  receiptHTML += `<p style="font-size:1.2em; color:#e74c3c;"><strong>Estimasi Selesai:</strong> ${formattedTime}</p>`;
  receiptHTML += '<p style="font-style:italic;">Silakan ambil pesanan Anda sesuai estimasi waktu di atas.</p>';
  receiptHTML += '<div style="text-align:center; margin-top:20px;">';
  receiptHTML += '<button onclick="selesaiTakeaway()" style="padding:10px 20px; background:#27ae60; color:white; border:none; border-radius:5px; margin:0 5px;">Tutup</button>';
  receiptHTML += '<button onclick="printReceipt()" style="padding:10px 20px; background:#3498db; color:white; border:none; border-radius:5px; margin:0 5px;">Cetak Struk</button>';
  receiptHTML += '</div></div>';

  // Tampilkan struk
  document.getElementById("pilihMetode").innerHTML = receiptHTML;
  document.getElementById("pilihMetode").style.display = "flex";

  // Simpan data pesanan ke variabel sementara untuk pencetakan
  window.currentOrder = {
    items: [...keranjang],
    subtotal: subtotal,
    tax: tax,
    total: total,
    estimatedTime: formattedTime,
    orderDate: now
  };

  // Kirim pesanan ke server setelah menampilkan struk
  const data = {
    items: keranjang,
    subtotal: subtotal
  };

  // Simpan keranjang ke localStorage dengan timestamp
  localStorage.setItem('cartItems', JSON.stringify(keranjang));
  localStorage.setItem('cartTimestamp', Date.now().toString());

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
      // Keranjang sudah disimpan sebelumnya, jadi tidak akan hilang
      window.location.href = response.redirect;
    } else {
      if(!response.success) {
        alert('Gagal menyimpan pesanan: ' + response.message);
        // Kosongkan keranjang jika gagal menyimpan
        keranjang = [];
        updateKeranjang();
      } else {
        // Hapus keranjang dari localStorage setelah pesanan berhasil
        localStorage.removeItem('cartItems');
        localStorage.removeItem('cartTimestamp');  // Tambahkan penghapusan timestamp
        // Update keranjang setelah berhasil menyimpan
        keranjang = [];
        updateKeranjang();
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
  });
}

// Fungsi untuk menyelesaikan proses takeaway dan kembali ke menu
function selesaiTakeaway() {
  document.getElementById("pilihMetode").style.display = "none";
  // Reset kembali konten modal ke versi semula
  document.getElementById("pilihMetode").innerHTML = `
    <div style="background:#00435b; color:white; padding:40px 30px; border-radius:10px; width:90%; max-width:380px; text-align:center;">
      <h2 style="margin-bottom:30px; color:#f5f5f5; font-size:1.8em;">Pilih Cara Ambil</h2>
      <button id="btnDelivery" style="width:100%; padding:18px; margin:12px 0; background:#ffffff; color:rgb(0, 0, 0); border:none; border-radius:12px; font-size:1.2em; font-weight:bold;">Antar ke Tempat</button>
      <button id="btnTakeaway" style="width:100%; padding:18px; margin:12px 0; background:#ffffff; color:rgb(0, 0, 0); border:none; border-radius:12px; font-size:1.2em; font-weight:bold;">Ambil Sendiri</button>
    </div>
  `;
  // Hapus status metode yang dipilih saat selesai
  localStorage.removeItem('selectedMethod');
}

// Pilih Antar
function pilihDelivery() {
  document.getElementById("pilihMetode").style.display = "none";
  document.getElementById("formDelivery").style.display = "flex";
  // Simpan status bahwa user memilih delivery
  localStorage.setItem('selectedMethod', 'delivery');
  // Kosongkan input sebelum menampilkan form
  document.getElementById("nama").value = "";
  document.getElementById("hp").value = "";
  document.getElementById("alamat").value = "";
  document.getElementById("locationStatus").innerHTML = "";

  // Secara otomatis minta akses lokasi ketika form ditampilkan
  setTimeout(() => {
    getLocationFromBrowser();
  }, 1000); // Memberi waktu 1 detik agar form muncul dulu sebelum permintaan lokasi
}

// Export fungsi-fungsi jika menggunakan module system
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { printDeliveryReceipt, printReceipt, pilihTakeaway, selesaiTakeaway, pilihDelivery };
}