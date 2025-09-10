import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, ShoppingBag, User2 } from "lucide-react";
import { useCartStore } from "../store/useCartStore";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { cart } = useCartStore();
  const navigate = useNavigate();

  const cartCount =
    cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const handleLogout = () => {
    logout(); // clear user state & cookies
    navigate("/login"); // redirect to login page
  };

  return (
    <nav className="bg-white shadow border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          EbagMart
        </Link>

        <div className="flex items-center gap-6 text-sm font-medium text-gray-700">
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
      </div>
    </nav>
  );
}

function NavLink({ to, children }) {
  return (
    <Link
      to={to}
      className="text-gray-700 hover:text-blue-600 transition duration-150"
    >
      {children}
    </Link>
  );
}
