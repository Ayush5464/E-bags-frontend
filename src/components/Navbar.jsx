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
    logout(); // clear user state & cookies
    navigate("/login"); // redirect to login page
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          EbagMart
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
          {user ? (
            user.isAdmin ? (
              <>
                <User2 />
                <span className="text-blue-600 font-semibold">{user.name}</span>
                <Link to="/admin">Dashboard</Link>
                <Link to="/admin/uploads">Add Product</Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-red-500 hover:text-red-600 px-3 py-1 rounded transition text-sm"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-1 text-blue-600">
                  <User2 />
                  <span className="text-blue-600 font-semibold">
                    {user.name}
                  </span>
                </div>
                <Link
                  to="/products"
                  className="no-underline text-gray-700 hover:text-blue-600"
                >
                  Products
                </Link>
                <Link
                  to="/orders"
                  className="no-underline text-gray-700 hover:text-blue-600"
                >
                  My Orders
                </Link>
                <Link
                  to="/cart"
                  className="relative flex items-center gap-1 hover:text-blue-600"
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
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition text-sm flex items-center gap-1"
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
            className="text-gray-700 hover:text-blue-600 focus:outline-none"
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
                <div className="flex items-center gap-1 text-blue-600">
                  <User2 />
                  <span className="font-semibold">{user.name}</span>
                </div>
                <Link
                  to="/admin"
                  className="block text-gray-700 hover:text-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/admin/uploads"
                  className="block text-gray-700 hover:text-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Add Product
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-red-500 hover:text-red-600 px-3 py-1 rounded transition text-sm"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-1 text-blue-600">
                  <User2 />
                  <span className="font-semibold">{user.name}</span>
                </div>
                <Link
                  to="/products"
                  className="block text-gray-700 hover:text-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Products
                </Link>
                <Link
                  to="/orders"
                  className="block text-gray-700 hover:text-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Orders
                </Link>
                <Link
                  to="/cart"
                  className="flex items-center gap-1 text-gray-700 hover:text-blue-600"
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
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition text-sm flex items-center gap-1"
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
      className="block text-gray-700 hover:text-blue-600 transition duration-150"
    >
      {children}
    </Link>
  );
}
