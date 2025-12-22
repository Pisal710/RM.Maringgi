// menu_app.js - File utama yang menggabungkan semua modul

// Kita tidak perlu import karena semua file akan dimuat sebagai script terpisah
// Tapi kita perlu memastikan semua fungsi terdaftar di sini dan siap digunakan

// Fungsi untuk membersihkan semua data lokal saat logout
function setupLogoutHandler() {
  // Tambahkan event listener untuk semua link logout di halaman
  const logoutLinks = document.querySelectorAll('a[href="/logout"], a[href*="logout"]');
  logoutLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // Hapus semua data dari localStorage saat logout
      localStorage.removeItem('cartItems');
      localStorage.removeItem('deliveryInfo');
      localStorage.removeItem('selectedMethod');
    });
  });
}

// Event listener untuk semua tombol
document.addEventListener('DOMContentLoaded', function() {
  // Setup handler untuk logout
  setupLogoutHandler();

  // Render menu setelah halaman dimuat
  if (typeof renderMenu === 'function') {
    renderMenu();
  }
  
  // Cek apakah user sebelumnya telah memilih metode pengantaran
  const selectedMethod = localStorage.getItem('selectedMethod');
  // Muat kembali informasi pengiriman dari localStorage jika tersedia
  const savedDeliveryInfo = localStorage.getItem('deliveryInfo');
  
  if (selectedMethod === 'delivery' || savedDeliveryInfo) {
    try {
      // Jika sebelumnya memilih delivery atau ada informasi pengiriman tersimpan
      if (savedDeliveryInfo) {
        const deliveryInfo = JSON.parse(savedDeliveryInfo);
        // Isi form pengiriman dengan data yang tersimpan
        document.getElementById("nama").value = deliveryInfo.nama || "";
        document.getElementById("hp").value = deliveryInfo.hp || "";
        document.getElementById("alamat").value = deliveryInfo.alamat || "";
        
        // Muat kembali informasi lokasi jika tersedia
        if (deliveryInfo.location) {
          window.deliveryLocation = deliveryInfo.location;
        }
      }
      
      // Tampilkan form pengiriman langsung
      document.getElementById("pilihMetode").style.display = "none";
      document.getElementById("formDelivery").style.display = "flex";
    } catch (e) {
      console.error('Error memuat informasi pengiriman:', e);
    }
  }
  
  // Tombol checkout
  const checkoutBtn = document.getElementById("checkoutBtn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (keranjang.length === 0) return alert("Keranjang kosong bro!");
      
      // Hapus informasi pengiriman lama jika ada
      localStorage.removeItem('deliveryInfo');
      localStorage.removeItem('selectedMethod');
      
      // Simpan keranjang ke localStorage sebelum menampilkan pilihan metode
      localStorage.setItem('cartItems', JSON.stringify(keranjang));
      
      document.getElementById("pilihMetode").style.display = "flex";
    });
  }
  
  // Tombol pilih delivery di modal
  const btnDelivery = document.getElementById("btnDelivery");
  if (btnDelivery) {
    btnDelivery.addEventListener("click", pilihDelivery);
  }
  
  // Tombol pilih takeaway di modal
  const btnTakeaway = document.getElementById("btnTakeaway");
  if (btnTakeaway) {
    btnTakeaway.addEventListener("click", pilihTakeaway);
  }
  
  // Tombol ambil lokasi
  const getLocationBtn = document.getElementById("getLocationBtn");
  if (getLocationBtn) {
    getLocationBtn.addEventListener("click", getLocationFromBrowser);
  }
  
  // Tombol batal delivery
  const btnBatalDelivery = document.getElementById("btnBatalDelivery");
  if (btnBatalDelivery) {
    btnBatalDelivery.addEventListener("click", batalDelivery);
  }
  
  // Tombol kirim delivery
  const btnKirimDelivery = document.getElementById("btnKirimDelivery");
  if (btnKirimDelivery) {
    btnKirimDelivery.addEventListener("click", kirimDelivery);
  }
});