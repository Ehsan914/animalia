import { useState } from "react";
import { login as requestToken } from "../api/resources";

const useAuth = () => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const login = async (email, password) => {
        setLoading(true);
        setError(null);

        try {
            const { token } = await requestToken({ email, password });

            if (!token) {
                setError('Login failed: No token received');
                return false;
            }

            localStorage.setItem('adminToken', token);
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    };
    const logout = () => {
        localStorage.removeItem('adminToken');
        window.location.href='/admin/login';
    };
    const isAuthenticated = () => {
        
        const token = localStorage.getItem('adminToken');

        return !!token;
    };
    return {
        login, logout, isAuthenticated, loading, error
    }
}
export default useAuth;