import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import Navbar from "./Navbar";

export default function ProtectedRoutes({ children, adminOnly = false }) {
    const { user, loading } = useAuthStore();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-800">
                <div className="animate-spin text-gray-400 text-3xl">⏳</div>
            </div>
        );
    }

    if (!user) return <Navigate to="/login" replace />;
    if (adminOnly && !user.isAdmin) return <Navigate to="/" replace />;

    return (
        <>
            <Navbar />
            {children}
        </>
    );
}
