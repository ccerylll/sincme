// Authentication JavaScript
document.addEventListener('DOMContentLoaded', function () {
    initAuthForms();
    setupSocialLogins();
  });
  
  function initAuthForms() {
    // Login form
    const loginForm = document.getElementById('loginEmailForm');
    if (loginForm) {
      loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
  
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value.trim();
  
        if (!email || !password) {
          showAlert('error', 'Harap isi semua field');
          return;
        }
  
        simulateLogin(email, password);
      });
    }
  
    // Register form
    const registerForm = document.getElementById('registerEmailForm');
    if (registerForm) {
      registerForm.addEventListener('submit', function (e) {
        e.preventDefault();
  
        const firstName = document.getElementById('registerFirstName').value.trim();
        const lastName = document.getElementById('registerLastName').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value.trim();
        const confirmPassword = document.getElementById('registerConfirmPassword').value.trim();
        const agreeTerms = document.getElementById('agreeTerms').checked;
  
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
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
  
        simulateRegistration(firstName, lastName, email, password);
      });
    }
  }
  
  function setupSocialLogins() {
    // Google login
    const googleButtons = document.querySelectorAll('[class*="google"]');
    googleButtons.forEach(button => {
      button.addEventListener('click', function (e) {
        e.preventDefault();
        showAlert('info', 'Google login akan diimplementasikan di sini');
      });
    });
  
    // Apple login
    const appleButtons = document.querySelectorAll('[class*="apple"]');
    appleButtons.forEach(button => {
      button.addEventListener('click', function (e) {
        e.preventDefault();
        showAlert('info', 'Apple login akan diimplementasikan di sini');
      });
    });
  }
  
  function simulateLogin(email, password) {
    console.log("Login clicked:", email, password);
  
    const submitButton = document.querySelector('#loginEmailForm button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Memproses...';
    submitButton.disabled = true;
  
    fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    })
      .then(res => res.text()) // pakai .text() jika response adalah plain token
      .then(token => {
        console.log("Login berhasil:", token);
        if (token && token.length > 10) {
          localStorage.setItem("token", token);
          showAlert("success", "Login berhasil! Mengarahkan ke dashboard...");
          setTimeout(() => {
            window.location.href = 'dashboard.html';
          }, 2000); // 2 detik
        } else {
          showAlert("error", "Login gagal. Email/password salah?");
        }
      })
      .catch(err => {
        console.error("Login error:", err);
        showAlert("error", "Terjadi kesalahan saat login.");
      })
      .finally(() => {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
      });
  }
  
  function simulateRegistration(firstName, lastName, email, password) {
    const submitButton = document.querySelector('#registerEmailForm button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Membuat akun...';
    submitButton.disabled = true;
  
    fetch("http://localhost:8080/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password
      })
    })
      .then(res => res.text())
      .then(data => {
        console.log("Registrasi berhasil:", data);
        showAlert("success", "Registrasi berhasil! Mengarah ke halaman login...");
        setTimeout(() => {
          window.location.href = 'auth.html?action=login';
        }, 1500);
      })
      .catch(err => {
        console.error("Gagal daftar:", err);
        showAlert("error", "Registrasi gagal. Cek koneksi / data.");
      })
      .finally(() => {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
      });
  }
  
  function showAlert(type, message) {
    const existingAlert = document.querySelector('.auth-alert');
    if (existingAlert) existingAlert.remove();
  
    const alert = document.createElement('div');
    alert.className = `auth-alert fixed top-4 right-4 px-6 py-3 rounded-lg shadow-md text-white ${
      type === 'error' ? 'bg-red-500' :
      type === 'success' ? 'bg-green-500' : 'bg-blue-500'
    }`;
    alert.textContent = message;
  
    document.body.appendChild(alert);
  
    setTimeout(() => alert.remove(), 5000);
  }