import React from "react";
import { Navigate } from "react-router-dom";
import Navbar from "./Navbar";
import { useAuthStore } from "../store/useAuthStore";
import { Loader2 } from "lucide-react";

function ProtectedRoutes({ children, adminOnly = false }) {
  const { user, loading } = useAuthStore();

  // 1. Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <Loader2 className="animate-spin text-gray-400" size={48} />
      </div>
    );
  }

  // 2. If not logged in → redirect to login
  if (!user) return <Navigate to="/login" replace />;

  // 3. If adminOnly but user is not admin → redirect to home
  if (adminOnly && !user.isAdmin) return <Navigate to="/" replace />;

  // 4. Otherwise → render the protected content
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

export default ProtectedRoutes;
