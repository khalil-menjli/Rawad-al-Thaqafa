import { Navigate } from 'react-router-dom';
import {useAuthStore} from "../store/authStore.tsx";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const { user, isAuthenticated } = useAuthStore();

    // If not authenticated, redirect to login
    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />;
    }

    // If user role is not in allowed roles, redirect to login
    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;