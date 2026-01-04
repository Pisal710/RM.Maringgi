// session-init.js - Initialize sessionStorage dengan data dari server

document.addEventListener('DOMContentLoaded', function() {
    // Set sessionStorage dari server-side session (jika ada)
    // Django/Flask akan merender ini sebagai template variable
    const userId = document.querySelector('[data-user-id]')?.getAttribute('data-user-id');
    const username = document.querySelector('[data-username]')?.getAttribute('data-username');
    const role = document.querySelector('[data-role]')?.getAttribute('data-role');
    
    if (userId && userId !== 'None' && userId !== '') {
        sessionStorage.setItem('user_id', userId);
        console.log('Set user_id dari server:', userId);
    }
    
    if (username && username !== 'None' && username !== '') {
        sessionStorage.setItem('username', username);
        console.log('Set username dari server:', username);
    }
    
    if (role && role !== 'None' && role !== '') {
        sessionStorage.setItem('role', role);
        console.log('Set role dari server:', role);
    }
    
    // Cek apakah perlu restore cart setelah login
    const needsRestore = sessionStorage.getItem('needsRestore');
    const savedCart = localStorage.getItem('cartItems');
    
    if (needsRestore === 'true' && savedCart && userId) {
        console.log('Restoring cart setelah login...');
        sessionStorage.removeItem('needsRestore');
        // Logic untuk restore cart akan ditangani oleh script lain
    }
});
