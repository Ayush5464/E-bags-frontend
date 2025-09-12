// src/pages/AdminControlls/ProductManage.jsx

import { useEffect, useState } from "react";
import { Edit, Save, Trash2, X, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import API from "../../api/axios";
import AdminLayout from "./AdminLayout";

export default function ProductManage() {
  const [products, setProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [form, setForm] = useState({});

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data.products || res.data);
    } catch (err) {
      toast.error("Failed to fetch products");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await API.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Product deleted");
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleEdit = (product) => {
    setEditingProductId(product._id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      countInStock: product.countInStock,
      images: [],
    });
  };

  const handleCancel = () => {
    setEditingProductId(null);
    setForm({});
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setForm((prevForm) => ({
      ...prevForm,
      images: e.target.files, // FileList (multiple files)
    }));
  };

  const handleUpdate = async (id) => {
    try {
      const formData = new FormData();
      for (let key in form) {
        if (key === "images") {
          for (let file of form.images) {
            formData.append("images", file);
          }
        } else {
          formData.append(key, form[key]);
        }
      }

      await API.put(`/products/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Product updated");
      setEditingProductId(null);
      fetchProducts();
    } catch (err) {
      toast.error("Update failed");
      console.error(err);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Manage Products
        </h1>

        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="w-full table-auto border-collapse">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Stock</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, idx) => (
                <tr key={product._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{idx + 1}</td>

                  {/* Editable Image Cell */}
                  <td className="p-3">
                    {editingProductId === product._id ? (
                      <label className="cursor-pointer inline-block relative group">
                        <ImageIcon
                          size={20}
                          className="text-indigo-600 group-hover:scale-110 transition"
                          title="Change Images"
                        />
                        <input
                          type="file"
                          name="images"
                          accept="image/*"
                          multiple
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          onChange={handleImageChange}
                        />
                      </label>
                    ) : product.images?.[0] ? (
                      <img
                        src={`https://e-bags-backend.onrender.com${product.images[0]}`}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>

                  {/* Editable Fields */}
                  {editingProductId === product._id ? (
                    <>
                      <td className="p-3">
                        <input
                          name="name"
                          value={form.name}
                          onChange={handleInputChange}
                          className="p-1 border w-full"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          name="category"
                          value={form.category}
                          onChange={handleInputChange}
                          className="p-1 border w-full"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          name="price"
                          value={form.price}
                          onChange={handleInputChange}
                          className="p-1 border w-full"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          name="countInStock"
                          value={form.countInStock}
                          onChange={handleInputChange}
                          className="p-1 border w-full"
                        />
                      </td>
                      <td className="p-3 flex justify-center gap-3">
                        <button
                          onClick={() => handleUpdate(product._id)}
                          className="text-green-600 hover:text-green-800"
                          title="Save"
                        >
                          <Save size={25} />
                        </button>
                        <button
                          onClick={handleCancel}
                          className="text-gray-600 hover:text-gray-800"
                          title="Cancel"
                        >
                          <X size={25} />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-3">{product.name}</td>
                      <td className="p-3">{product.category}</td>
                      <td className="p-3">₹{product.price}</td>
                      <td className="p-3">{product.countInStock}</td>
                      <td className="p-3 flex justify-center gap-3">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit size={25} />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={25} />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
