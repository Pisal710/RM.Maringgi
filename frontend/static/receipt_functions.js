// Fungsi untuk mencetak struk pengantaran
function printDeliveryReceipt() {
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

// Pilih Ambil Sendiri → tampilkan pilihan pembayaran
function pilihTakeaway() {
  document.getElementById("pilihMetode").style.display = "none";

  // Hitung total waktu persiapan
  const totalTime = Math.max(keranjang.length * 10, 15); // Minimal 15 menit

  // Hitung total biaya
  const subtotal = keranjang.reduce((s, i) => s + i.harga * i.jumlah, 0);
  const tax = subtotal * 0.1; // PPN 10%
  const total = subtotal + tax;

  // Tampilkan pilihan metode pembayaran untuk takeaway
  showTakeawayPaymentMethod(subtotal, tax, total);
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