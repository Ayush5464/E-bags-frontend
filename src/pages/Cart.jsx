import { useEffect } from "react";
import { useCartStore } from "../store/useCartStore";
import { useNavigate, Link } from "react-router-dom";

export default function Cart() {
  const { cart, fetchCart, removeFromCart, clearCart, loading } =
    useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) return <p className="p-4">Loading cart...</p>;

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

  return (
    <div className="min-h-screen bg-gray-800 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-gray-300 p-6 rounded-lg shadow">
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
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {item.product.name}
                </h2>
                <p className="text-gray-600">Price: ₹{item.product.price}</p>
                <p className="text-gray-600">Qty: {item.quantity}</p>
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
              className="bg-blue-600 text-white px-4 py-2 rounded w-full mt-4"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
