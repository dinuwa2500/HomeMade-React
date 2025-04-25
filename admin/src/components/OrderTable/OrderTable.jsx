import React from "react";
import OrderRow from "./OrderRow";

const OrderTable = ({ orders, onView }) => (
  <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow">
    <table className="min-w-full text-sm text-left">
      <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
        <tr>
          <th className="px-4 py-3">Order ID</th>
          <th className="px-4 py-3">Customer</th>
          <th className="px-4 py-3">Total</th>
          <th className="px-4 py-3">Payment</th>
          <th className="px-4 py-3">Status</th>
          <th className="px-4 py-3">Date</th>
          <th className="px-4 py-3">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {orders.map(order => (
          <OrderRow order={order} key={order._id} onView={onView} />
        ))}
      </tbody>
    </table>
  </div>
);

export default OrderTable;
