import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from './sidebar';
import { useAuthStore } from "../store/authStore.tsx";
import { useEffect } from "react";

const Layout = () => {
    const { user, isAuthenticated, checkAuth, isCheckingAuth } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, []);

    // Show loading while checking authentication
    if (isCheckingAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated ) { // Changed from || to &&
        console.log('Auth state:', { isAuthenticated, user }); // Debug log
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <div className="flex-shrink-0">
                <Sidebar />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Header Bar */}
                <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <h1 className="text-lg font-semibold text-gray-900">
                                Cultural Platform
                            </h1>
                        </div>
                        <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">
                Logged in as {user?.role}
              </span>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;