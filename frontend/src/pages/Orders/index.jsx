import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const API_URL = import.meta.env.VITE_BACKEND_URI || "http://localhost:8000";
const backendUrl = import.meta.env.VITE_BACKEND_URI || "http://localhost:8000";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImg, setLightboxImg] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("accesstoken");
        const res = await axios.get(`${API_URL}/api/order/myorders`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setOrders(Array.isArray(res.data.orders) ? res.data.orders : []);
      } catch (err) {
        Swal.fire({ icon: "error", title: "Failed to fetch your orders" });
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  const toggleOrder = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Shipped":
        return "bg-blue-100 text-blue-800";
      case "Processing":
        return "bg-yellow-100 text-yellow-800";
      case "Pending Payment":
        return "bg-yellow-100 text-yellow-800";
      case "To Delivery":
        return "bg-blue-100 text-blue-800";
      case "Delivering":
        return "bg-indigo-100 text-indigo-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleSlipUpload = async (orderId, file) => {
    const formData = new FormData();
    formData.append("slip", file);
    try {
      const token = localStorage.getItem("accesstoken");
      const res = await axios.post(
        `${API_URL}/api/order/${orderId}/slip`,
        formData,
        {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            "Content-Type": "multipart/form-data",
          },
        }
      );
      Swal.fire({
        icon: "success",
        title: "Slip uploaded! Awaiting admin approval.",
      });
      const res2 = await axios.get(`${API_URL}/api/order/myorders`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setOrders(res2.data.orders || []);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to upload slip",
        text: error?.response?.data?.message || "Server error",
      });
    }
  };

  const mappedOrders = orders.map((order) => ({
    ...order,
    id: order._id || order.id,
    date: order.createdAt
      ? new Date(order.createdAt).toLocaleDateString()
      : order.date,
    status:
      order.status === "pending_payment"
        ? "Pending Payment"
        : order.status === "to_delivery"
        ? "To Delivery"
        : order.status === "delivering"
        ? "Delivering"
        : order.status === "delivered"
        ? "Delivered"
        : order.status === "cancelled"
        ? "Cancelled"
        : order.status || "Processing",
    total: order.totalAmt || order.total,
    items: Array.isArray(order.items)
      ? order.items.map((item) => ({
          ...item,
          id: item.productId || item.id,
          quantity: item.qty || item.quantity,
          price: item.price,
          name: item.name,
          image:
            item.image && Array.isArray(item.image)
              ? item.image[0]
              : item.image,
        }))
      : [],
  }));

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Your Orders</h1>
          <p className="mt-2 text-sm text-gray-600">
            View and manage your recent purchases
          </p>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : mappedOrders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No orders found
            </h3>
            <p className="mt-2 text-gray-500">
              You haven't placed any orders yet.
            </p>
            <div className="mt-6">
              <Link
                to="/products"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Browse Products
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {mappedOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white shadow overflow-hidden rounded-lg divide-y divide-gray-200"
              >
                <div className="px-4 py-5 sm:px-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="mb-4 sm:mb-0">
                      <h3 className="text-lg font-medium text-gray-900">
                        Order #{order.id}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Placed on {order.date}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                      {(order.status === "Pending Payment" ||
                        order.status === "pending_approval" ||
                        order.status === "Pending Approval") && (
                        <div className="mb-6">
                          <h5 className="text-sm font-medium text-gray-900 mb-2">
                            Payment Slip
                          </h5>
                          {order.paymentSlip ? (
                            <div className="mb-2">
                              {order.paymentSlip.match(
                                /\.(jpg|jpeg|png|gif|webp)$/i
                              ) ? (
                                <>
                                  <img
                                    src={`${backendUrl}${order.paymentSlip}`}
                                    alt="Payment Slip"
                                    className="max-h-32 max-w-xs object-contain border rounded cursor-pointer"
                                    onClick={() => {
                                      setLightboxImg(
                                        `${backendUrl}${order.paymentSlip}`
                                      );
                                      setLightboxOpen(true);
                                    }}
                                  />
                                  {lightboxOpen && lightboxImg && (
                                    <div
                                      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
                                      onClick={() => setLightboxOpen(false)}
                                    >
                                      <img
                                        src={lightboxImg}
                                        alt="Full Payment Slip"
                                        className="max-h-[90vh] max-w-[90vw] rounded shadow-lg border-4 border-white"
                                        onClick={(e) => e.stopPropagation()}
                                      />
                                    </div>
                                  )}
                                </>
                              ) : (
                                <a
                                  href={`${backendUrl}${order.paymentSlip}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-indigo-600 underline"
                                >
                                  View Uploaded Slip
                                </a>
                              )}
                            </div>
                          ) : (
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                const file = e.target.elements.slip.files[0];
                                if (file) handleSlipUpload(order.orderId, file);
                              }}
                            >
                              <input
                                type="file"
                                name="slip"
                                accept="image/*,application/pdf"
                                className="block mb-2"
                                required
                              />
                              <button
                                type="submit"
                                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                              >
                                Upload Slip
                              </button>
                            </form>
                          )}
                        </div>
                      )}
                      {order.status === "pending_payment" ? (
                        <Link
                          to={`/payment-slip?orderId=${order.id}`}
                          className="inline-block px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                        >
                          Pay
                        </Link>
                      ) : order.paymentSlip ? (
                        <span className="text-green-700 font-semibold">
                          Slip Uploaded
                        </span>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                      <p className="text-lg font-semibold text-gray-900">
                        Rs{" "}
                        {order.total?.toFixed
                          ? order.total.toFixed(2)
                          : order.total}
                      </p>
                      <button
                        onClick={() => toggleOrder(order.id)}
                        className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                      >
                        {expandedOrder === order.id
                          ? "Hide details"
                          : "View details"}
                      </button>
                    </div>
                  </div>
                </div>

                {expandedOrder === order.id && (
                  <div className="px-4 py-5 sm:p-6">
                    <h4 className="text-md font-medium text-gray-900 mb-4">
                      Order Items
                    </h4>
                    <div className="space-y-6">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex flex-col sm:flex-row border-b border-gray-200 pb-6 last:border-0 last:pb-0"
                        >
                          <div className="flex-shrink-0 mb-4 sm:mb-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-20 h-20 rounded-md object-cover"
                            />
                          </div>
                          <div className="flex-1 sm:ml-6">
                            <div className="flex flex-col sm:flex-row sm:justify-between">
                              <div>
                                <h5 className="text-base font-medium text-gray-900">
                                  {item.name}
                                </h5>
                                <p className="mt-1 text-sm text-gray-500">
                                  Quantity: {item.quantity}
                                </p>
                              </div>
                              <p className="mt-2 sm:mt-0 text-lg font-semibold text-gray-900">
                                Rs{" "}
                                {item.price?.toFixed
                                  ? item.price.toFixed(2)
                                  : item.price}
                              </p>
                            </div>
                            {item.deliveredOn && (
                              <p className="mt-2 text-sm text-gray-500">
                                Delivered on {item.deliveredOn}
                              </p>
                            )}
                            <div className="mt-4 flex space-x-4">
                              <button
                                type="button"
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                              >
                                Buy it again
                              </button>
                              <button
                                type="button"
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                              >
                                View product
                              </button>
                              {order.status === "Delivered" && (
                                <button
                                  type="button"
                                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                                >
                                  Leave review
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 flex flex-col sm:flex-row sm:justify-between">
                      <div className="mb-4 sm:mb-0">
                        <h5 className="text-sm font-medium text-gray-900">
                          Shipping Address
                        </h5>
                        <p className="mt-1 text-sm text-gray-500">
                          {order.delivery_address || "No address found"}
                        </p>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-900">
                          Payment Method
                        </h5>
                        <p className="mt-1 text-sm text-gray-500">
                          Cash On Delivery
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          Total: Rs{" "}
                          {order.total?.toFixed
                            ? order.total.toFixed(2)
                            : order.total}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
