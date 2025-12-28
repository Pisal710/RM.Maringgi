let currentOrderId = null;
let autoRefreshInterval = null;

document.addEventListener('DOMContentLoaded', () => {
    loadOrders();
    startAutoRefresh();
});

function startAutoRefresh() {
    if (autoRefreshInterval) clearInterval(autoRefreshInterval);
    autoRefreshInterval = setInterval(loadOrders, 3000);
}

function updateLastUpdateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('id-ID');
    document.getElementById('last-update-time').textContent = timeString;
}

function loadOrders() {
    const errorDiv = document.getElementById('error-message');
    const tbody = document.getElementById('orders-tbody');
    
    errorDiv.style.display = 'none';
    
    fetch('/api/orders')
        .then(response => {
            if (!response.ok) throw new Error('Failed to load orders');
            return response.json();
        })
        .then(data => {
            updateLastUpdateTime();
            
            if (!data.success || !data.orders || data.orders.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" class="no-orders">Tidak ada pesanan</td></tr>';
                return;
            }
            
            const currentRows = tbody.querySelectorAll('tr');
            const previousIds = new Set(Array.from(currentRows).map(row => row.dataset.orderId));
            const newIds = new Set(data.orders.map(o => o.id.toString()));
            
            const hasNewOrders = data.orders.some(o => !previousIds.has(o.id.toString()));
            
            tbody.innerHTML = '';
            data.orders.forEach((order, index) => {
                const row = document.createElement('tr');
                row.dataset.orderId = order.id;
                
                const statusClass = order.order_status === 'pending' ? 'status-pending' : 
                                  order.order_status === 'confirmed' ? 'status-confirmed' : 'status-completed';
                
                const paymentStatusClass = order.payment_status === 'Pending' || 
                                           order.payment_status.includes('Menunggu') 
                                           ? 'payment-status-pending' : 'payment-status-completed';
                
                const isNew = hasNewOrders && !previousIds.has(order.id.toString());
                const rowStyle = isNew ? 'background: #fff8dc; animation: highlight 1s;' : '';
                
                row.style.cssText = rowStyle;
                
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${order.user_id}</td>
                    <td>Rp ${order.total_price.toLocaleString('id-ID')}</td>
                    <td>${order.order_type === 'delivery' ? '🚗 Delivery' : '🏪 Takeaway'}</td>
                    <td><span class="status-badge ${statusClass}">${order.order_status}</span></td>
                    <td><span class="status-badge ${paymentStatusClass}">${order.payment_status}</span></td>
                    <td><button class="btn btn-primary" onclick="viewOrderDetail(${order.id})">Lihat</button></td>
                `;
                tbody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            errorDiv.style.display = 'block';
            errorDiv.textContent = '❌ Gagal memuat pesanan: ' + error.message;
        });
}

function viewOrderDetail(orderId) {
    currentOrderId = orderId;
    
    fetch(`/api/orders/${orderId}`)
        .then(response => response.json())
        .then(data => {
            if (!data.success) throw new Error('Failed to load order detail');
            
            const order = data.order;
            const items = data.items || [];
            
            let itemsHtml = '<div style="margin: 15px 0;"><strong>Items:</strong><ul style="margin-left: 20px;">';
            items.forEach(item => {
                itemsHtml += `<li>Food ID ${item.food_id} x${item.quantity} @ Rp ${item.price.toLocaleString('id-ID')}</li>`;
            });
            itemsHtml += '</ul></div>';
            
            const deliveryInfo = order.delivery_name ? `
                <div class="detail-item"><strong>Nama Penerima:</strong> ${order.delivery_name}</div>
                <div class="detail-item"><strong>No. HP:</strong> ${order.delivery_phone}</div>
                <div class="detail-item"><strong>Alamat:</strong> ${order.delivery_address}</div>
            ` : '<div class="detail-item"><strong>Tipe:</strong> Takeaway (Ambil di tempat)</div>';
            
            const detailHtml = `
                <div class="detail-item"><strong>Order ID:</strong> #${order.id}</div>
                <div class="detail-item"><strong>User ID:</strong> ${order.user_id}</div>
                <div class="detail-item"><strong>Tipe Pesanan:</strong> ${order.order_type === 'delivery' ? '🚗 Delivery' : '🏪 Takeaway'}</div>
                ${deliveryInfo}
                ${itemsHtml}
                <div class="detail-item"><strong>Total:</strong> Rp ${order.total_price.toLocaleString('id-ID')}</div>
                <div class="detail-item"><strong>Metode Pembayaran:</strong> ${order.payment_method}</div>
                ${order.virtual_account ? `<div class="detail-item"><strong>Virtual Account:</strong> ${order.virtual_account}</div>` : ''}
                <div class="detail-item"><strong>Status:</strong> <span class="status-badge status-${order.order_status}">${order.order_status}</span></div>
                <div class="detail-item"><strong>Status Pembayaran:</strong> <span class="status-badge payment-status-${order.payment_status === 'Pending' ? 'pending' : 'completed'}">${order.payment_status}</span></div>
                <div class="detail-item"><strong>Tanggal:</strong> ${new Date(order.created_at).toLocaleString('id-ID')}</div>
            `;
            
            document.getElementById('order-detail-content').innerHTML = detailHtml;
            document.getElementById('orderModal').style.display = 'block';
        })
        .catch(error => {
            alert('Gagal memload detail pesanan: ' + error.message);
        });
}

function closeOrderModal() {
    document.getElementById('orderModal').style.display = 'none';
    currentOrderId = null;
}

function updateOrderStatus() {
    if (!currentOrderId) return;
    
    fetch(`/api/orders/${currentOrderId}/confirm`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('✅ Pesanan berhasil dikonfirmasi!');
            closeOrderModal();
            loadOrders();
        } else {
            alert('❌ Gagal mengkonfirmasi pesanan: ' + data.message);
        }
    })
    .catch(error => alert('❌ Error: ' + error.message));
}

function cancelOrder() {
    if (!currentOrderId) return;
    
    if (!confirm('Yakin ingin membatalkan pesanan ini?')) return;
    
    fetch(`/api/orders/${currentOrderId}/cancel`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('✅ Pesanan berhasil dibatalkan!');
            closeOrderModal();
            loadOrders();
        } else {
            alert('❌ Gagal membatalkan pesanan: ' + data.message);
        }
    })
    .catch(error => alert('❌ Error: ' + error.message));
}

function deleteAllOrders() {
    if (!confirm('⚠️ PERINGATAN: Anda akan menghapus SEMUA pesanan!\n\nKlik OK untuk lanjutkan atau CANCEL untuk batal.')) {
        return;
    }
    
    if (!confirm('Yakin? Aksi ini TIDAK BISA DIBATALKAN!\n\nKlik OK lagi untuk mengkonfirmasi.')) {
        return;
    }
    
    fetch('/api/orders/delete-all', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('✅ Semua pesanan berhasil dihapus!');
            closeOrderModal();
            loadOrders();
        } else {
            alert('❌ Gagal menghapus pesanan: ' + data.message);
        }
    })
    .catch(error => alert('❌ Error: ' + error.message));
}

window.onclick = function(event) {
    const modal = document.getElementById('orderModal');
    if (event.target === modal) {
        closeOrderModal();
    }
}

window.addEventListener('beforeunload', () => {
    if (autoRefreshInterval) clearInterval(autoRefreshInterval);
});
