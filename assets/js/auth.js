// Authentication JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize form validation
    initAuthForms();
    
    // Handle social login buttons
    setupSocialLogins();
});

function initAuthForms() {
    // Login form validation
    const loginForm = document.getElementById('loginEmailForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value.trim();
            
            if (!email || !password) {
                showAlert('error', 'Harap isi semua field');
                return;
            }
            
            // Simulate login request
            simulateLogin(email, password);
        });
    }
    
    // Register form validation
    const registerForm = document.getElementById('registerEmailForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('registerName').value.trim();
            const email = document.getElementById('registerEmail').value.trim();
            const password = document.getElementById('registerPassword').value.trim();
            const confirmPassword = document.getElementById('registerConfirmPassword').value.trim();
            const agreeTerms = document.getElementById('agreeTerms').checked;
            
            // Basic validation
            if (!name || !email || !password || !confirmPassword) {
                showAlert('error', 'Harap isi semua field');
                return;
            }
            
            if (password.length < 8) {
                showAlert('error', 'Password harus minimal 8 karakter');
                return;
            }
            
            if (password !== confirmPassword) {
                showAlert('error', 'Password dan konfirmasi password tidak cocok');
                return;
            }
            
            if (!agreeTerms) {
                showAlert('error', 'Anda harus menyetujui syarat dan ketentuan');
                return;
            }
            
            // Simulate registration
            simulateRegistration(name, email, password);
        });
    }
}

function setupSocialLogins() {
    // Google login
    const googleButtons = document.querySelectorAll('[class*="google"]');
    googleButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            // In a real app, this would trigger Google OAuth flow
            showAlert('info', 'Google login akan diimplementasikan di sini');
        });
    });
    
    // Apple login
    const appleButtons = document.querySelectorAll('[class*="apple"]');
    appleButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            // In a real app, this would trigger Apple OAuth flow
            showAlert('info', 'Apple login akan diimplementasikan di sini');
        });
    });
}

function simulateLogin(email, password) {
    // Show loading state
    const submitButton = document.querySelector('#loginEmailForm button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Memproses...';
    submitButton.disabled = true;
    
    // Simulate API call delay
    setTimeout(() => {
        // In a real app, this would be an actual API call
        console.log('Login attempt with:', { email, password });
        
        // For demo purposes, we'll assume login is successful
        showAlert('success', 'Login berhasil! Mengarahkan ke dashboard...');
        
        // Reset button state
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Redirect to dashboard (commented out for demo)
        // window.location.href = 'dashboard.html';
    }, 1500);
}

function simulateRegistration(name, email, password) {
    // Show loading state
    const submitButton = document.querySelector('#registerEmailForm button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Membuat akun...';
    submitButton.disabled = true;
    
    // Simulate API call delay
    setTimeout(() => {
        // In a real app, this would be an actual API call
        console.log('Registration attempt with:', { name, email, password });
        
        // For demo purposes, we'll assume registration is successful
        showAlert('success', 'Pendaftaran berhasil! Mengarahkan ke dashboard...');
        
        // Reset button state
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // In a real app, you might automatically log them in after registration
        // window.location.href = 'dashboard.html';
    }, 2000);
}

function showAlert(type, message) {
    // Remove any existing alerts
    const existingAlert = document.querySelector('.auth-alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `auth-alert fixed top-4 right-4 px-6 py-3 rounded-lg shadow-md text-white ${
        type === 'error' ? 'bg-red-500' : 
        type === 'success' ? 'bg-green-500' : 'bg-blue-500'
    }`;
    alert.textContent = message;
    
    // Add to DOM
    document.body.appendChild(alert);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        alert.remove();
    }, 5000);
}