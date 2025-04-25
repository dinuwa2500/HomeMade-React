import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const statusColors = {
  pending_payment: "bg-yellow-200 text-yellow-800",
  to_delivery: "bg-blue-200 text-blue-800",
  delivering: "bg-purple-200 text-purple-800",
  delivered: "bg-green-200 text-green-800",
  cancelled: "bg-red-200 text-red-800",
};

export default function AdminAssignedOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      try {
        const token = localStorage.getItem("accesstoken");
        let url = `${import.meta.env.VITE_BACKEND_URL || "http://localhost:8000"}/api/order/assigned`;
        const res = await axios.get(url, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setOrders(res.data.orders);
      } catch (err) {
        let message =
          err.response?.data?.message ||
          err.message ||
          "Failed to fetch assigned orders.";
        setError(message);
        toast.error(message);
      }
      setLoading(false);
    }
    fetchOrders();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center"> Assigned Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center text-gray-500">No assigned orders found.</div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.orderId}
              className="bg-white shadow rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between hover:shadow-lg transition"
            >
              <div>
                <div className="font-semibold text-lg">Order: {order.orderId}</div>
                <div className="text-gray-500 text-sm">Placed: {new Date(order.createdAt).toLocaleString()}</div>
                <div className="text-gray-600 mt-1">Address: {order.delivery_address}</div>
                <div className="text-gray-600 mt-1">Items: {order.items.length}</div>
              </div>
              <div className="flex flex-col items-end mt-2 md:mt-0">
                <span
                  className={`px-3 py-1 rounded-full font-semibold text-xs mb-2 ${statusColors[order.status] || "bg-gray-200 text-gray-700"}`}
                >
                  {order.status.replace("_", " ")}
                </span>
                <Link
                  to={`/profile/my-deliveries/${order.orderId}`}
                  className="text-blue-600 underline text-sm hover:text-blue-800"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
