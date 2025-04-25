import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import OrderStatusBadge from "../components/OrderTable/OrderStatusBadge";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_BACKEND_URI || "http://localhost:8000";

const AdminOrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("accesstoken");
        const res = await axios.get(`${API_URL}/api/order/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setOrder(res.data.order);
      } catch (err) {
        setError("Failed to fetch order from database.");
        setOrder(null);
        toast.error("Failed to fetch order from database.");
      }
      setLoading(false);
    };
    fetchOrder();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-400 animate-pulse">
        Loading order...
      </div>
    );
  if (error || !order)
    return (
      <div className="text-center text-red-400 py-16">Order not found.</div>
    );

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-3xl mx-auto mt-8">
      <button
        onClick={() => window.history.length > 1 ? window.history.back() : window.location.replace('/orders')}
        className="mb-4 px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
      >
        &larr; Back to Orders
      </button>
      <h1 className="text-2xl font-bold mb-2">Order Details</h1>
      <div className="mb-4 text-gray-500 text-sm">
        Order ID: <span className="font-mono">{order._id}</span>
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:gap-8 mb-6">
        <div>
          <div className="mb-2">
            <span className="font-semibold">Customer:</span>{" "}
            {order.customerName || order.userId?.email || order.userId?.firstName || order.userId?.name || "-"}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Address:</span>{" "}
            {order.delivery_address || order.address || order.deliveryAddress || "-"}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Order Date:</span>{" "}
            {new Date(order.createdAt).toLocaleString()}
          </div>
        </div>
        <div>
          <div className="mb-2">
            <span className="font-semibold">Total:</span> Rs.{order.totalAmt || order.total || order.subTotalAmt || 0}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Payment:</span>{" "}
            {order.payment_status || order.paymentStatus || order.paymentStatusLabel || "-"}
          </div>
          <div className="mb-2 flex items-center gap-2">
            <span className="font-semibold">Status:</span>{" "}
            <OrderStatusBadge status={order.status} />
          </div>
        </div>
      </div>
      <h2 className="text-lg font-semibold mb-2">Items</h2>
      <table className="min-w-full mb-4 border rounded">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left">Product</th>
            <th className="px-4 py-2 text-left">Qty</th>
            <th className="px-4 py-2 text-left">Price</th>
            <th className="px-4 py-2 text-left">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {order.items?.map((item, idx) => (
            <tr key={idx}>
              <td className="px-4 py-2">{item.name}</td>
              <td className="px-4 py-2">{item.qty}</td>
              <td className="px-4 py-2">Rs.{item.price}</td>
              <td className="px-4 py-2">Rs.{item.qty * item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrderDetails;
