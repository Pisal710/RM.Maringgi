// payment_functions.js - Fungsi-fungsi terkait pembayaran

// Generate Virtual Account Number (format: 900 + 6 digit nomor acak)
function generateVirtualAccount() {
  const randomNum = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `900${randomNum}`;
}

// Tampilkan pilihan metode pembayaran untuk DELIVERY
function showDeliveryPaymentMethod(nama, hp, alamat, subtotal, tax, total) {
  const paymentHTML = `
    <div style="background:white; color:black; padding:20px; border-radius:10px; max-height:70vh; overflow-y:auto;">
      <h2 style="text-align:center; color:#e74c3c;">Pilih Metode Pembayaran</h2>
      <p style="text-align:center; font-weight:bold; margin-bottom:20px;">Metode Pengiriman: <span style="color:#006aff;">Antar ke Tempat</span></p>
      
      <div style="margin:20px 0;">
        <p style="font-weight:bold; margin-bottom:10px;">Total Pembayaran: <span style="font-size:1.3em; color:#27ae60;">Rp ${total.toLocaleString('id-ID')}</span></p>
      </div>

      <hr style="margin:20px 0;">
      
      <div style="margin:15px 0;">
        <button onclick="processDeliveryCOD('${nama}', '${hp}', '${alamat}', ${subtotal}, ${tax}, ${total})" 
          style="width:100%; padding:15px; margin:10px 0; background:#27ae60; color:white; border:none; border-radius:8px; font-size:1.1em; font-weight:bold; cursor:pointer;">
          💰 COD (Bayar di Tempat)
        </button>
        <p style="font-size:0.9em; color:#666; margin:5px 0 10px 0;">Bayar langsung saat pesanan tiba di alamat Anda</p>
      </div>

      <div style="margin:15px 0;">
        <button onclick="processDeliveryTransfer('${nama}', '${hp}', '${alamat}', ${subtotal}, ${tax}, ${total})" 
          style="width:100%; padding:15px; margin:10px 0; background:#006aff; color:white; border:none; border-radius:8px; font-size:1.1em; font-weight:bold; cursor:pointer;">
          🏦 Transfer Bank (Virtual Account)
        </button>
        <p style="font-size:0.9em; color:#666; margin:5px 0 10px 0;">Bayar via transfer bank ke nomor virtual account kami</p>
      </div>

      <hr style="margin:20px 0;">
      
      <div style="text-align:center;">
        <button onclick="batalPaymentDelivery()" 
          style="padding:10px 20px; background:#e74c3c; color:white; border:none; border-radius:5px; font-size:1em; cursor:pointer;">
          ← Kembali
        </button>
      </div>
    </div>
  `;
  
  document.getElementById("formDelivery").innerHTML = paymentHTML;
  document.getElementById("formDelivery").style.display = "flex";
}

