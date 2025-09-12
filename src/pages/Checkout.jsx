// src/pages/Checkout.jsx
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

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized");

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
          headers: {
            Authorization: `Bearer ${token}`, // ✅ pass token here
          },
        }
      );

      await clearCart();
      toast.success("Order placed successfully!");
      navigate("/thankyou");
    } catch (err) {
      console.error("Order placement error:", err);
      toast.error("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 border rounded shadow">
      {/* Breadcrumb */}
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

      <div className="mb-4 gap-2">
        <input
          type="radio"
          id="payment-method-1"
          name="payment-method"
          value="credit-card"
          className="mr-2"
        />
        <label htmlFor="payment-method-1" className="mr-4">
          Credit Card
        </label>

        <input
          type="radio"
          id="payment-method-2"
          name="payment-method"
          value="paypal"
          className="mr-2"
        />
        <label htmlFor="payment-method-2">PayPal</label>
        <br />
        <div className="mt-2">
          <input
            type="radio"
            id="payment-method-3"
            name="payment-method"
            value="cash-on-delivery"
            className="mr-2"
          />
          <label htmlFor="payment-method-3">Cash on Delivery</label>
        </div>
        <div className="mt-4 flex items-start">
          <input type="checkbox" id="terms" className="mr-2" />
          <label htmlFor="terms" className="text-sm text-gray-500">
            By placing your order, you agree to our Terms & Conditions.
          </label>
        </div>
      </div>

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
