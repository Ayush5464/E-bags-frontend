// pages/AdminControlls/AdminProductUpload.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../api/axios";

export default function AdminProductUpload() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    countInStock: "",
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImagesChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0)
      return toast.error("Please select at least one image");

    const formData = new FormData();
    for (let key in form) {
      const value =
        key === "price" || key === "countInStock"
          ? Number(form[key])
          : form[key];
      formData.append(key, value);
    }
    images.forEach((img) => formData.append("images", img));

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized");

      await API.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // ✅ send token
        },
      });

      toast.success("Product uploaded successfully!");
      navigate("/admin/uploads");
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error(err.response?.data?.message || "Failed to upload product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-blue-100 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-indigo-700 mb-6 text-center">
          Upload New Product
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              name="name"
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter product name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              onChange={handleChange}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter product description"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <input
                name="price"
                type="number"
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="₹ Price"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock Count
              </label>
              <input
                name="countInStock"
                type="number"
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Stock quantity"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <input
              name="category"
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Product category"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Images (1 main + 3 similar)
            </label>
            <input
              type="file"
              name="images"
              accept="image/*"
              multiple
              onChange={handleImagesChange}
              className="w-full file:py-2 file:px-4 file:border file:rounded file:border-gray-300 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-semibold hover:from-indigo-600 hover:to-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload Product"}
          </button>
        </form>
      </div>
    </div>
  );
}
