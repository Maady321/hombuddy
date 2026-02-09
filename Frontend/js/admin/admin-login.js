document.getElementById('admin-login-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Hardcoded check for Admin
    if (email === 'admin@homebuddy.com' && password === 'admin123') {
        alert('Login successful!');
        localStorage.setItem('admin_logged_in', 'true');
        window.location.href = 'admin-dashboard.html';
    } else {
        alert('Invalid Admin Credentials!');
    }
});