function showTakeawayPaymentMethod(subtotal, tax, total) {
  const paymentHTML = `
    <div style="background:white; color:black; padding:20px; border-radius:10px; max-height:70vh; overflow-y:auto;">
      <h2 style="text-align:center; color:#e74c3c;">Pilih Metode Pembayaran</h2>
      <p style="text-align:center; font-weight:bold; margin-bottom:20px;">Metode Pengambilan: <span style="color:#006aff;">Ambil Sendiri</span></p>
      
      <div style="margin:20px 0;">
        <p style="font-weight:bold; margin-bottom:10px;">Total Pembayaran: <span style="font-size:1.3em; color:#27ae60;">Rp ${total.toLocaleString('id-ID')}</span></p>
      </div>

      <hr style="margin:20px 0;">
      
      <div style="margin:15px 0;">
        <button onclick="processTakeawayCash(${subtotal}, ${tax}, ${total})" 
          style="width:100%; padding:15px; margin:10px 0; background:#27ae60; color:white; border:none; border-radius:8px; font-size:1.1em; font-weight:bold; cursor:pointer;">
          💰 Bayar di Tempat
        </button>
        <p style="font-size:0.9em; color:#666; margin:5px 0 10px 0;">Bayar langsung saat mengambil pesanan</p>
      </div>

      <div style="margin:15px 0;">
        <button onclick="processTakeawayTransfer(${subtotal}, ${tax}, ${total})" 
          style="width:100%; padding:15px; margin:10px 0; background:#006aff; color:white; border:none; border-radius:8px; font-size:1.1em; font-weight:bold; cursor:pointer;">
          🏦 Transfer Bank (Virtual Account)
        </button>
        <p style="font-size:0.9em; color:#666; margin:5px 0 10px 0;">Bayar via transfer bank ke nomor virtual account kami</p>
      </div>

      <hr style="margin:20px 0;">
      
      <div style="text-align:center;">
        <button onclick="batalPaymentTakeaway()" 
          style="padding:10px 20px; background:#e74c3c; color:white; border:none; border-radius:5px; font-size:1em; cursor:pointer;">
          ← Kembali
        </button>
      </div>
    </div>
  `;
  
  document.getElementById("pilihMetode").innerHTML = paymentHTML;
  document.getElementById("pilihMetode").style.display = "flex";
}

// DELIVERY - COD
function processDeliveryCOD(nama, hp, alamat, subtotal, tax, total) {
  const now = new Date();
  const deliveryTime = 30 + (keranjang.length * 5);
  const estimatedTime = new Date(now.getTime() + deliveryTime * 60000);
  const formattedTime = estimatedTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

  window.currentOrder = {
    items: [...keranjang],
    subtotal: subtotal,
    tax: tax,
    total: total,
    estimatedTime: formattedTime,
    orderDate: now,
    deliveryInfo: { nama, hp, alamat },
    paymentMethod: 'COD',
    paymentStatus: 'Pending'
  };

  showDeliveryReceipt(nama, hp, alamat, subtotal, tax, total, formattedTime, 'COD', null);
}

// DELIVERY - TRANSFER
function processDeliveryTransfer(nama, hp, alamat, subtotal, tax, total) {
  const vaNumber = generateVirtualAccount();
  const now = new Date();
  const deliveryTime = 30 + (keranjang.length * 5);
  const estimatedTime = new Date(now.getTime() + deliveryTime * 60000);
  const formattedTime = estimatedTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

  window.currentOrder = {
    items: [...keranjang],
    subtotal: subtotal,
    tax: tax,
    total: total,
    estimatedTime: formattedTime,
    orderDate: now,
    deliveryInfo: { nama, hp, alamat },
    paymentMethod: 'Transfer',
    paymentStatus: 'Pending - Menunggu Verifikasi',
    virtualAccount: vaNumber
  };

  showDeliveryReceipt(nama, hp, alamat, subtotal, tax, total, formattedTime, 'Transfer', vaNumber);
}

// TAKEAWAY - CASH
function processTakeawayCash(subtotal, tax, total) {
  const totalTime = Math.max(keranjang.length * 10, 15);
  const now = new Date();
  const estimatedTime = new Date(now.getTime() + totalTime * 60000);
  const formattedTime = estimatedTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

  window.currentOrder = {
    items: [...keranjang],
    subtotal: subtotal,
    tax: tax,
    total: total,
    estimatedTime: formattedTime,
    orderDate: now,
    paymentMethod: 'Bayar di Tempat',
    paymentStatus: 'Pending'
  };

  showTakeawayReceipt(subtotal, tax, total, formattedTime, 'Bayar di Tempat', null);
}

// TAKEAWAY - TRANSFER
function processTakeawayTransfer(subtotal, tax, total) {
  const vaNumber = generateVirtualAccount();
  const totalTime = Math.max(keranjang.length * 10, 15);
  const now = new Date();
  const estimatedTime = new Date(now.getTime() + totalTime * 60000);
  const formattedTime = estimatedTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

  window.currentOrder = {
    items: [...keranjang],
    subtotal: subtotal,
    tax: tax,
    total: total,
    estimatedTime: formattedTime,
    orderDate: now,
    paymentMethod: 'Transfer',
    paymentStatus: 'Pending - Menunggu Verifikasi',
    virtualAccount: vaNumber
  };

  showTakeawayReceipt(subtotal, tax, total, formattedTime, 'Transfer', vaNumber);
}

