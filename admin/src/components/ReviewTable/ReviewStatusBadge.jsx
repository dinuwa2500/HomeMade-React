import React from "react";

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  unknown: "bg-gray-100 text-gray-500",
};

const ReviewStatusBadge = ({ status }) => {
  const safeStatus = status || "unknown";
  return (
    <span
      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
        statusStyles[safeStatus] || statusStyles.unknown
      }`}
    >
      {safeStatus.charAt(0).toUpperCase() + safeStatus.slice(1)}
    </span>
  );
};

export default ReviewStatusBadge;
