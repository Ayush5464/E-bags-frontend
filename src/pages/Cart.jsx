import { useEffect } from "react";
import { useCartStore } from "../store/useCartStore";
import { useNavigate, Link } from "react-router-dom";

// Backend base URL
const BASE_URL = "https://e-bags-backend.onrender.com";

export default function Cart() {
  const { cart, fetchCart, removeFromCart, clearCart, loading } =
    useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-800">
        <p className="text-gray-400">Loading cart...</p>
      </div>
    );

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600 text-lg">Your cart is empty.</p>
      </div>
    );
  }

  const total = cart.items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  // Helper to build full image URL
  const getImageUrl = (path) =>
    path?.startsWith("http") ? path : `${BASE_URL}/uploads/${path}`;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:underline">
            Home
          </Link>{" "}
          / <span className="text-gray-800 font-medium">Cart</span>
        </nav>

        <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Cart</h1>

        <ul className="divide-y">
          {cart.items.map((item) => (
            <li
              key={item.product._id}
              className="py-4 flex justify-between items-center"
            >
              <div className="flex items-center gap-4">
                <img
                  src={getImageUrl(
                    item.product.images?.[0] || item.product.image
                  )}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {item.product.name}
                  </h2>
                  <p className="text-gray-600">Price: ₹{item.product.price}</p>
                  <p className="text-gray-600">Qty: {item.quantity}</p>
                </div>
              </div>

              <button
                onClick={() => removeFromCart(item.product._id)}
                className="text-red-600 hover:underline text-sm"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-6 border-t pt-4">
          <p className="text-xl font-bold text-gray-800">
            Total: ₹{total.toFixed(2)}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <button
              onClick={clearCart}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded"
            >
              Clear Cart
            </button>

            <button
              onClick={() => navigate("/checkout")}
              className="bg-blue-600 text-white px-4 py-2 rounded w-full sm:w-auto"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
