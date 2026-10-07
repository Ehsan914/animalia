import { useState } from "react";
import { ApiError, login as requestToken } from "../api/resources";

const useAuth = () => {

    const [loading, setLoading] = useState(false);

    // Resolves to null when signed in, or to the ApiError that stopped it
    // (status 401: wrong email or password; none: the server was unreachable).
    const login = async (email, password) => {
        setLoading(true);

        try {
            const { token } = await requestToken({ email, password });
            if (!token) return new ApiError("Sign-in failed: the server sent no token.");

            localStorage.setItem('adminToken', token);
            return null;
        } catch (err) {
            return err;
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
        login, logout, isAuthenticated, loading
    }
}
export default useAuth;