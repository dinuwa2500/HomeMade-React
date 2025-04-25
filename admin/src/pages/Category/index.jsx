import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const API_BASE = import.meta.env.VITE_BACKEND_URI || "http://localhost:8000";

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [editingDescription, setEditingDescription] = useState("");

  // Fetch all categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accesstoken");
      const res = await fetch(`${API_BASE}/api/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.categories)) {
        setCategories(data.categories);
      } else {
        setError("Failed to fetch categories");
      }
    } catch (err) {
      setError("Failed to fetch categories");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Add category
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newCategory.trim() || !newDescription.trim()) return;
    try {
      const token = localStorage.getItem("accesstoken");
      const res = await fetch(`${API_BASE}/api/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newCategory, description: newDescription }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Category added!");
        setNewCategory("");
        setNewDescription("");
        fetchCategories();
      } else {
        toast.error(data.message || "Failed to add category");
      }
    } catch {
      toast.error("Failed to add category");
    }
  };

  // Delete category
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      const token = localStorage.getItem("accesstoken");
      const res = await fetch(`${API_BASE}/api/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Category deleted");
        fetchCategories();
      } else {
        toast.error(data.message || "Failed to delete");
      }
    } catch {
      toast.error("Failed to delete");
    }
  };

  // Start editing
  const startEdit = (cat) => {
    setEditingId(cat._id);
    setEditingName(cat.name);
    setEditingDescription(cat.description || "");
  };

  // Update category
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingName.trim() || !editingDescription.trim()) return;
    try {
      const token = localStorage.getItem("accesstoken");
      const res = await fetch(`${API_BASE}/api/categories/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: editingName, description: editingDescription }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Category updated");
        setEditingId(null);
        setEditingName("");
        setEditingDescription("");
        fetchCategories();
      } else {
        toast.error(data.message || "Failed to update");
      }
    } catch {
      toast.error("Failed to update");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-12">
      <h2 className="text-2xl font-bold mb-6">Category Management</h2>
      <form onSubmit={editingId ? handleUpdate : handleAdd} className="flex gap-2 mb-8 flex-col md:flex-row">
        <input
          type="text"
          className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Category name"
          value={editingId ? editingName : newCategory}
          onChange={e => editingId ? setEditingName(e.target.value) : setNewCategory(e.target.value)}
        />
        <input
          type="text"
          className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Description"
          value={editingId ? editingDescription : newDescription}
          onChange={e => editingId ? setEditingDescription(e.target.value) : setNewDescription(e.target.value)}
        />
        <button
          type="submit"
          className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow"
        >
          {editingId ? "Update" : "Add"}
        </button>
        {editingId && (
          <button
            type="button"
            className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold shadow"
            onClick={() => { setEditingId(null); setEditingName(""); setEditingDescription(""); }}
          >
            Cancel
          </button>
        )}
      </form>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <table className="w-full text-left border-t">
          <thead>
            <tr className="text-gray-600">
              <th className="py-2">Name</th>
              <th className="py-2">Description</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat._id} className="border-b hover:bg-gray-50">
                <td className="py-2">{cat.name}</td>
                <td className="py-2">{cat.description}</td>
                <td className="py-2 flex gap-2">
                  <button
                    className="px-3 py-1 rounded bg-yellow-400 hover:bg-yellow-500 text-white text-xs font-bold"
                    onClick={() => startEdit(cat)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white text-xs font-bold"
                    onClick={() => handleDelete(cat._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CategoryPage;
