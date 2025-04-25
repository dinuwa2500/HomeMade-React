import React from "react";
import OrderStatusBadge from "./OrderStatusBadge";
import { useNavigate } from "react-router-dom";

const OrderRow = ({ order, onView }) => {
  const navigate = useNavigate();
  return (
    <tr className="hover:bg-gray-50 transition cursor-pointer" onClick={() => navigate(`/orders/${order._id}`)}>
      <td className="px-4 py-3 whitespace-nowrap font-mono text-xs text-gray-700">{order._id}</td>
      <td className="px-4 py-3 whitespace-nowrap">{order.customerName || order.user?.firstName || order.user?.name || "-"}</td>
      <td className="px-4 py-3 whitespace-nowrap">Rs.{order.totalAmt || order.total || 0}</td>
      <td className="px-4 py-3 whitespace-nowrap capitalize">{order.paymentStatus || "-"}</td>
      <td className="px-4 py-3 whitespace-nowrap"><OrderStatusBadge status={order.status} /></td>
      <td className="px-4 py-3 whitespace-nowrap">{new Date(order.createdAt).toLocaleString()}</td>
      <td className="px-4 py-3 whitespace-nowrap">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-semibold"
          onClick={e => { e.stopPropagation(); navigate(`/orders/${order._id}`); }}
        >
          View
        </button>
      </td>
    </tr>
  );
};

export default OrderRow;
