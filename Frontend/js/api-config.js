const API_BASE_URL = (() => {
    const hostname = window.location.hostname;

    // Check if running on localhost
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:8000';
    }

    // For production/Vercel
    // Using window.location.origin ensures we have the correct base URL
    return window.location.origin;
})();

console.log('API Base URL:', API_BASE_URL);
console.log('Current hostname:', window.location.hostname);
