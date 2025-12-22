// menu_functions.js - Fungsi-fungsi terkait menu makanan

// Data menu
const daftarMenu = [
  { id: 1, nama: "Nasi Goreng Spesial", harga: 25000, gambar: "nasgor.jpg" },
  { id: 2, nama: "Mie Goreng Jawa", harga: 20000, gambar: "mie.jpg" },
  { id: 3, nama: "Ayam Geprek Sambal Ijo", harga: 28000, gambar: "Ayam Geprek.jpg" },
  { id: 4, nama: "Sate Ayam Madura 10 Tusuk", harga: 30000, gambar: "sate.jpg" },
  { id: 5, nama: "Es Teh Manis", harga: 3000, gambar: "esteh.jpg" },
  { id: 6, nama: "Kwetiau Goreng Seafood", harga: 35000, gambar: "kwetiau.jpg" },
  { id: 7, nama: "Coto Makassar", harga: 20000, gambar: "kwetiau.jpg" },
  { id: 8, nama: "Pecel Lele", harga: 22000, gambar: "pecell.jpg" },
  { id: 9, nama: "Sop Buntut", harga: 45000, gambar: "Sop Buntut.jpg" }
];

// Fungsi untuk render menu ke halaman
function renderMenu() {
  const menuContainer = document.getElementById("menuMakanan");
  menuContainer.innerHTML = ''; // Kosongkan dulu
  
  daftarMenu.forEach(m => {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
      <img src="${m.gambar}" alt="${m.nama}">
      <div class="info">
        <h3>${m.nama}</h3>
        <div class="harga">Rp ${m.harga.toLocaleString('id-ID')}</div>
        <button class="tambah" onclick="tambahKeKeranjang(${m.id})">+ Tambah</button>
      </div>
    `;
    menuContainer.appendChild(div);
  });
}

// Fungsi untuk menambah item ke keranjang
function tambahKeKeranjang(id) {
  const menu = daftarMenu.find(m => m.id === id);
  const ada = keranjang.find(item => item.id === id);
  if (ada) {
    ada.jumlah += 1;
  } else {
    keranjang.push({ ...menu, jumlah: 1 });
  }
  // Simpan keranjang ke localStorage dengan timestamp
  localStorage.setItem('cartItems', JSON.stringify(keranjang));
  localStorage.setItem('cartTimestamp', Date.now().toString());
  updateKeranjang();
}

// Export fungsi-fungsi jika menggunakan module system
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { daftarMenu, renderMenu, tambahKeKeranjang };
}