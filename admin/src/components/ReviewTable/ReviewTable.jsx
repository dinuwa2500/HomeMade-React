import React from "react";
import ReviewStatusBadge from "./ReviewStatusBadge";
import { FaEye } from "react-icons/fa";
import { IoMdCheckmarkCircle, IoMdCloseCircle } from "react-icons/io";
import { MdDelete } from "react-icons/md";

const ReviewTable = ({ reviews, loading, onStatus, onDelete, onView }) => {
  if (loading)
    return (
      <div className="flex justify-center items-center h-32 text-gray-400 animate-pulse">
        Loading reviews...
      </div>
    );
  if (!reviews.length)
    return (
      <div className="text-center text-gray-400 py-12">No reviews found.</div>
    );

  return (
    <div className="overflow-x-auto rounded shadow">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-100 text-gray-700 text-sm">
            <th className="py-2 px-4 text-left">Review ID</th>
            <th className="py-2 px-4 text-left">Product</th>
            <th className="py-2 px-4 text-left">Customer</th>
            <th className="py-2 px-4 text-left">Rating</th>
            <th className="py-2 px-4 text-left">Comment</th>
            <th className="py-2 px-4 text-left">Status</th>
            <th className="py-2 px-4 text-left">Date</th>
            <th className="py-2 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((r) => (
            <tr key={r._id} className="border-b hover:bg-gray-50">
              <td className="py-2 px-4 font-mono text-xs">{r._id}</td>
              <td className="py-2 px-4">{r.productName || "-"}</td>
              <td className="py-2 px-4">{r.customerName || r.name || r.email || "-"}</td>
              <td className="py-2 px-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < r.rating ? "text-yellow-400" : "text-gray-200"}>
                    ★
                  </span>
                ))}
              </td>
              <td className="py-2 px-4 truncate max-w-xs">
                {r.comment.length > 40 ? (
                  <>
                    {r.comment.slice(0, 40)}... <button className="text-blue-500 underline text-xs" onClick={() => onView(r)}>View</button>
                  </>
                ) : (
                  r.comment
                )}
              </td>
              <td className="py-2 px-4">
                <ReviewStatusBadge status={r.status} />
              </td>
              <td className="py-2 px-4 text-xs">{new Date(r.createdAt).toLocaleDateString()}</td>
              <td className="py-2 px-4 flex gap-2">
                <button
                  title="Approve"
                  onClick={() => onStatus(r._id, "approved")}
                  className="p-1 rounded bg-green-100 text-green-700 hover:bg-green-200"
                  disabled={r.status === "approved"}
                >
                  <IoMdCheckmarkCircle size={18} />
                </button>
                <button
                  title="Reject"
                  onClick={() => onStatus(r._id, "rejected")}
                  className="p-1 rounded bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                  disabled={r.status === "rejected"}
                >
                  <IoMdCloseCircle size={18} />
                </button>
                <button
                  title="Delete"
                  onClick={() => onDelete(r._id)}
                  className="p-1 rounded bg-red-100 text-red-700 hover:bg-red-200"
                >
                  <MdDelete size={18} />
                </button>
                <button
                  title="View"
                  onClick={() => onView(r)}
                  className="p-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
                >
                  <FaEye size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReviewTable;
