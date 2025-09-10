import { useEffect, useState } from "react";
import API from "../api/axios";
import ProductCard from "../components/ProductCard";
import { FireExtinguisher, Star, TrendingUp } from "lucide-react";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    API.get("/products").then((res) => setProducts(res.data));
  }, []);

  const latestProducts = [...products]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  const trendingProducts = [...products]
    .sort((a, b) => (b.sold || 0) - (a.sold || 0))
    .slice(0, 4);

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to EbagMart
          </h1>
          <p className="text-lg md:text-xl mb-6">
            Find the perfect bag for any purpose
          </p>
          <a
            href="/products" // ✅ updated from #products
            className="bg-white text-blue-600 font-semibold px-6 py-3 rounded shadow hover:bg-gray-100 transition"
          >
            Shop Now
          </a>
        </div>
      </section>

      {/* Latest Products */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex gap-2">
            <Star size={40}/> Latest Products
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {latestProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex gap-2">
            <TrendingUp size={40} /> Trending Bags
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trendingProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="text-xl font-semibold mb-2">EbagMart</h3>
            <p className="text-sm text-gray-300">
              Your one-stop shop for quality and affordable bags.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Quick Links</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>
                <a href="/" className="hover:underline">
                  Home
                </a>
              </li>
              <li>
                <a href="/cart" className="hover:underline">
                  Cart
                </a>
              </li>
              <li>
                <a href="/orders" className="hover:underline">
                  Orders
                </a>
              </li>
              <li>
                <a href="/login" className="hover:underline">
                  Login
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Contact</h3>
            <p className="text-sm text-gray-300">
              support@ebagmart.com
              <br />
              +91 98765 43210
              <br />
              India
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} EbagMart. All rights reserved.
        </div>
      </footer>
    </>
  );
}
