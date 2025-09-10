import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import Navbar from "./Navbar";
import { Loader2 } from "lucide-react";

export default function ProtectedRoutes({ children, adminOnly = false }) {
  const { user, loading } = useAuthStore();

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-800">
        <Loader2 className="animate-spin text-gray-400" size={40} />
      </div>
    );

  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && !user.isAdmin) return <Navigate to="/" replace />;

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
