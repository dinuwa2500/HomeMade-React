import React from "react";

const ReviewModal = ({ review, onClose }) => {
  if (!review) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-2">Review Details</h2>
        <div className="mb-2"><span className="font-semibold">Review ID:</span> {review._id}</div>
        <div className="mb-2"><span className="font-semibold">Product:</span> {review.productName}</div>
        <div className="mb-2"><span className="font-semibold">Customer:</span> {review.customerName}</div>
        <div className="mb-2"><span className="font-semibold">Rating:</span> {review.rating} / 5</div>
        <div className="mb-2"><span className="font-semibold">Status:</span> {review.status}</div>
        <div className="mb-2"><span className="font-semibold">Date:</span> {new Date(review.createdAt).toLocaleString()}</div>
        <div className="mb-2"><span className="font-semibold">Comment:</span></div>
        <div className="bg-gray-50 p-2 rounded border text-sm whitespace-pre-line">{review.comment}</div>
      </div>
    </div>
  );
};

export default ReviewModal;
