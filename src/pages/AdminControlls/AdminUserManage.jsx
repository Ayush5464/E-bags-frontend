// pages/AdminUserManage.jsx
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import API from "../../api/axios";
import { Trash2, ShieldCheck, ShieldX } from "lucide-react";
import AdminLayout from "./AdminLayout";

export default function AdminUserManage() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      toast.error("Failed to load users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this user?")) return;
    try {
      await API.delete(`/admin/users/${id}`);
      toast.success("User deleted");
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleRoleToggle = async (id, isAdmin) => {
    try {
      const res = await API.put(`/admin/users/${id}`, { isAdmin: !isAdmin });
      toast.success("Role updated");
      setUsers(users.map((u) => (u._id === id ? res.data.user : u)));
    } catch (err) {
      toast.error("Failed to update role");
    }
  };

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
            {users.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
