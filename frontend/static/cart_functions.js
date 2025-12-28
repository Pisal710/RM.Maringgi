// cart_functions.js - Fungsi-fungsi terkait keranjang belanja

// Keranjang belanja
let keranjang = [];

// Membersihkan data lama sebelum proses normal
function cleanOldDataIfNeeded() {
  // Periksa apakah ada cartItems tanpa cartTimestamp atau data lama tanpa timestamp
  const savedCart = localStorage.getItem('cartItems');
  const cartTimestamp = localStorage.getItem('cartTimestamp');

  // Jika ada cartItems tapi tidak ada timestamp, mungkin ini dari implementasi sebelumnya
  // dan kita anggap sudah kadaluarsa
  if (savedCart && !cartTimestamp) {
    // Data tanpa timestamp kemungkinan besar data lama, hapus
    localStorage.removeItem('cartItems');
    console.log('Data keranjang lama tanpa timestamp dihapus');
  }
}

// Muat keranjang dari localStorage saat halaman dimuat
window.addEventListener('DOMContentLoaded', () => {
  // Bersihkan data lama jika perlu
  cleanOldDataIfNeeded();

  const savedCart = localStorage.getItem('cartItems');
  const cartTimestamp = localStorage.getItem('cartTimestamp');

  if (savedCart) {
    try {
      keranjang = JSON.parse(savedCart);

      // Validasi timestamp jika ada
      let isCartValid = true;
      if (cartTimestamp) {
        const savedTime = parseInt(cartTimestamp);
        const currentTime = Date.now();
        // Hapus data jika lebih dari 1 jam (3600000 ms)
        const oneHour = 3600000;
        if ((currentTime - savedTime) > oneHour) {
          isCartValid = false;
          localStorage.removeItem('cartItems');
          localStorage.removeItem('cartTimestamp');
          console.log('Data keranjang lama (>1 jam) dihapus');
        }
      }

      // Jika data valid dan tidak kosong, tampilkan
      if (isCartValid && keranjang && Array.isArray(keranjang) && keranjang.length > 0) {
        updateKeranjang();
      } else if (!isCartValid) {
        // Data tidak valid, kosongkan
        keranjang = [];
        localStorage.removeItem('cartItems');
        localStorage.removeItem('cartTimestamp');
      } else if (keranjang && Array.isArray(keranjang) && keranjang.length === 0) {
        // Jika keranjang kosong setelah parsing, kosongkan localStorage
        localStorage.removeItem('cartItems');
        localStorage.removeItem('cartTimestamp');
      }
    } catch (e) {
      console.error('Error memuat keranjang dari localStorage:', e);
      // Jika terjadi error parsing, hapus data yang rusak
      localStorage.removeItem('cartItems');
      localStorage.removeItem('cartTimestamp');
    }
  }
});

function updateKeranjang() {
  const list = document.getElementById("listKeranjang");
  if (keranjang.length === 0) {
    list.innerHTML = "Keranjang kosong bro...";
    document.getElementById("subtotal").textContent = "Subtotal: Rp 0";
    return;
  }

  let total = 0;
  list.innerHTML = "";
  keranjang.forEach((item, index) => {
    const subtotalItem = item.harga * item.jumlah;
    total += subtotalItem;

    const div = document.createElement("div");
    div.className = "keranjang-item";
    div.style.cssText = "display:flex; justify-content:space-between; align-items:center; padding:12px 0; border-bottom:1px solid #555; font-size:1em;";

    div.innerHTML = `
      <div style="flex:1;">
        <strong>${item.nama}</strong>
      </div>
      <div style="display:flex; align-items:center; gap:10px;">
        <button onclick="kurangiItem(${index})" style="width:32px; height:32px; background:#e74c3c; color:white; border:none; border-radius:50%; font-weight:bold; font-size:1.1em;">−</button>
        <span style="min-width:30px; text-align:center; font-weight:bold;">${item.jumlah}</span>
        <button onclick="tambahItem(${index})" style="width:32px; height:32px; background:#27ae60; color:white; border:none; border-radius:50%; font-weight:bold;">+</button>
      </div>
      <div style="margin-left:15px; font-weight:bold;">
        Rp ${subtotalItem.toLocaleString('id-ID')}
      </div>
    `;
    list.appendChild(div);
  });

  document.getElementById("subtotal").textContent =
    `Subtotal: Rp ${total.toLocaleString('id-ID')}`;
}

// Tambah jumlah item
function tambahItem(index) {
  keranjang[index].jumlah += 1;
  // Simpan keranjang ke localStorage dengan timestamp
  localStorage.setItem('cartItems', JSON.stringify(keranjang));
  localStorage.setItem('cartTimestamp', Date.now().toString());
  updateKeranjang();
}

// Kurangi jumlah item (kalau jadi 0 → hapus dari keranjang)
function kurangiItem(index) {
  keranjang[index].jumlah -= 1;
  if (keranjang[index].jumlah <= 0) {
    keranjang.splice(index, 1); // hapus item dari array
  }
  // Simpan keranjang ke localStorage dengan timestamp
  localStorage.setItem('cartItems', JSON.stringify(keranjang));
  localStorage.setItem('cartTimestamp', Date.now().toString());
  updateKeranjang();
}

// Export fungsi-fungsi jika menggunakan module system
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { keranjang, updateKeranjang, tambahItem, kurangiItem };
}