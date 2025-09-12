// pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./AdminControlls/AdminLayout";
import API from "../api/axios";
import toast from "react-hot-toast";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Unauthorized");

        const res = await API.get("/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
        toast.error(
          "Failed to fetch stats. Make sure you are logged in as admin."
        );

        // Redirect non-admin or unauthorized user to homepage
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [navigate]);

  if (loading)
    return (
      <AdminLayout>
        <div className="p-6 text-center text-gray-600">Loading stats...</div>
      </AdminLayout>
    );

  if (!stats)
    return (
      <AdminLayout>
        <div className="p-6 text-center text-gray-600">No data available.</div>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <main className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Admin Dashboard
        </h2>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <StatBox label="Users" value={stats.totalUsers} />
          <StatBox label="Products" value={stats.totalProducts} />
          <StatBox label="Orders" value={stats.totalOrders} />
          <StatBox label="Revenue" value={`₹${stats.totalRevenue}`} />
        </div>

        {/* Order Status Breakdown */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">
            Orders by Status
          </h3>
          <ul className="space-y-2">
            {Object.entries(stats.ordersByStatus).map(([status, count]) => (
              <li key={status} className="flex justify-between text-sm">
                <span className="capitalize font-medium text-gray-600">
                  {status}
                </span>
                <span className="font-bold text-indigo-600">{count}</span>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </AdminLayout>
  );
}

function StatBox({ label, value }) {
  return (
    <div className="bg-white p-5 rounded-lg shadow hover:shadow-md transition">
      <h4 className="text-sm text-gray-500 mb-1">{label}</h4>
      <p className="text-2xl font-bold text-indigo-600">{value}</p>
    </div>
  );
}

export default AdminDashboard;
