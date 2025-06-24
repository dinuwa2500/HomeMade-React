import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import OrderTable from "../components/OrderTable/OrderTable";

const API_URL = import.meta.env.VITE_BACKEND_URI || "http://localhost:8000";

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "to_delivery", label: "To Delivery" },
  { value: "delivering", label: "Delivering" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("accesstoken");
        const res = await axios.get(`${API_URL}/api/order/all`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setOrders(res.data.orders || []);
      } catch (err) {
        setError("Failed to fetch orders from database.");
        setOrders([]);
        toast.error("Failed to fetch orders from database.");
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    let data = [...orders];
    if (search) {
      const s = search.toLowerCase();
      data = data.filter(
        (o) =>
          (o._id && o._id.toLowerCase().includes(s)) ||
          (o.customerName && o.customerName.toLowerCase().includes(s))
      );
    }
    if (status) {
      data = data.filter((o) => o.status === status);
    }
    setFiltered(data);
    setPage(1);
  }, [orders, search, status]);

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 min-h-[500px]">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Search by Order ID or Customer"
            className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-400"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option value={opt.value} key={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-400 text-lg animate-pulse">Loading orders...</div>
        </div>
      ) : error ? (
        <div className="text-center text-red-400 py-16">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-gray-400 py-16">No orders found.</div>
      ) : (
        <>
          <OrderTable orders={paginated} />
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-500">
              Showing{" "}
              {filtered.length === 0 ? 0 : (page - 1) * pageSize + 1}-
              {Math.min(page * pageSize, filtered.length)} of {filtered.length}
            </div>
            <div className="flex gap-2">
              <button
                className="px-3 py-1 rounded bg-gray-100 text-gray-500 hover:bg-gray-200 disabled:opacity-50"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Prev
              </button>
              <span className="px-2 text-sm">Page {page} / {totalPages || 1}</span>
              <button
                className="px-3 py-1 rounded bg-gray-100 text-gray-500 hover:bg-gray-200 disabled:opacity-50"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || totalPages === 0}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminOrders;