// Tampilkan Struk DELIVERY dengan informasi pembayaran
function showDeliveryReceipt(nama, hp, alamat, subtotal, tax, total, estimatedTime, paymentMethod, vaNumber) {
  let receiptHTML = '<div style="background:white; color:black; padding:20px; border-radius:10px; max-height:70vh; overflow-y:auto;">';
  receiptHTML += '<h2 style="text-align:center; color:#e74c3c;">✓ Pesanan Berhasil Dibuat</h2>';
  receiptHTML += '<p style="text-align:center; font-size:0.9em; color:#666; margin-bottom:20px;">Metode Pengiriman: Antar ke Tempat</p>';
  
  receiptHTML += '<hr style="margin:10px 0;">';
  receiptHTML += '<h3 style="margin:15px 0 10px 0;">📍 Informasi Pengiriman:</h3>';
  receiptHTML += '<p><strong>Nama Penerima:</strong> ' + nama + '</p>';
  receiptHTML += '<p><strong>No. HP:</strong> ' + hp + '</p>';
  receiptHTML += '<p><strong>Alamat Tujuan:</strong> ' + alamat + '</p>';
  
  receiptHTML += '<hr style="margin:10px 0;">';
  receiptHTML += '<h3 style="margin:15px 0 10px 0;">🕐 Informasi Pesanan:</h3>';
  receiptHTML += '<p><strong>Tanggal:</strong> ' + window.currentOrder.orderDate.toLocaleDateString() + '</p>';
  receiptHTML += '<p><strong>Waktu Order:</strong> ' + window.currentOrder.orderDate.toLocaleTimeString() + '</p>';
  receiptHTML += '<p><strong>Estimasi Sampai:</strong> ' + estimatedTime + '</p>';

  receiptHTML += '<hr style="margin:10px 0;">';
  receiptHTML += '<h3 style="margin:15px 0 10px 0;">🍽️ Rincian Pesanan:</h3>';
  keranjang.forEach(item => {
    receiptHTML += `<p>${item.nama} x ${item.jumlah} = Rp ${(item.harga * item.jumlah).toLocaleString('id-ID')}</p>`;
  });

  receiptHTML += '<hr style="margin:10px 0;">';
  receiptHTML += '<h3 style="margin:15px 0 10px 0;">💰 Rincian Pembayaran:</h3>';
  receiptHTML += `<p><strong>Subtotal:</strong> Rp ${subtotal.toLocaleString('id-ID')}</p>`;
  receiptHTML += `<p><strong>PPN (10%):</strong> Rp ${tax.toLocaleString('id-ID')}</p>`;
  receiptHTML += `<p style="font-size:1.2em; font-weight:bold;"><strong>Total:</strong> Rp ${total.toLocaleString('id-ID')}</p>`;
  
  receiptHTML += '<hr style="margin:10px 0;">';
  if (paymentMethod === 'COD') {
    receiptHTML += '<h3 style="margin:15px 0 10px 0;">💳 Metode Pembayaran:</h3>';
    receiptHTML += '<p style="background:#e8f5e9; padding:15px; border-radius:5px; border-left:4px solid #27ae60;">';
    receiptHTML += '<strong style="color:#27ae60;">COD (Bayar di Tempat)</strong><br>';
    receiptHTML += 'Anda akan membayar <strong>Rp ' + total.toLocaleString('id-ID') + '</strong> saat pesanan tiba di alamat Anda.';
    receiptHTML += '</p>';
  } else if (paymentMethod === 'Transfer') {
    receiptHTML += '<h3 style="margin:15px 0 10px 0;">💳 Metode Pembayaran:</h3>';
    receiptHTML += '<p style="background:#e3f2fd; padding:15px; border-radius:5px; border-left:4px solid #006aff;">';
    receiptHTML += '<strong style="color:#006aff;">Transfer Bank - Virtual Account</strong><br>';
    receiptHTML += 'Nomor Virtual Account: <span style="font-size:1.2em; font-weight:bold; color:#006aff; font-family:monospace;">' + vaNumber + '</span><br>';
    receiptHTML += 'Total Transfer: <strong>Rp ' + total.toLocaleString('id-ID') + '</strong><br>';
    receiptHTML += '<span style="font-size:0.9em; color:#666;">Status: Menunggu Verifikasi Pembayaran</span>';
    receiptHTML += '</p>';
  }

  receiptHTML += '<p style="margin-top:15px; padding:15px; background:#fff3cd; border-radius:5px; border-left:4px solid #ffc107; font-size:0.95em;">';
  receiptHTML += '📌 <strong>Catatan:</strong> Pesanan Anda sedang diproses. Admin akan mengkonfirmasi pesanan setelah pembayaran terverifikasi.';
  receiptHTML += '</p>';
  
  receiptHTML += '<div style="text-align:center; margin-top:20px;">';
  receiptHTML += '<button onclick="selesaiDeliveryReceipt()" style="padding:10px 20px; background:#27ae60; color:white; border:none; border-radius:5px; margin:0 5px; cursor:pointer;">Tutup</button>';
  receiptHTML += '<button onclick="printDeliveryReceipt()" style="padding:10px 20px; background:#3498db; color:white; border:none; border-radius:5px; margin:0 5px; cursor:pointer;">🖨️ Cetak Struk</button>';
  receiptHTML += '</div></div>';

  document.getElementById("formDelivery").innerHTML = receiptHTML;
  document.getElementById("formDelivery").style.display = "flex";

  // Hapus keranjang dari localStorage
  localStorage.removeItem('cartItems');
  localStorage.removeItem('cartTimestamp');
  localStorage.removeItem('selectedMethod');
  keranjang = [];
  updateKeranjang();
}

