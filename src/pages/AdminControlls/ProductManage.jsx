import { useEffect, useState } from "react";
import { Edit, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import API from "../../api/axios";
import AdminLayout from "./AdminLayout";

export default function ProductManage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    countInStock: "",
    images: [],
  });

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data.products || res.data);
    } catch (err) {
      toast.error("Failed to fetch products");
      console.error(err);
    } finally {
      setLoading(false);
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

  const handleInputChange = (e) => {
    if (e.target.name === "images") {
      setForm({ ...form, images: e.target.files });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      countInStock: product.countInStock,
      images: [],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

    try {
      if (editingProduct) {
        await API.put(`/products/${editingProduct._id}`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Product updated");
      } else {
        await API.post("/products", formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Product created");
      }
      setForm({
        name: "",
        description: "",
        price: "",
        category: "",
        countInStock: "",
        images: [],
      });
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      toast.error("Failed to save product");
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Manage Products</h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 mb-6 rounded shadow space-y-4"
          encType="multipart/form-data"
        >
          <h2 className="text-lg font-semibold">
            {editingProduct ? "Edit Product" : "Add New Product"}
          </h2>

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleInputChange}
            placeholder="Name"
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleInputChange}
            placeholder="Description"
            className="w-full p-2 border rounded"
            rows={3}
          ></textarea>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleInputChange}
            placeholder="Price"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleInputChange}
            placeholder="Category"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="number"
            name="countInStock"
            value={form.countInStock}
            onChange={handleInputChange}
            placeholder="Stock"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="file"
            name="images"
            multiple
            accept="image/*"
            onChange={handleInputChange}
            className="w-full"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {editingProduct ? "Update" : "Create"}
          </button>
        </form>

        {loading ? (
          <p>Loading products...</p>
        ) : (
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
                    <td className="p-3">
                      {product.images?.[0] ? (
                        <img
                          src={`https://e-bags-backend.onrender.com${product.images[0]}`}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        "No Image"
                      )}
                    </td>
                    <td className="p-3">{product.name}</td>
                    <td className="p-3">{product.category}</td>
                    <td className="p-3">₹{product.price}</td>
                    <td className="p-3">{product.countInStock}</td>
                    <td className="p-3 flex gap-3 justify-center">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
