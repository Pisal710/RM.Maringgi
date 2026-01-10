// menu_functions.js - Fungsi-fungsi terkait menu makanan

// Data menu
const daftarMenu = [
  { id: 1, nama: "Nasi Goreng Spesial", harga: 25000 },
  { id: 2, nama: "Mie Goreng Jawa", harga: 20000 },
  { id: 3, nama: "Ayam Geprek Sambal Ijo", harga: 28000 },
  { id: 4, nama: "Sate Ayam Madura 10 Tusuk", harga: 30000 },
  { id: 5, nama: "Es Teh Manis", harga: 3000 },
  { id: 6, nama: "Kwetiau Goreng Seafood", harga: 35000 },
  { id: 7, nama: "Coto Makassar", harga: 20000 },
  { id: 8, nama: "Pecel Lele", harga: 22000 },
  { id: 9, nama: "Sop Buntut", harga: 45000 }
];

const gambarMap = {
  1: "/static/images/nasii goreng spesial.jpg",
  2: "/static/images/Mie_Goreng_Jawa_Pedas.jpg",
  3: "/static/images/ayam geprek sambal ijo.jpg",
  4: "/static/images/sate ayam madura .jpeg",
  5: "/static/images/es teh manis.jpg",
  6: "/static/images/kwetiau goreng seafood.jpeg",
  7: "/static/images/coto makassar.jpg",
  8: "/static/images/pecel lele.jpg",
  9: "/static/images/sop buntut.jpg"
};


function renderMenu() {
  const menuContainer = document.getElementById("menuMakanan");
  menuContainer.innerHTML = ''; 

  daftarMenu.forEach(m => {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
      <img src="${gambarMap[m.id]}" alt="${m.nama}">
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