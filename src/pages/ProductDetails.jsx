import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../api/axios";
import { useCartStore } from "../store/useCartStore";
import { Loader2 } from "lucide-react";

// Backend base URL
const BASE_URL = "https://e-bags-backend.onrender.com";

// Helper to generate correct image URL
const getImageUrl = (path) => {
  if (!path) return ""; // safety check
  if (path.startsWith("http")) return path; // already full URL
  return path.startsWith("/uploads/")
    ? `${BASE_URL}${path}`
    : `${BASE_URL}/uploads/${path}`;
};

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    API.get(`/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setMainImage(res.data.images?.[0] || res.data.image);
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (!product)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-800">
        <Loader2 className="animate-spin text-gray-400" size={48} />
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto mt-8 p-4">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-600 mb-4">
        <a href="/" className="hover:underline">
          Home
        </a>{" "}
        /{" "}
        <Link to="/products" className="hover:underline">
          Products
        </Link>{" "}
        / <span className="text-gray-800 font-medium">{product.name}</span>
      </nav>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Images */}
        <div className="flex flex-col gap-2">
          <img
            src={getImageUrl(mainImage)}
            alt={product.name}
            className="w-full md:w-96 h-96 object-cover rounded-lg"
          />
          <div className="flex gap-2 mt-2 flex-wrap">
            {product.images?.map((img, index) => (
              <img
                key={index}
                src={getImageUrl(img)}
                alt={`Product ${index + 1}`}
                className={`w-20 h-20 object-cover rounded cursor-pointer border ${
                  mainImage === img ? "border-blue-600" : "border-gray-200"
                }`}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-gray-600 mb-2">{product.category}</p>
            <p className="text-gray-800 text-xl font-semibold mb-4">
              ₹{product.price}
            </p>
            <p className="text-gray-700">{product.description}</p>
          </div>
          <button
            onClick={() => addToCart(product._id, 1)}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 w-full md:w-auto"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
