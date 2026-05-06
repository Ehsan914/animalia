import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const GuestRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated()) {
        return <Navigate to="/admin/dashboard" replace />;
    }

    return children;
};

export default GuestRoute;