import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import API from "../api/axios";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MyOrders() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized");

      const res = await API.get("/orders/my-orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
      toast.error("Failed to fetch your orders");

      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin text-gray-500" size={48} />
      </div>
    );

  if (!orders.length)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500 text-lg">
          You haven’t placed any orders yet.
        </p>
      </div>
    );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">My Orders</h1>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full table-auto border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Order ID</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Total Amount</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr key={order._id} className="border-b hover:bg-gray-50">
                <td className="p-3">{idx + 1}</td>
                <td className="p-3">{order._id}</td>
                <td className="p-3">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="p-3">₹{order.totalAmount}</td>
                <td
                  className={`p-3 font-semibold ${
                    order.status === "Delivered"
                      ? "text-green-600"
                      : order.status === "Cancelled"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {order.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
