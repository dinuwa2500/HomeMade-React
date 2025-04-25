import React from "react";

const statusMap = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  to_delivery: "bg-blue-100 text-blue-800 border-blue-300",
  delivering: "bg-indigo-100 text-indigo-800 border-indigo-300",
  delivered: "bg-green-100 text-green-800 border-green-300",
  cancelled: "bg-red-100 text-red-800 border-red-300",
};

const labelMap = {
  pending: "Pending",
  to_delivery: "To Delivery",
  delivering: "Delivering",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const OrderStatusBadge = ({ status }) => {
  const style = statusMap[status] || "bg-gray-100 text-gray-600 border-gray-300";
  const label = labelMap[status] || status;
  return (
    <span
      className={`inline-block px-3 py-1 rounded-full border text-xs font-semibold ${style}`}
    >
      {label}
    </span>
  );
};

export default OrderStatusBadge;
