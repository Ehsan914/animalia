import axios from 'axios';

// No cache-busting headers: public lists are cacheable by design (the server
// sets max-age), and admin lists come from /admin endpoints sent as no-store.
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    }
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// An expired admin session sends the admin back to the login page. Requests
// made without a token (public visitors) never redirect.
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const hadToken = Boolean(error.config?.headers?.Authorization);
        if (error.response?.status === 401 && hadToken && !window.location.pathname.includes('/admin/login')) {
            localStorage.removeItem('adminToken');
            window.location.href = '/admin/login';
        }
        return Promise.reject(error);
    }
)

export default axiosInstance;
