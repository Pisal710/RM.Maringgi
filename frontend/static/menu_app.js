
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

// Fungsi untuk cek apakah user sudah login
function checkUserLogin() {
  // Cek apakah ada user_id di sessionStorage (set saat login berhasil)
  const userId = sessionStorage.getItem('user_id');
  const username = sessionStorage.getItem('username');
  return userId && username;
}

// Fungsi untuk redirect ke login dengan menyimpan data
function redirectToLogin() {
  // Simpan keranjang sebelum redirect
  localStorage.setItem('cartItems', JSON.stringify(keranjang));
  localStorage.setItem('cartTimestamp', Date.now().toString());
  
  // Simpan form delivery jika sudah ada
  const formDeliveryDisplay = document.getElementById("formDelivery").style.display;
  if (formDeliveryDisplay === "flex") {
    const deliveryInfo = {
      nama: document.getElementById("nama").value || "",
      hp: document.getElementById("hp").value || "",
      alamat: document.getElementById("alamat").value || "",
      selectedMethod: localStorage.getItem('selectedMethod')
    };
    localStorage.setItem('deliveryInfo', JSON.stringify(deliveryInfo));
  }
  
  // Redirect ke login
  alert("Anda harus login terlebih dahulu untuk memesan!");
  window.location.href = "/login?redirect=/menu";
}

// Event listener untuk semua tombol
document.addEventListener('DOMContentLoaded', function() {
  setupLogoutHandler();

  // Render menu setelah halaman dimuat
  if (typeof renderMenu === 'function') {
    renderMenu();
  }
  
  // RESTORE CART SETELAH LOGIN
  const needsRestore = sessionStorage.getItem('needsRestore');
  const savedCart = localStorage.getItem('cartItems');
  
  if (needsRestore === 'true' && savedCart) {
    try {
      // Parse dan restore keranjang dari localStorage
      const restoredCart = JSON.parse(savedCart);
      keranjang = restoredCart;
      
      console.log('Keranjang direstore:', keranjang);
      
      // Update display keranjang
      if (typeof updateKeranjang === 'function') {
        updateKeranjang();
      }
      
      // Clear flag restore
      sessionStorage.removeItem('needsRestore');
    } catch (e) {
      console.error('Error restore keranjang:', e);
    }
  }
  
  // Cek apakah user sebelumnya telah memilih metode pengantaran
  const selectedMethod = localStorage.getItem('selectedMethod');
  // Muat kembali informasi pengiriman dari localStorage jika tersedia
  const savedDeliveryInfo = localStorage.getItem('deliveryInfo');
  
  if (selectedMethod === 'delivery' || savedDeliveryInfo) {
    try {
      if (savedDeliveryInfo) {
        const deliveryInfo = JSON.parse(savedDeliveryInfo);
        document.getElementById("nama").value = deliveryInfo.nama || "";
        document.getElementById("hp").value = deliveryInfo.hp || "";
        document.getElementById("alamat").value = deliveryInfo.alamat || "";
        
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
      // Cek login sebelum checkout
      if (!checkUserLogin()) {
        redirectToLogin();
        return;
      }
      
      if (keranjang.length === 0) return alert("Keranjang kosong bro!");
      
      localStorage.removeItem('deliveryInfo');
      localStorage.removeItem('selectedMethod');
      
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