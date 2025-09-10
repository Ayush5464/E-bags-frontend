import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect, useState } from "react";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminProductUpload from "./pages/AdminProductUpload";
import AdminDashboard from "./pages/AdminDashboard";
import Checkout from "./pages/Checkout";
import Cart from "./pages/Cart";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import ProtectedRoutes from "./components/ProtectedRoutes";
import { Toaster } from "react-hot-toast";
import ProductManage from "./pages/admin controlls/ProductManage";
import AdminUserManage from "./pages/admin controlls/AdminUserManage";
import AdminOrderManage from "./pages/admin controlls/AdminOrderManage";
import ThankyouPage from "./pages/ThankyouPage";
import MyOrders from "./pages/MyOrders";

function App() {
  const { user, fetchCurrentUser } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      await fetchCurrentUser();
      setLoading(false);
    };
    loadUser();
  }, []);

  if (loading) return <p className="p-4">Loading...</p>; // 🔄 Wait before rendering

  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />

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
          path="/orders"
          element={
            <ProtectedRoutes>
              <MyOrders />
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
          path="/checkout"
          element={
            <ProtectedRoutes>
              <Checkout />
            </ProtectedRoutes>
          }
        />

        {user?.isAdmin && (
          <>
            <Route
              path="/admin"
              element={
                <ProtectedRoutes>
                  <AdminDashboard />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/admin/uploads"
              element={
                <ProtectedRoutes>
                  <AdminProductUpload />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/admin/product"
              element={
                <ProtectedRoutes>
                  <ProductManage />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoutes>
                  <AdminUserManage />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <ProtectedRoutes>
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
