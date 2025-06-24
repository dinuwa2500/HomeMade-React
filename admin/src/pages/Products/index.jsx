import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const API_BASE = import.meta.env.VITE_BACKEND_URI || "http://localhost:8000";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    brand: "",
    countInStock: "",
    discount: "",
    category: "",
    images: [],
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingProduct, setEditingProduct] = useState({});
  const [editingImagePreviews, setEditingImagePreviews] = useState([]);
  const [search, setSearch] = useState("");

  const filteredProducts = products.filter((prod) => {
    const name = prod.name?.toLowerCase() || "";
    const brand = prod.brand?.toLowerCase() || "";
    const categoryName = categories.find((cat) => cat._id === prod.category)?.name?.toLowerCase() || "";
    const searchTerm = search.toLowerCase();
    return (
      name.includes(searchTerm) ||
      brand.includes(searchTerm) ||
      categoryName.includes(searchTerm)
    );
  });

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/categories`);
      const data = await res.json();
      if (data.success && Array.isArray(data.categories)) {
        setCategories(data.categories);
      }
    } catch {}
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accesstoken");
      const res = await fetch(`${API_BASE}/api/products/all-products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.products)) {
        setProducts(data.products);
      } else {
        setError("Failed to fetch products");
      }
    } catch (err) {
      setError("Failed to fetch products");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const handleImageChange = (e, isEdit = false) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));
    if (isEdit) {
      setEditingProduct((p) => ({ ...p, images: files }));
      setEditingImagePreviews(previews);
    } else {
      setNewProduct((p) => ({ ...p, images: files }));
      setImagePreviews(previews);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (
      !newProduct.name.trim() ||
      !newProduct.price ||
      !newProduct.description.trim() ||
      !newProduct.category ||
      !newProduct.countInStock ||
      newProduct.images.length === 0
    ) {
      toast.error(
        "Please fill all required fields and add at least one image."
      );
      return;
    }
    try {
      const token = localStorage.getItem("accesstoken");
      const formData = new FormData();
      Object.entries(newProduct).forEach(([key, value]) => {
        if (key === "images") {
          value.forEach((img) => formData.append("images", img));
        } else {
          formData.append(key, value);
        }
      });
      const res = await fetch(`${API_BASE}/api/products/add`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Product added!");
        setNewProduct({
          name: "",
          price: "",
          description: "",
          brand: "",
          countInStock: "",
          discount: "",
          category: "",
          images: [],
        });
        setImagePreviews([]);
        fetchProducts();
      } else {
        toast.error(data.message || "Failed to add product");
      }
    } catch {
      toast.error("Failed to add product");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      const token = localStorage.getItem("accesstoken");
      const res = await fetch(`${API_BASE}/api/products/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Product deleted");
        fetchProducts();
      } else {
        toast.error(data.message || "Failed to delete");
      }
    } catch {
      toast.error("Failed to delete");
    }
  };

  const startEdit = (prod) => {
    setEditingId(prod._id);
    setEditingProduct({ ...prod, images: [] });
    setEditingImagePreviews(prod.images || []);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (
      !editingProduct.name.trim() ||
      !editingProduct.price ||
      !editingProduct.description.trim() ||
      !editingProduct.category ||
      !editingProduct.countInStock
    ) {
      toast.error("Please fill all required fields.");
      return;
    }
    try {
      const token = localStorage.getItem("accesstoken");
      const formData = new FormData();
      Object.entries(editingProduct).forEach(([key, value]) => {
        if (key === "images") {
          value.forEach((img) => formData.append("images", img));
        } else {
          formData.append(key, value);
        }
      });
      const res = await fetch(`${API_BASE}/api/products/update/${editingId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Product updated");
        setEditingId(null);
        setEditingProduct({});
        setEditingImagePreviews([]);
        fetchProducts();
      } else {
        toast.error(data.message || "Failed to update");
      }
    } catch {
      toast.error("Failed to update");
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-12">
      <h2 className="text-2xl font-bold mb-6">Product Management</h2>
      <form
        onSubmit={editingId ? handleUpdate : handleAdd}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
      >
        <input
          type="text"
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Product name*"
          value={editingId ? editingProduct.name || "" : newProduct.name}
          onChange={(e) =>
            editingId
              ? setEditingProduct((p) => ({ ...p, name: e.target.value }))
              : setNewProduct((p) => ({ ...p, name: e.target.value }))
          }
        />
        <input
          type="number"
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Price*"
          value={editingId ? editingProduct.price || "" : newProduct.price}
          onChange={(e) =>
            editingId
              ? setEditingProduct((p) => ({ ...p, price: e.target.value }))
              : setNewProduct((p) => ({ ...p, price: e.target.value }))
          }
        />
        <input
          type="text"
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Brand"
          value={editingId ? editingProduct.brand || "" : newProduct.brand}
          onChange={(e) =>
            editingId
              ? setEditingProduct((p) => ({ ...p, brand: e.target.value }))
              : setNewProduct((p) => ({ ...p, brand: e.target.value }))
          }
        />
        <input
          type="number"
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Stock*"
          value={
            editingId
              ? editingProduct.countInStock || ""
              : newProduct.countInStock
          }
          onChange={(e) =>
            editingId
              ? setEditingProduct((p) => ({
                  ...p,
                  countInStock: e.target.value,
                }))
              : setNewProduct((p) => ({ ...p, countInStock: e.target.value }))
          }
        />
        <input
          type="number"
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Discount (%)"
          value={
            editingId ? editingProduct.discount || "" : newProduct.discount
          }
          onChange={(e) =>
            editingId
              ? setEditingProduct((p) => ({ ...p, discount: e.target.value }))
              : setNewProduct((p) => ({ ...p, discount: e.target.value }))
          }
        />
        <select
          className={`border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
            (!editingId && newProduct.category === "") ||
            (editingId && editingProduct.category === "")
              ? "border-red-500 ring-red-300"
              : "focus:ring-blue-400"
          }`}
          value={
            editingId ? editingProduct.category || "" : newProduct.category
          }
          onChange={(e) =>
            editingId
              ? setEditingProduct((p) => ({ ...p, category: e.target.value }))
              : setNewProduct((p) => ({ ...p, category: e.target.value }))
          }
          required
        >
          <option value="">
            {categories.length === 0
              ? "No categories found. Please add categories first."
              : "Select Category*"}
          </option>
          {categories.map((cat) => (
            <option value={cat._id} key={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
        {((!editingId && newProduct.category === "") ||
          (editingId && editingProduct.category === "")) && (
          <div className="md:col-span-2 text-red-500 text-xs mb-2">
            Please select a category.
          </div>
        )}
        {categories.length === 0 && (
          <div className="md:col-span-2 text-red-500 text-sm mb-2">
            No categories available. Please add categories in the{" "}
            <a className="underline text-blue-600" href="/category">
              Category Management
            </a>{" "}
            page first.
          </div>
        )}
        <input
          type="text"
          className="md:col-span-2 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Description*"
          value={
            editingId
              ? editingProduct.description || ""
              : newProduct.description
          }
          onChange={(e) =>
            editingId
              ? setEditingProduct((p) => ({
                  ...p,
                  description: e.target.value,
                }))
              : setNewProduct((p) => ({ ...p, description: e.target.value }))
          }
        />
        <div className="md:col-span-2">
          <label className="block mb-1 font-medium">
            Product Images* (max 5)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleImageChange(e, !!editingId)}
          />
          <div className="flex gap-2 mt-2 flex-wrap">
            {(editingId ? editingImagePreviews : imagePreviews).map(
              (src, i) => (
                <img
                  key={i}
                  src={typeof src === "string" ? src : URL.createObjectURL(src)}
                  alt="Preview"
                  className="w-16 h-16 object-cover rounded border shadow-sm"
                />
              )
            )}
          </div>
        </div>
        <div className="md:col-span-2 flex gap-2">
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
              onClick={() => {
                setEditingId(null);
                setEditingProduct({});
                setEditingImagePreviews([]);
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200 bg-white">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Product List</h2>
            <input
              type="text"
              className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Search products by name, brand, or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ minWidth: 220 }}
            />
          </div>
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-blue-50 to-purple-100 text-gray-700">
                <th className="py-3 px-4 text-left font-semibold">Image</th>
                <th className="py-3 px-4 text-left font-semibold">Name</th>
                <th className="py-3 px-4 text-left font-semibold">Brand</th>
                <th className="py-3 px-4 text-left font-semibold">Category</th>
                <th className="py-3 px-4 text-left font-semibold">Price</th>
                <th className="py-3 px-4 text-left font-semibold">Stock</th>
                <th className="py-3 px-4 text-left font-semibold">Discount</th>
                <th className="py-3 px-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((prod) => (
                <tr key={prod._id} className="border-b hover:bg-blue-50 transition group">
                  <td className="py-2 px-4">
                    {prod.images && prod.images.length > 0 && (
                      <img
                        src={prod.images[0]}
                        alt="Product"
                        className="w-14 h-14 object-cover rounded-lg border shadow-sm group-hover:scale-105 transition-transform"
                      />
                    )}
                  </td>
                  <td className="py-2 px-4 font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                    {prod.name}
                  </td>
                  <td className="py-2 px-4">
                    <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                      {prod.brand}
                    </span>
                  </td>
                  <td className="py-2 px-4">
                    <span className="inline-block bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-medium">
                      {categories.find((cat) => cat._id === prod.category)?.name || prod.category}
                    </span>
                  </td>
                  <td className="py-2 px-4 text-red-600 font-bold">
                    Rs.{prod.price}
                  </td>
                  <td className="py-2 px-4">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${prod.countInStock <= 5 ? 'bg-yellow-100 text-yellow-700 animate-pulse' : 'bg-green-100 text-green-700'}`}>{prod.countInStock}</span>
                  </td>
                  <td className="py-2 px-4">
                    {prod.discount ? (
                      <span className="inline-block bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-semibold">{prod.discount}%</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="py-2 px-4 flex gap-2">
                    <button
                      className="px-3 py-1 rounded bg-yellow-400 hover:bg-yellow-500 text-white text-xs font-bold"
                      onClick={() => startEdit(prod)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white text-xs font-bold"
                      onClick={() => handleDelete(prod._id)}
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

export default ProductsPage;
