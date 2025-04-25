import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const statusColors = {
  pending_payment: "bg-yellow-200 text-yellow-800",
  to_delivery: "bg-blue-200 text-blue-800",
  delivering: "bg-purple-200 text-purple-800",
  delivered: "bg-green-200 text-green-800",
  cancelled: "bg-red-200 text-red-800",
};

export default function DeliveryDetails() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`/api/orders/${orderId}`, { withCredentials: true })
      .then((res) => {
        setOrder(res.data.order);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [orderId]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!order) return <div className="text-center mt-10 text-gray-500">Order not found.</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Link to="/deliveries" className="text-blue-600 hover:underline">&larr; Back to Deliveries</Link>
      <h1 className="text-2xl font-bold mb-4 mt-2">Delivery Details</h1>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-2">
          <div className="font-semibold">Order: {order.orderId}</div>
          <span className={`px-3 py-1 rounded-full font-semibold text-xs ${statusColors[order.status] || "bg-gray-200 text-gray-700"}`}>{order.status.replace("_", " ")}</span>
        </div>
        <div className="mb-2">Placed: {new Date(order.createdAt).toLocaleString()}</div>
        <div className="mb-2">Address: {order.delivery_address}</div>
        <div className="mb-2">Items:</div>
        <ul className="ml-4 list-disc text-gray-700">
          {order.items.map((item, idx) => (
            <li key={idx} className="mb-1">
              <span className="font-semibold">{item.name}</span> (x{item.qty}) - Rs.{item.price}
            </li>
          ))}
        </ul>
        <div className="mt-4 font-semibold">Total: Rs.{order.totalAmt}</div>
      </div>
    </div>
  );
}
