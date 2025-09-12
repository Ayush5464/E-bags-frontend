// pages/AdminControlls/AdminOrderManage.jsx
import { useEffect, useState } from "react";
import API from "../../api/axios";
import toast from "react-hot-toast";
import AdminLayout from "./AdminLayout";

export default function AdminOrderManage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized");

      const res = await API.get("/admin/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(res.data.orders || res.data); // support both structures
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      toast.error("Failed to fetch orders. Make sure you are an admin.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized");

      const res = await API.put(
        `/admin/orders/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedOrder = res.data.order || res.data; // fallback

      setOrders((prev) =>
        prev.map((order) => (order._id === orderId ? updatedOrder : order))
      );

      toast.success("Status updated successfully");
    } catch (err) {
      console.error("Failed to update status:", err);
      toast.error("Failed to update status");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading)
    return (
      <AdminLayout>
        <p className="p-6">Loading orders...</p>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Manage Orders</h1>

        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="w-full table-auto border-collapse">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 text-left">Order ID</th>
                <th className="p-3 text-left">User</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center p-4 text-gray-500">
                    No orders found.
                  </td>
                </tr>
              )}
              {orders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{order._id}</td>
                  <td className="p-3">{order.user?.name || "Unknown"}</td>
                  <td className="p-3">₹{order.totalAmount}</td>
                  <td className="p-3">{order.status}</td>
                  <td className="p-3">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-center">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      className="p-1 rounded border text-sm"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
