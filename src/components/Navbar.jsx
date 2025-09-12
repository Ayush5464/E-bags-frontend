import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useCartStore } from "../store/useCartStore";
import { LogOut, ShoppingBag, User2, Menu, X } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { cart } = useCartStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount =
    cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-700">
          EbagMart
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-800">
          {user ? (
            user.isAdmin ? (
              <>
                <div className="flex items-center gap-1 text-gray-800 font-semibold">
                  <User2 />
                  {user.name}
                </div>
                <NavLink to="/admin">Dashboard</NavLink>
                <NavLink to="/admin/uploads">Add Product</NavLink>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded transition text-sm"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-1 text-gray-800 font-semibold">
                  <User2 />
                  {user.name}
                </div>
                <NavLink to="/products">Products</NavLink>
                <NavLink to="/my-orders">My Orders</NavLink>
                <Link
                  to="/cart"
                  className="relative flex items-center gap-1 text-gray-800 hover:text-blue-600 transition"
                >
                  <ShoppingBag size={18} />
                  Cart
                  {cartCount > 0 && (
                    <span className="ml-1 text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded transition text-sm"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            )
          ) : (
            <>
              <NavLink to="/signup">Register</NavLink>
              <NavLink to="/login">Login</NavLink>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-800 hover:text-blue-600 focus:outline-none"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-6 py-4 space-y-3">
          {user ? (
            user.isAdmin ? (
              <>
                <div className="flex items-center gap-1 text-gray-800 font-semibold">
                  <User2 />
                  {user.name}
                </div>
                <NavLink to="/admin" onClick={() => setMobileMenuOpen(false)}>
                  Dashboard
                </NavLink>
                <NavLink to="/admin/uploads" onClick={() => setMobileMenuOpen(false)}>
                  Add Product
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded transition text-sm"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-1 text-gray-800 font-semibold">
                  <User2 />
                  {user.name}
                </div>
                <NavLink to="/products" onClick={() => setMobileMenuOpen(false)}>
                  Products
                </NavLink>
                <NavLink to="/my-orders" onClick={() => setMobileMenuOpen(false)}>
                  My Orders
                </NavLink>
                <Link
                  to="/cart"
                  className="relative flex items-center gap-1 text-gray-800 hover:text-blue-600 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ShoppingBag size={18} />
                  Cart
                  {cartCount > 0 && (
                    <span className="ml-1 text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded transition text-sm"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            )
          ) : (
            <>
              <NavLink to="/signup" onClick={() => setMobileMenuOpen(false)}>
                Register
              </NavLink>
              <NavLink to="/login" onClick={() => setMobileMenuOpen(false)}>
                Login
              </NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

function NavLink({ to, children, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="text-gray-800 hover:text-blue-600 transition font-medium"
    >
      {children}
    </Link>
  );
}
