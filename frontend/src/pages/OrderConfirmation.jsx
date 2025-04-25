import React from "react";
import { Link, useLocation } from "react-router-dom";

const OrderConfirmation = () => {
  const location = useLocation();
  const { orderId } = location.state || {};

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-green-700">Order Placed Successfully!</h2>
        <p className="mb-2 text-gray-700">Thank you for your purchase.</p>
        {orderId && (
          <p className="mb-4 text-gray-500 text-sm">Order ID: <span className="font-semibold">{orderId}</span></p>
        )}
        <p className="mb-6 text-gray-600">To complete your order, please upload your payment slip for admin approval.</p>
        {orderId ? (
          <Link
            to={`/payment-slip?orderId=${orderId}`}
            className="block w-full py-2 bg-red-600 text-white rounded hover:bg-red-700 text-center transition mb-2"
          >
            Upload Payment Slip
          </Link>
        ) : null}
        <Link
          to="/"
          className="block w-full py-2 border border-gray-300 rounded text-center hover:bg-gray-100 transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
