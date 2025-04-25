import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import MyContext from "../context";
const statusColors = {
  pending_payment: "bg-yellow-200 text-yellow-800",
  to_delivery: "bg-blue-200 text-blue-800",
  delivering: "bg-purple-200 text-purple-800",
  delivered: "bg-green-200 text-green-800",
  cancelled: "bg-red-200 text-red-800",
};

export default function AdminAssignedOrderDetails() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const context = useContext(MyContext);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const token = localStorage.getItem("accesstoken");
        let url;
        if (context?.user?.role === "driver") {
          url = `${
            import.meta.env.VITE_BACKEND_URL || "http://localhost:8000"
          }/api/order/assigned/${orderId}`;
        } else {
          url = `${
            import.meta.env.VITE_BACKEND_URL || "http://localhost:8000"
          }/api/order/${orderId}`;
        }
        const res = await axios.get(url, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setOrder(res.data.order);
      } catch (err) {
        let message =
          err.response?.data?.message ||
          err.message ||
          "Order not found or you do not have access.";
        setError(message);
        toast.error(message);
      }
      setLoading(false);
    }
    fetchOrder();
  }, [orderId, context?.user?.role]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error || !order)
    return (
      <div className="text-center mt-10 text-red-500">
        {error || "Order not found."}
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Link to="/profile/my-deliveries" className="text-blue-600 hover:underline">
        &larr; Back to Orders
      </Link>
      <h1 className="text-3xl font-bold mb-4 mt-2">
        Order &amp; Driver Assignment Details
      </h1>
      <div className="bg-white rounded-lg shadow p-6 mt-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
          <div>
            <div className="font-semibold text-lg">Order: {order.orderId}</div>
            <div className="text-gray-500 text-sm">
              Placed: {new Date(order.createdAt).toLocaleString()}
            </div>
            <div className="text-gray-600 mt-1">
              Address: {order.delivery_address}
            </div>
            <div className="text-gray-600 mt-1">
              Status:{" "}
              <span
                className={`px-3 py-1 rounded-full font-semibold text-xs ${
                  statusColors[order.status] || "bg-gray-200 text-gray-700"
                }`}
              >
                {order.status.replace("_", " ")}
              </span>
            </div>
          </div>
          <div className="mt-4 md:mt-0 text-sm">
            <div className="font-semibold">Assigned Driver</div>
            {order.deliveryUser ? (
              <div className="bg-blue-50 rounded p-2 mt-1">
                <div className="font-medium">{order.deliveryUser.name}</div>
                <div className="text-gray-600">
                  Email: {order.deliveryUser.email}
                </div>
                <div className="text-gray-600">
                  Phone: {order.deliveryUser.mobile}
                </div>
              </div>
            ) : (
              <div className="text-gray-500">No driver assigned.</div>
            )}
          </div>
        </div>
        <div className="border-t pt-4 mt-4">
          <div className="font-semibold mb-2">Order Items</div>
          <ul className="ml-4 list-disc text-gray-700">
            {order.items.map((item, idx) => (
              <li key={idx} className="mb-1">
                <span className="font-semibold">{item.name}</span> (x{item.qty})
                - Rs.{item.price}
              </li>
            ))}
          </ul>
          <div className="mt-4 font-semibold">Total: Rs.{order.totalAmt}</div>
        </div>
      </div>
    </div>
  );
}
