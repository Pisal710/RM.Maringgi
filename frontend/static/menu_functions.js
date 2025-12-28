// menu_functions.js - Fungsi-fungsi terkait menu makanan

// Data menu
const daftarMenu = [
  { id: 1, nama: "Nasi Goreng Spesial", harga: 25000, gambar: "/static/images/nasii goreng spesial.jpg" },
  { id: 2, nama: "Mie Goreng Jawa", harga: 20000, gambar: "/static/images/Mie_Goreng_Jawa_Pedas.jpg" },
  { id: 3, nama: "Ayam Geprek Sambal Ijo", harga: 28000, gambar: "/static/images/ayam geprek sambal ijo.jpg" },
  { id: 4, nama: "Sate Ayam Madura 10 Tusuk", harga: 30000, gambar: "/static/images/sate ayam madura .jpeg" },
  { id: 5, nama: "Es Teh Manis", harga: 3000, gambar: "/static/images/es teh manis.jpg" },
  { id: 6, nama: "Kwetiau Goreng Seafood", harga: 35000, gambar: "/static/images/kwetiau goreng seafood.jpeg" },
  { id: 7, nama: "Coto Makassar", harga: 20000, gambar: "/static/images/coto makassar.jpg" },
  { id: 8, nama: "Pecel Lele", harga: 22000, gambar: "/static/images/pecel lele.jpg" },
  { id: 9, nama: "Sop Buntut", harga: 45000, gambar: "/static/images/sop buntut.jpg" }
];

// Fungsi untuk render menu ke halaman
function renderMenu() {
  const menuContainer = document.getElementById("menuMakanan");
  menuContainer.innerHTML = ''; // Kosongkan dulu
  
  daftarMenu.forEach(m => {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
      <img src="${m.gambar}" alt="${m.nama}" style="width:200px; height:150px; object-fit:cover;">
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