// Tampilkan Struk TAKEAWAY dengan informasi pembayaran
function showTakeawayReceipt(subtotal, tax, total, estimatedTime, paymentMethod, vaNumber) {
  let receiptHTML = '<div style="background:white; color:black; padding:20px; border-radius:10px; max-height:70vh; overflow-y:auto;">';
  receiptHTML += '<h2 style="text-align:center; color:#e74c3c;">✓ Pesanan Berhasil Dibuat</h2>';
  receiptHTML += '<p style="text-align:center; font-size:0.9em; color:#666; margin-bottom:20px;">Metode Pengambilan: Ambil Sendiri</p>';
  
  receiptHTML += '<hr style="margin:10px 0;">';
  receiptHTML += '<h3 style="margin:15px 0 10px 0;">🕐 Informasi Pesanan:</h3>';
  receiptHTML += '<p><strong>Nama:</strong> ' + (sessionStorage.getItem('username') || 'Pelanggan') + '</p>';
  receiptHTML += '<p><strong>Tanggal:</strong> ' + window.currentOrder.orderDate.toLocaleDateString() + '</p>';
  receiptHTML += '<p><strong>Waktu Order:</strong> ' + window.currentOrder.orderDate.toLocaleTimeString() + '</p>';
  receiptHTML += '<p><strong>Estimasi Selesai:</strong> ' + estimatedTime + '</p>';

  receiptHTML += '<hr style="margin:10px 0;">';
  receiptHTML += '<h3 style="margin:15px 0 10px 0;">🍽️ Rincian Pesanan:</h3>';
  keranjang.forEach(item => {
    receiptHTML += `<p>${item.nama} x ${item.jumlah} = Rp ${(item.harga * item.jumlah).toLocaleString('id-ID')}</p>`;
  });

  receiptHTML += '<hr style="margin:10px 0;">';
  receiptHTML += '<h3 style="margin:15px 0 10px 0;">💰 Rincian Pembayaran:</h3>';
  receiptHTML += `<p><strong>Subtotal:</strong> Rp ${subtotal.toLocaleString('id-ID')}</p>`;
  receiptHTML += `<p><strong>PPN (10%):</strong> Rp ${tax.toLocaleString('id-ID')}</p>`;
  receiptHTML += `<p style="font-size:1.2em; font-weight:bold;"><strong>Total:</strong> Rp ${total.toLocaleString('id-ID')}</p>`;
  
  receiptHTML += '<hr style="margin:10px 0;">';
  if (paymentMethod === 'Bayar di Tempat') {
    receiptHTML += '<h3 style="margin:15px 0 10px 0;">💳 Metode Pembayaran:</h3>';
    receiptHTML += '<p style="background:#e8f5e9; padding:15px; border-radius:5px; border-left:4px solid #27ae60;">';
    receiptHTML += '<strong style="color:#27ae60;">Bayar di Tempat</strong><br>';
    receiptHTML += 'Anda akan membayar <strong>Rp ' + total.toLocaleString('id-ID') + '</strong> saat mengambil pesanan.';
    receiptHTML += '</p>';
  } else if (paymentMethod === 'Transfer') {
    receiptHTML += '<h3 style="margin:15px 0 10px 0;">💳 Metode Pembayaran:</h3>';
    receiptHTML += '<p style="background:#e3f2fd; padding:15px; border-radius:5px; border-left:4px solid #006aff;">';
    receiptHTML += '<strong style="color:#006aff;">Transfer Bank - Virtual Account</strong><br>';
    receiptHTML += 'Nomor Virtual Account: <span style="font-size:1.2em; font-weight:bold; color:#006aff; font-family:monospace;">' + vaNumber + '</span><br>';
    receiptHTML += 'Total Transfer: <strong>Rp ' + total.toLocaleString('id-ID') + '</strong><br>';
    receiptHTML += '<span style="font-size:0.9em; color:#666;">Status: Menunggu Verifikasi Pembayaran</span>';
    receiptHTML += '</p>';
  }

  receiptHTML += '<p style="margin-top:15px; padding:15px; background:#fff3cd; border-radius:5px; border-left:4px solid #ffc107; font-size:0.95em;">';
  receiptHTML += '📌 <strong>Catatan:</strong> Silakan ambil pesanan sesuai estimasi waktu di atas.';
  receiptHTML += '</p>';

  receiptHTML += '<div style="text-align:center; margin-top:20px;">';
  receiptHTML += '<button onclick="selesaiTakeaway()" style="padding:10px 20px; background:#27ae60; color:white; border:none; border-radius:5px; margin:0 5px; cursor:pointer;">Tutup</button>';
  receiptHTML += '<button onclick="printReceipt()" style="padding:10px 20px; background:#3498db; color:white; border:none; border-radius:5px; margin:0 5px; cursor:pointer;">🖨️ Cetak Struk</button>';
  receiptHTML += '</div></div>';

  document.getElementById("pilihMetode").innerHTML = receiptHTML;
  document.getElementById("pilihMetode").style.display = "flex";

  // Hapus keranjang dari localStorage
  localStorage.removeItem('cartItems');
  localStorage.removeItem('cartTimestamp');
  localStorage.removeItem('selectedMethod');
  keranjang = [];
  updateKeranjang();
}

