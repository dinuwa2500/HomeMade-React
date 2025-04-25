import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:8000";

const statusColors = {
  pending_payment: "bg-yellow-200 text-yellow-800",
  to_delivery: "bg-blue-200 text-blue-800",
  delivering: "bg-purple-200 text-purple-800",
  delivered: "bg-green-200 text-green-800",
  cancelled: "bg-red-200 text-red-800",
};

export default function AdminDeliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accesstoken");
    console.log("[DEBUG] accesstoken:", token);
    axios
      .get(`${API_URL}/api/order/all`, {
        withCredentials: true,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      .then((res) => {
        console.log("[DEBUG] /api/order/all response:", res);
        setDeliveries(res.data.orders || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("[DEBUG] /api/order/all error:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch deliveries"
        );
        setLoading(false);
      });
  }, []);

  const filtered = filter
    ? deliveries.filter((d) => d.status === filter)
    : deliveries;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-extrabold mb-8 text-center tracking-tight text-gray-900">
            Delivery Management
          </h1>
          <div className="flex flex-wrap gap-2 mb-6 justify-center">
            {Object.keys(statusColors).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  statusColors[status]
                } ${filter === status ? "ring-2 ring-black scale-105" : "hover:bg-opacity-80"}`}
              >
                {status.replace("_", " ")}
              </button>
            ))}
            <button
              onClick={() => setFilter("")}
              className="px-4 py-2 rounded-full text-xs font-semibold border bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              All
            </button>
          </div>
          {loading ? (
            <div className="text-center text-lg text-gray-500 py-12">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-600 py-12">{error}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center text-gray-500 py-12">No deliveries found.</div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="min-w-full bg-white divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Order</th>
                    <th className="py-3 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">User</th>
                    <th className="py-3 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Address</th>
                    <th className="py-3 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="py-3 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Total</th>
                    <th className="py-3 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((order, idx) => (
                    <tr key={order.orderId} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="py-3 px-4 font-mono text-sm">{order.orderId}</td>
                      <td className="py-3 px-4 text-sm">{order.userId?.email || order.userId}</td>
                      <td className="py-3 px-4 text-xs text-gray-600">{order.delivery_address}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full font-semibold text-xs shadow-sm ${
                            statusColors[order.status] || "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {order.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">Rs.{order.totalAmt}</td>
                      <td className="py-3 px-4">
                        <Link
                          to={`/deliveries/${order.orderId}`}
                          className="inline-block text-blue-600 underline text-sm font-semibold hover:text-blue-800 transition-colors duration-150"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
