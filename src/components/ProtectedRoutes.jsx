import React from "react";
import { Navigate } from "react-router-dom";
import Navbar from "./Navbar";
import { useAuthStore } from "../store/useAuthStore";
import { Loader2 } from "lucide-react";

function ProtectedRoutes({ children, adminOnly = false }) {
  const { user, loading } = useAuthStore(); // add loading state from store

  // Show loader while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-800">
        <div className="animate-spin text-gray-500 text-4xl">
          <Loader2 className="animate-spin" size={40} />
        </div>
      </div>
    );
  }

  // Redirect if not logged in
  if (!user) return <Navigate to="/login" replace />;

  // Redirect if adminOnly route but user is not admin
  if (adminOnly && !user.isAdmin) return <Navigate to="/" replace />;

  // Render protected page with navbar
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

export default ProtectedRoutes;
