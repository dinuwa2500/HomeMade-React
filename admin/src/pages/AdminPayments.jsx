import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import html2canvas from "html2canvas";

const API_URL = import.meta.env.VITE_BACKEND_URI || "http://localhost:8000";
const backendUrl = API_URL;

const STATUS_OPTIONS = [
  {
    value: "pending_payment",
    label: "Pending Payment",
    color: "bg-yellow-200 text-yellow-800",
  },
  {
    value: "to_delivery",
    label: "To Delivery",
    color: "bg-blue-200 text-blue-800",
  },
  {
    value: "delivering",
    label: "Delivering",
    color: "bg-purple-200 text-purple-800",
  },
  {
    value: "delivered",
    label: "Delivered",
    color: "bg-green-200 text-green-800",
  },
  { value: "cancelled", label: "Cancelled", color: "bg-red-200 text-red-800" },
];

const AdminPayments = () => {
  const [orders, setOrders] = useState([]);
  const [deliveryUsers, setDeliveryUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState({});
  const [lightboxUrl, setLightboxUrl] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accesstoken");
      const res = await axios.get(`${API_URL}/api/order/all`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setOrders(Array.isArray(res.data.orders) ? res.data.orders : []);
    } catch (err) {
      Swal.fire({ icon: "error", title: "Failed to fetch orders" });
    }
    setLoading(false);
  };

  const fetchDeliveryUsers = async () => {
    try {
      const token = localStorage.getItem("accesstoken");
      const res = await axios.get(`${API_URL}/api/users/deliveries`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setDeliveryUsers(res.data.deliveries || []);
    } catch (err) {
      // Optionally show error
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchDeliveryUsers();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    const token = localStorage.getItem("accesstoken");
    try {
      await axios.patch(
        `${API_URL}/api/order/${orderId}/status`,
        { status: newStatus },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      fetchOrders();
    } catch {
      Swal.fire({ icon: "error", title: "Failed to update status" });
    }
  };

  const handleAssignDelivery = async (orderId, deliveryUserId) => {
    setAssigning((prev) => ({ ...prev, [orderId]: true }));
    const token = localStorage.getItem("accesstoken");
    try {
      await axios.patch(
        `${API_URL}/api/order/${orderId}/assign-delivery`,
        { deliveryUserId },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      Swal.fire({ icon: "success", title: "Delivery assigned!" });
      fetchOrders();
    } catch {
      Swal.fire({ icon: "error", title: "Failed to assign delivery" });
    }
    setAssigning((prev) => ({ ...prev, [orderId]: false }));
  };

  const handleApproveSlip = async (orderId) => {
    const token = localStorage.getItem("accesstoken");
    try {
      await axios.patch(
        `${API_URL}/api/order/${orderId}/slip/approve`,
        {},
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      Swal.fire({
        icon: "success",
        title: "Slip approved. Order moved to delivery.",
      });
      fetchOrders();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Failed to approve slip" });
    }
  };

  const handleRejectSlip = async (orderId) => {
    const token = localStorage.getItem("accesstoken");
    try {
      await axios.patch(
        `${API_URL}/api/order/${orderId}/slip/reject`,
        {},
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      Swal.fire({
        icon: "success",
        title: "Slip rejected. Order set to pending payment.",
      });
      fetchOrders();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Failed to reject slip" });
    }
  };

  const exportOrdersAsPng = async () => {
    const table = document.getElementById("orders-table-section");
    if (!table) return;
    const colorProps = [
      'color',
      'backgroundColor',
      'borderColor',
      'outlineColor',
      'boxShadow',
    ];
    const nodesWithOverrides = [];
    function saveAndOverride(element) {
      const computedStyle = window.getComputedStyle(element);
      let changed = false;
      const original = {};
      for (const prop of colorProps) {
        let value = computedStyle[prop];
        if (prop === 'boxShadow' && value && value.includes('oklch')) {
          original.boxShadow = element.style.boxShadow;
          element.style.boxShadow = 'none';
          changed = true;
        } else if (value && value.includes('oklch')) {
          original[prop] = element.style[prop];
          if (prop === 'color' || prop === 'outlineColor' || prop === 'borderColor') {
            element.style[prop] = '#222';
          } else if (prop === 'backgroundColor') {
            element.style[prop] = '#fff';
          }
          changed = true;
        }
      }
      if (changed) nodesWithOverrides.push({ element, original });
      for (const child of element.children) {
        saveAndOverride(child);
      }
    }
    saveAndOverride(table);
    const canvas = await html2canvas(table, {
      useCORS: true,
      backgroundColor: "#fff",
      scale: 2,
    });
    nodesWithOverrides.forEach(({ element, original }) => {
      for (const prop in original) {
        element.style[prop] = original[prop];
      }
    });
    const link = document.createElement("a");
    link.download = `orders_report_${new Date().toLocaleDateString().replace(/\//g, "-")}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Admin Orders</h2>
        <button
          className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow transition-colors duration-200 text-base"
          onClick={exportOrdersAsPng}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625A2.625 2.625 0 0016.875 9h-9.75A2.625 2.625 0 004.5 11.625v2.625m15 0v2.625A2.625 2.625 0 0116.875 19.5h-9.75A2.625 2.625 0 014.5 16.875v-2.625m15 0H4.5" />
          </svg>
          Generate Report
        </button>
      </div>
      {loading ? (
        <div className="text-center text-lg text-gray-600">Loading...</div>
      ) : orders.length === 0 ? (
        <div className="text-center text-gray-500">No orders found.</div>
      ) : (
        <div id="orders-table-section" className="overflow-x-auto">
          <table className="min-w-full border rounded shadow text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-3 text-left">Order ID</th>
                <th className="border px-4 py-3 text-left">User</th>
                <th className="border px-4 py-3 text-left">Total Revenue</th>
                <th className="border px-4 py-3 text-left">Status</th>
                <th className="border px-4 py-3 text-left">Date</th>
                <th className="border px-4 py-3 text-left">Slip</th>
                <th className="border px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{order._id}</td>
                  <td className="border px-4 py-2">
                    {order.userId?.email || order.userId || "-"}
                  </td>
                  <td className="border px-4 py-2 font-semibold text-green-700">
                    {order.totalAmt || order.total || "-"}
                  </td>
                  <td className={`border px-4 py-2`}>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        STATUS_OPTIONS.find((s) => s.value === order.status)
                          ?.color || "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {STATUS_OPTIONS.find((s) => s.value === order.status)
                        ?.label || order.status}
                    </span>
                  </td>
                  <td className="border px-4 py-2">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="border px-4 py-2">
                    {order.paymentSlipUploaded ? (
                      order.paymentSlip ? (
                        /\.(jpg|jpeg|png|gif|webp)$/i.test(order.paymentSlip) ? (
                          <>
                            <img
                              src={`${backendUrl}${order.paymentSlip}`}
                              alt="Payment Slip"
                              className="h-20 w-32 object-cover border rounded shadow-sm cursor-pointer hover:opacity-80 transition"
                              onClick={() => setLightboxUrl(`${backendUrl}${order.paymentSlip}`)}
                            />
                            {lightboxUrl && (
                              <div
                                className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
                                onClick={() => setLightboxUrl(null)}
                              >
                                <img
                                  src={lightboxUrl}
                                  alt="Slip Preview"
                                  className="max-h-[90vh] max-w-[90vw] border-4 border-white rounded shadow-lg"
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <button
                                  className="absolute top-4 right-8 text-white text-3xl font-bold bg-black bg-opacity-50 rounded-full px-3 py-1 hover:bg-opacity-80"
                                  onClick={() => setLightboxUrl(null)}
                                >
                                  ×
                                </button>
                              </div>
                            )}
                          </>
                        ) : (
                          <a
                            href={`${backendUrl}${order.paymentSlip}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            View Slip
                          </a>
                        )
                      ) : (
                        <span className="text-green-600 font-medium">
                          Uploaded
                        </span>
                      )
                    ) : (
                      <span className="text-gray-500 italic">Not Uploaded</span>
                    )}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        className="inline-flex items-center px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium"
                        onClick={() => handleApproveSlip(order._id)}
                        type="button"
                      >
                        Approve
                      </button>
                      <button
                        className="inline-flex items-center px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium"
                        onClick={() => handleRejectSlip(order._id)}
                        type="button"
                      >
                        Reject
                      </button>
                    </div>
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

export default AdminPayments;
