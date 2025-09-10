import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore";
import { Toaster } from "react-hot-toast";
import ProtectedRoutes from "./components/ProtectedRoutes";
import { Loader2 } from "lucide-react";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Checkout from "./pages/Checkout";
import ThankyouPage from "./pages/ThankyouPage";
import MyOrders from "./pages/MyOrders";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminProductUpload from "./pages/AdminProductUpload";
import ProductManage from "./pages/AdminControlls/ProductManage";
import AdminUserManage from "./pages/AdminControlls/AdminUserManage";
import AdminOrderManage from "./pages/AdminControlls/AdminOrderManage";

function App() {
  const { fetchCurrentUser, user, loading } = useAuthStore();

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-800">
        <Loader2 className="animate-spin text-gray-400" size={48} />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />

        {/* Protected user routes */}
        <Route
          path="/"
          element={
            <ProtectedRoutes>
              <Home />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoutes>
              <Cart />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoutes>
              <Products />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/products/:id"
          element={
            <ProtectedRoutes>
              <ProductDetails />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoutes>
              <Checkout />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/thankyou"
          element={
            <ProtectedRoutes>
              <ThankyouPage />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoutes>
              <MyOrders />
            </ProtectedRoutes>
          }
        />

        {/* Admin routes */}
        {user?.isAdmin && (
          <>
            <Route
              path="/admin"
              element={
                <ProtectedRoutes adminOnly>
                  <AdminDashboard />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/admin/uploads"
              element={
                <ProtectedRoutes adminOnly>
                  <AdminProductUpload />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/admin/product"
              element={
                <ProtectedRoutes adminOnly>
                  <ProductManage />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoutes adminOnly>
                  <AdminUserManage />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <ProtectedRoutes adminOnly>
                  <AdminOrderManage />
                </ProtectedRoutes>
              }
            />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
