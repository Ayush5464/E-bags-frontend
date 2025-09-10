import React, { useEffect, useState } from "react";
import API from "../api/axios"; // make sure this has `withCredentials: true`
import { toast } from "react-hot-toast";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders for current user
  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders/my"); // Backend route should return user's orders
      setOrders(res.data);
    } catch (err) {
      toast.error("Failed to fetch orders");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <p className="p-4">Loading your orders...</p>;

  if (orders.length === 0)
    return (
      <p className="p-4 text-gray-500">You have not placed any orders yet.</p>
    );

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">My Orders</h1>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full table-auto border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-left text-gray-700">#</th>
              <th className="p-3 text-left text-gray-700">Products</th>
              <th className="p-3 text-left text-gray-700">Total</th>
              <th className="p-3 text-left text-gray-700">Status</th>
              <th className="p-3 text-left text-gray-700">Placed On</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr key={order._id} className="border-b hover:bg-gray-50">
                <td className="p-3">{idx + 1}</td>
                <td className="p-3">
                  {order.products.map((p) => (
                    <div key={p._id} className="flex items-center gap-2 mb-1">
                      <img
                        src={`http://localhost:5000${p.product.images[0]}`}
                        alt={p.product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <span>
                        {p.product.name} x {p.quantity}
                      </span>
                    </div>
                  ))}
                </td>
                <td className="p-3">₹{order.totalAmount}</td>
                <td className="p-3">{order.status}</td>
                <td className="p-3">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MyOrders;
