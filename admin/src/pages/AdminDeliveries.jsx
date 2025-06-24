import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const API_URL = import.meta.env.VITE_BACKEND_URI || "http://localhost:8000";

const AdminDeliveries = () => {
  const [orders, setOrders] = useState([]);
  const [deliveryUsers, setDeliveryUsers] = useState([]);
  const [selectedDeliveryUser, setSelectedDeliveryUser] = useState("");
  const [loading, setLoading] = useState(true);

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
  
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchDeliveryUsers();
  }, []);

  const filteredOrders = selectedDeliveryUser
    ? orders.filter(order => order.delivery === selectedDeliveryUser)
    : orders.filter(order => order.delivery);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Delivery Assignments</h2>
      <div className="mb-4 flex items-center gap-2">
        <label htmlFor="deliveryUser" className="font-medium">Filter by Delivery User:</label>
        <select
          id="deliveryUser"
          className="border rounded px-2 py-1"
          value={selectedDeliveryUser}
          onChange={e => setSelectedDeliveryUser(e.target.value)}
        >
          <option value="">All Delivery Users</option>
          {deliveryUsers.map(user => (
            <option key={user._id} value={user._id}>
              {user.name || user.email}
            </option>
          ))}
        </select>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : filteredOrders.length === 0 ? (
        <div>No delivery assignments found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border rounded-lg overflow-hidden shadow">
            <thead>
              <tr className="bg-blue-50">
                <th className="border px-4 py-2">Order ID</th>
                <th className="border px-4 py-2">Customer</th>
                <th className="border px-4 py-2">Assigned Delivery</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Total</th>
                <th className="border px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order._id} className="hover:bg-blue-100 transition-colors">
                  <td className="border px-4 py-2 font-mono text-xs">{order._id}</td>
                  <td className="border px-4 py-2">{order.userId?.email || order.userId || '-'}</td>
                  <td className="border px-4 py-2 text-blue-700 font-semibold">
                    {deliveryUsers.find(u => u._id === order.delivery)?.name || deliveryUsers.find(u => u._id === order.delivery)?.email || 'Assigned'}
                  </td>
                  <td className="border px-4 py-2 capitalize">
                    <span className={`px-2 py-1 rounded text-xs ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : order.status === 'delivering' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>{order.status}</span>
                  </td>
                  <td className="border px-4 py-2">{order.totalAmt || order.total || '-'}</td>
                  <td className="border px-4 py-2">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDeliveries;