// Fungsi untuk mengirim order ke backend
function submitOrder() {
  if (!window.currentOrder) {
    alert('Data order tidak ditemukan!');
    return;
  }

  // Format delivery info untuk backend
  let deliveryInfoForBackend = null;
  if (window.currentOrder.deliveryInfo) {
    deliveryInfoForBackend = {
      nama: window.currentOrder.deliveryInfo.nama || '',
      hp: window.currentOrder.deliveryInfo.hp || '',
      alamat: window.currentOrder.deliveryInfo.alamat || ''
    };
  }

  // Persiapkan data untuk dikirim ke backend
  const orderData = {
    items: window.currentOrder.items.map(item => ({
      id: item.id,
      nama: item.nama,
      harga: item.harga,
      jumlah: item.jumlah
    })),
    total: window.currentOrder.total,
    order_type: window.currentOrder.deliveryInfo ? 'delivery' : 'takeaway',
    payment_method: window.currentOrder.paymentMethod === 'COD' ? 'COD' : 
                   (window.currentOrder.paymentMethod === 'Bayar di Tempat' ? 'Cash' : 'Transfer'),
    payment_status: window.currentOrder.paymentStatus,
    virtual_account: window.currentOrder.virtualAccount || null,
    delivery_info: deliveryInfoForBackend
  };

  // Kirim ke backend
  fetch('/menu', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(orderData)
  })
  .then(response => {
    // Handle berbagai status code response
    if (response.status === 401) {
      // Unauthorized - user belum login
      return response.json().then(data => {
        throw {isUnauthorized: true, ...data};
      });
    }
    return response.json().then(data => ({status: response.status, ...data}));
  })
  .then(data => {
    if (data.success) {
      console.log('Order berhasil disimpan:', data);
      
      // CLEAR SAVED CART & DELIVERY INFO SETELAH ORDER SUKSES
      localStorage.removeItem('cartItems');
      localStorage.removeItem('cartTimestamp');
      localStorage.removeItem('deliveryInfo');
      localStorage.removeItem('selectedMethod');
      
      // Clear keranjang di memory juga
      if (typeof keranjang !== 'undefined') {
        keranjang = [];
        if (typeof updateKeranjang === 'function') {
          updateKeranjang();
        }
      }
      
      // Tampilkan success message
      alert('✓ Pesanan Anda telah berhasil diterima!\n\nSilakan tunggu konfirmasi dari kami.');
    } else if (data.isUnauthorized && data.redirect) {
      // User belum login, simpan keranjang dan redirect ke login
      console.log('User belum login, redirecting ke:', data.redirect);
      localStorage.setItem('cartItems', JSON.stringify(window.currentOrder.items || keranjang));
      localStorage.setItem('cartTimestamp', Date.now().toString());
      sessionStorage.setItem('needsRestore', 'true');
      window.location.href = data.redirect;
    } else {
      // Error lainnya
      console.error('Error:', data.message);
      alert('❌ Gagal menyimpan pesanan: ' + data.message);
    }
  })
  .catch(error => {
    console.error('Error:', error);
    
    // Handle unauthorized error
    if (error.isUnauthorized && error.redirect) {
      console.log('Unauthorized error, redirecting ke:', error.redirect);
      localStorage.setItem('cartItems', JSON.stringify(window.currentOrder.items || keranjang));
      localStorage.setItem('cartTimestamp', Date.now().toString());
      sessionStorage.setItem('needsRestore', 'true');
      window.location.href = error.redirect;
    } else {
      alert('❌ Terjadi kesalahan: ' + (error.message || error));
    }
  });
}

// Fungsi untuk menyelesaikan takeaway receipt
function selesaiTakeaway() {
  // Kirim order ke backend sebelum tutup
  submitOrder();
  
  document.getElementById("pilihMetode").style.display = "none";
  // Hapus status metode yang dipilih saat selesai
  localStorage.removeItem('selectedMethod');
}

// Batal dari payment method DELIVERY
function batalPaymentDelivery() {
  document.getElementById("formDelivery").style.display = "none";
}

// Batal dari payment method TAKEAWAY
function batalPaymentTakeaway() {
  document.getElementById("pilihMetode").style.display = "none";
}

// Export fungsi-fungsi
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    generateVirtualAccount, 
    showDeliveryPaymentMethod, 
    showTakeawayPaymentMethod,
    processDeliveryCOD,
    processDeliveryTransfer,
    processTakeawayCash,
    processTakeawayTransfer
  };
}