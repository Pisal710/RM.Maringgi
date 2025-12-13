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

    //render menu 
    const menuContainer = document.getElementById("menuMakanan");
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

    //keranjang 
    let keranjang = [];

    function tambahKeKeranjang(id) {
      const menu = daftarMenu.find(m => m.id === id);
      const ada = keranjang.find(item => item.id === id);
      if (ada) {
        ada.jumlah += 1;
      } else {
        keranjang.push({ ...menu, jumlah: 1 });
      }
      updateKeranjang();
    }

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

    // sudah checkout dikirim ke php+sql
    document.getElementById("checkoutBtn").addEventListener("click", () => {
      if (keranjang.length === 0) return alert("Keranjang kosong bro!");
      document.getElementById("pilihMetode").style.display = "flex";
    });

    // Pilih Antar
    function pilihDelivery() {
      document.getElementById("pilihMetode").style.display = "none";
      document.getElementById("formDelivery").style.display = "flex";
    }

    // Pilih Ambil Sendiri → langsung kirim tanpa alamat
    function pilihTakeaway() {
      document.getElementById("pilihMetode").style.display = "none";

      const data = {
        items: keranjang,
        subtotal: keranjang.reduce((s, i) => s + i.harga * i.jumlah, 0),
        metode: "takeaway",
        pelanggan: { nama: "Ambil Sendiri" },
        waktu: new Date().toLocaleString('id-ID')
      };

      fetch("simpan_pesanan.php", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
        .then(r => r.text()).then(h => { alert(h); keranjang = []; updateKeranjang(); });
    }

    // Batal dari form delivery
    function batalDelivery() {
      document.getElementById("formDelivery").style.display = "none";
    }

    // Kirim pesanan delivery
    function kirimDelivery() {
      const nama = document.getElementById("nama").value.trim();
      const hp = document.getElementById("hp").value.trim();
      const alamat = document.getElementById("alamat").value.trim();
      if (!nama || !hp || !alamat) return alert("Isi semua dulu bro!");

      const data = {
        items: keranjang,
        subtotal: keranjang.reduce((s, i) => s + i.harga * i.jumlah, 0),
        metode: "delivery",
        pelanggan: { nama, hp, alamat },
        waktu: new Date().toLocaleString('id-ID')
      };

      fetch("simpan_pesanan.php", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
        .then(r => r.text())
        .then(h => {
          alert(h);
          document.getElementById("formDelivery").style.display = "none";
          keranjang = [];
          updateKeranjang();
          // reset form
          document.getElementById("nama").value = document.getElementById("hp").value = document.getElementById("alamat").value = "";
        });
    }
    // Tambah jumlah item
    function tambahItem(index) {
      keranjang[index].jumlah += 1;
      updateKeranjang();
    }

    // Kurangi jumlah item (kalau jadi 0 → hapus dari keranjang)
    function kurangiItem(index) {
      keranjang[index].jumlah -= 1;
      if (keranjang[index].jumlah <= 0) {
        keranjang.splice(index, 1); // hapus item dari array
      }
      updateKeranjang();
    }
