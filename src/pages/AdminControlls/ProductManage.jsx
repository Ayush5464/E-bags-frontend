import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Edit, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import API from "../../api/axios";
import AdminLayout from "./Adminlayout"; // ✅ Adjust path as per your folder structure

export default function ProductManage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);
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

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      await API.delete(`/products/${id}`);
      toast.success("Product deleted successfully");
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      toast.error("Failed to delete product");
      console.error(err);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Manage Products
        </h1>

        {loading ? (
          <p className="text-gray-600">Loading products...</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded shadow">
            <table className="w-full table-auto border-collapse">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3 text-left text-gray-700">#</th>
                  <th className="p-3 text-left text-gray-700">Image</th>
                  <th className="p-3 text-left text-gray-700">Name</th>
                  <th className="p-3 text-left text-gray-700">Category</th>
                  <th className="p-3 text-left text-gray-700">Price</th>
                  <th className="p-3 text-left text-gray-700">Stock</th>
                  <th className="p-3 text-center text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, idx) => (
                  <tr key={product._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{idx + 1}</td>
                    <td className="p-3">
                      {product.images?.length > 0 ? (
                        <img
                          src={`http://localhost:5000${product.images[0]}`} // Only first image shown
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        <span className="text-gray-500">No Image</span>
                      )}
                    </td>
                    <td className="p-3">{product.name}</td>
                    <td className="p-3">{product.category}</td>
                    <td className="p-3">₹{product.price}</td>
                    <td className="p-3">{product.countInStock}</td>
                    <td className="p-3 flex justify-center gap-3">
                      <Link
                        to={`/admin/products/edit/${product._id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center p-6 text-gray-500">
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
