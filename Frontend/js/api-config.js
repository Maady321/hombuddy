/**
 * API Configuration
 * Automatically detects the correct API base URL based on environment
 */

const API_BASE_URL = (() => {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;

    // Development environment - localhost
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        const port = window.location.port;
        return `${protocol}//${hostname}:8001`;
    }

    // Production environment - Vercel deployment
    if (hostname.includes('vercel.app') || hostname.includes('homebuddy')) {
        // Use same origin for production
        return window.location.origin;
    }

    // Default fallback to relative path
    return '';
})();

// Token Management
window.setToken = (token) => {
    localStorage.setItem('auth_token', token);
};

window.getToken = () => {
    return localStorage.getItem('auth_token');
};

window.removeToken = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data'); // Clear other user data if stored
};

window.checkAuth = () => {
    if (!window.getToken()) {
        console.warn('No token found, redirecting to login');
        // Determine login page based on path or default to user login
        if (window.location.pathname.includes('/provider/')) {
            window.location.href = '/Frontend/html/provider/provider-login.html';
        } else if (window.location.pathname.includes('/admin/')) {
            window.location.href = '/Frontend/html/admin/admin-login.html';
        } else {
            window.location.href = '/Frontend/html/user/login.html';
        }
    }
};

// Request wrapper with better error handling and Auth
async function makeRequest(endpoint, options = {}) {
    const url = API_BASE_URL ? `${API_BASE_URL}${endpoint}` : endpoint;

    // Add Authorization header if token exists
    const token = window.getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(url, {
            ...options,
            headers: headers,
        });

        if (response.status === 401) {
            console.error('Unauthorized access (401). Redirecting to login...');
            window.removeToken();
            window.checkAuth();
            return response; // validation might happen downstream, but we redirected
        }

        return response;
    } catch (error) {
        console.error(`Request failed for ${url}:`, error);
        throw error;
    }
}

console.log('API Base URL configured:', API_BASE_URL || '(relative paths)');


