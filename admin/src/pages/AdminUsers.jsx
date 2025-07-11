import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_BACKEND_URI || "http://localhost:8000";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accesstoken");
      const res = await axios.get(`${API_URL}/api/users/all`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setUsers(res.data.users || []);
    } catch (err) {
      toast.error("Failed to fetch users");
      setUsers([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const makeAdmin = async (userId) => {
    try {
      const token = localStorage.getItem("accesstoken");
      await axios.patch(
        `${API_URL}/api/users/${userId}/role`,
        { role: "admin" },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      toast.success("User promoted to admin");
      fetchUsers();
    } catch (err) {
      toast.error("Failed to assign admin role");
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = localStorage.getItem("accesstoken");
      await axios.delete(`${API_URL}/api/users/${userId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      toast.success("User deleted");
      fetchUsers();
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  const filteredUsers = users.filter((user) => {
    const q = search.toLowerCase();
    return (
      user.firstName?.toLowerCase().includes(q) ||
      user.name?.toLowerCase().includes(q) ||
      user.email?.toLowerCase().includes(q) ||
      user.role?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 min-h-[400px]">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <div className="w-full sm:w-[300px]">
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-200 focus:outline-none transition placeholder-gray-400"
            placeholder="Search users by name, email, or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="text-gray-400 text-lg animate-pulse">
            Loading users...
          </div>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center text-gray-400 py-16">No users found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border border-gray-200 rounded-xl overflow-hidden">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 flex items-center gap-3">
                    {/* Avatar Placeholder */}
                    <span className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-blue-100 text-blue-600 font-bold uppercase">
                      {user.firstName?.[0] || user.name?.[0] || "U"}
                    </span>
                    <span className="font-medium text-gray-800">
                      {user.firstName || user.name || "-"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>
                  <td className="px-6 py-4 text-gray-600 capitalize">{user.role}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      className="bg-green-100 hover:bg-green-200 text-green-700 font-semibold py-1 px-3 rounded mr-2 transition"
                      onClick={() => makeAdmin(user._id)}
                      disabled={user.role === "admin"}
                    >
                      Make Admin
                    </button>
                    <button
                      className="bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-1 px-3 rounded transition"
                      onClick={() => deleteUser(user._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
