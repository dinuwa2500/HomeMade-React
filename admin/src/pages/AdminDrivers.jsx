import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export default function AdminDrivers() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState("");
  const [assigning, setAssigning] = useState(false);

  // Orders for dropdown
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchDrivers = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("accesstoken");
        const res = await axios.get(`${API_URL}/api/users?role=driver`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setDrivers(res.data.users || []);
      } catch (err) {
        setError("Failed to fetch drivers from database.");
        setDrivers([]);
        toast.error("Failed to fetch drivers from database.");
      }
      setLoading(false);
    };
    fetchDrivers();
  }, []);

  // Fetch available orders on mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("accesstoken");
        const res = await axios.get(`${API_URL}/api/order/all`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        // Only include orders that are not delivered/cancelled
        setOrders((res.data.orders || []).filter(o => !["delivered", "cancelled"].includes(o.status)));
      } catch (err) {
        // Optionally show error toast
      }
    };
    fetchOrders();
  }, []);

  const handleAssignDriver = async (driverId) => {
    if (!orderId) {
      toast.error("Please select an order.");
      return;
    }
    setAssigning(true);
    try {
      const token = localStorage.getItem("accesstoken");
      await axios.patch(
        `${API_URL}/api/order/order/${orderId}/assign-delivery`,
        { deliveryUserId: driverId },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      toast.success("Driver assigned to order successfully!");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to assign driver to order."
      );
    }
    setAssigning(false);
  };

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Delivery Drivers</h2>
      </div>

      <div className="mb-8 bg-white rounded-lg shadow p-6 flex flex-col md:flex-row items-center gap-4">
        <select
          className="border rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-200 w-full md:w-64"
          value={orderId}
          onChange={e => setOrderId(e.target.value)}
        >
          <option value="">Select an Order...</option>
          {orders.map(order => (
            <option key={order._id} value={order._id}>
              {order._id} - {order.userId?.email || order.customerName || "No customer"} | Rs.{order.totalAmt || order.total || 0} | {order.status}
            </option>
          ))}
        </select>
        <span className="text-gray-500 text-sm">Select a driver below to assign</span>
      </div>

      <div className="overflow-x-auto rounded-lg shadow bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assign</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-gray-400 text-lg font-semibold">Loading...</td>
              </tr>
            ) : drivers.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-gray-400 text-lg font-semibold">No drivers found.</td>
              </tr>
            ) : (
              drivers.map((driver) => (
                <tr key={driver._id} className="hover:bg-blue-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-base text-gray-800 font-medium">{driver.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-base text-blue-700">{driver.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700">{driver.mobile || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                      {driver.status || 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow disabled:opacity-50"
                      disabled={assigning || !orderId}
                      onClick={() => handleAssignDriver(driver._id)}
                    >
                      {assigning ? 'Assigning...' : 'Assign'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {error && <div className="mt-4 text-red-600 text-sm font-medium">{error}</div>}
    </div>
  );
}
