import { useEffect, useState } from "react";
import { useCartStore } from "../store/useCartStore";
import API from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Checkout() {
  const { cart, fetchCart, clearCart } = useCartStore();
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
    document.getElementById("shipping")?.focus();
  }, []);

  if (!cart || !cart.items || cart.items.length === 0) {
    return <p className="p-4">Cart is empty.</p>;
  }

  const total = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    if (!address.trim()) return toast.error("Please enter shipping address");

    const token = localStorage.getItem("token");
    if (!token) return toast.error("You must be logged in to place an order");

    setLoading(true);
    try {
      await API.post(
        "/orders",
        {
          shippingAddress: address,
          totalAmount: total,
          items: cart.items.map((item) => ({
            product: item.product._id,
            quantity: item.quantity,
          })),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      await clearCart();
      toast.success("Order placed successfully!");
      navigate("/thankyou");
    } catch (err) {
      console.error("Order placement error:", err.response || err);
      toast.error(err.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 border rounded shadow">
      <nav className="text-sm text-gray-600 mb-6">
        <Link to="/" className="hover:underline">
          Home
        </Link>{" "}
        /{" "}
        <Link to="/cart" className="hover:underline">
          Cart
        </Link>{" "}
        / <span className="text-gray-800 font-medium">Checkout</span>
      </nav>

      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      <ul className="mb-4">
        {cart.items.map((item) => (
          <li key={item.product._id} className="flex justify-between mb-2">
            <span>
              {item.product.name} × {item.quantity}
            </span>
            <span>₹{item.product.price * item.quantity}</span>
          </li>
        ))}
      </ul>

      <p className="text-lg font-semibold mb-4">Total: ₹{total}</p>

      <textarea
        id="shipping"
        placeholder="Shipping address"
        className="w-full p-2 border mb-4"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        rows={3}
      />

      <button
        onClick={handlePlaceOrder}
        className="bg-green-600 text-white px-4 py-2 rounded w-full"
        disabled={loading}
      >
        {loading ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  );
}
  