import { useCartStore } from "../store/useCartStore";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://e-bags-backend.onrender.com";

export default function ProductCard({ product }) {
  const addToCart = useCartStore((state) => state.addToCart);
  const navigate = useNavigate();

  const handleCardClick = () => navigate(`/products/${product._id}`);
  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product._id, 1);
  };

  // Build the full image URL
  const imagePath = product.images?.[0] || product.image;
  const imageUrl = imagePath?.startsWith("http")
    ? imagePath
    : `${BASE_URL}/uploads/${imagePath}`;

  return (
    <div
      onClick={handleCardClick}
      className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-200 cursor-pointer"
    >
      <div className="p-5">
        <img
          src={imageUrl}
          alt={product.name}
          className="h-48 w-full object-cover"
        />
      </div>
      <div className="p-4 flex flex-col justify-between h-full">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            {product.name}
          </h2>
          <p className="text-gray-600 text-sm mt-1">₹{product.price}</p>
          <p className="text-xs text-gray-400 mt-1">{product.category}</p>
        </div>
        <button
          onClick={handleAddToCart}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded transition"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
