import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import Navbar from "./Navbar";

function ProtectedRoutes({ children, adminOnly = false }) {
  const { user } = useAuthStore();

  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && !user.isAdmin) return <Navigate to="/" />;

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

export default ProtectedRoutes;
