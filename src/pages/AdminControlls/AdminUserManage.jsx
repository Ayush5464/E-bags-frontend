// pages/AdminControlls/AdminUserManage.jsx
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import API from "../../api/axios";
import { Trash2, ShieldCheck, ShieldX } from "lucide-react";
import AdminLayout from "./AdminLayout";

export default function AdminUserManage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized");

      const res = await API.get("/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(res.data.users || res.data); // support both response formats
    } catch (err) {
      console.error("Failed to load users:", err);
      toast.error("Failed to load users. Make sure you are an admin.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this user?")) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized");

      await API.delete(`/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("User deleted");
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Delete failed");
    }
  };

  const handleRoleToggle = async (id, isAdmin) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized");

      const res = await API.put(
        `/admin/users/${id}`,
        { isAdmin: !isAdmin },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Role updated");
      setUsers(
        users.map((u) => (u._id === id ? res.data.user || res.data : u))
      );
    } catch (err) {
      console.error("Failed to update role:", err);
      toast.error("Failed to update role");
    }
  };

  if (loading)
    return (
      <AdminLayout>
        <p className="p-6">Loading users...</p>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Manage Users</h1>
      <div className="overflow-auto bg-white rounded shadow">
        <table className="w-full table-auto border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
            {users.map((u) => (
              <tr key={u._id} className="border-b">
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.isAdmin ? "Admin" : "User"}</td>
                <td className="p-3 text-center flex gap-4 justify-center">
                  <button
                    onClick={() => handleRoleToggle(u._id, u.isAdmin)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Toggle Role"
                  >
                    {u.isAdmin ? (
                      <ShieldX size={18} />
                    ) : (
                      <ShieldCheck size={18} />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(u._id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
