import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  Menu,
  X,
  Bell,
  LogOut,
  PackagePlus,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

export default function AdminLayout({ children, pageTitle = "Admin" }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden transition-opacity ${
          sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <aside
        className={`fixed z-40 md:relative top-0 left-0 h-full w-64 bg-white border-r shadow-md transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-indigo-600">EbagMart</h2>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>
        <nav className="flex flex-col gap-2 p-4">
          <NavLink
            to="/admin"
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
          />
          <NavLink
            to="/admin/product"
            icon={<Package size={18} />}
            label="Products"
          />
          <NavLink
            to="/admin/uploads"
            icon={<PackagePlus size={18} />}
            label="Add Product"
          />
          <NavLink
            to="/admin/orders"
            icon={<ShoppingCart size={18} />}
            label="Orders"
          />
          <NavLink to="/admin/users" icon={<Users size={18} />} label="Users" />
          <NavLink to="#" icon={<Settings size={18} />} label="Settings" />
        </nav>
        <div className="mt-auto p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white border-b shadow-sm">
          <div className="flex items-center gap-3">
            <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu size={22} />
            </button>
            <h1 className="text-xl font-semibold hidden md:block">
              {pageTitle}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Bell className="text-gray-500 cursor-pointer" size={20} />
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}

function NavLink({ to, icon, label }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-indigo-50 rounded transition text-sm font-medium"
    >
      {icon}
      {label}
    </Link>
  );
}
