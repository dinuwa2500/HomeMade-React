import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaSearch, FaEye } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { IoMdCheckmarkCircle, IoMdCloseCircle } from "react-icons/io";
import ReviewStatusBadge from "../components/ReviewTable/ReviewStatusBadge";
import ReviewTable from "../components/ReviewTable/ReviewTable";
import ReviewModal from "../components/ReviewTable/ReviewModal";

const API_URL = import.meta.env.VITE_BACKEND_URI || "http://localhost:8000";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalReview, setModalReview] = useState(null);
  const REVIEWS_PER_PAGE = 10;

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("accesstoken");
        const res = await axios.get(`${API_URL}/api/admin/reviews`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setReviews(res.data.reviews || []);
      } catch (err) {
        setError("Failed to fetch reviews from database.");
        setReviews([]);
        toast.error("Failed to fetch reviews from database.");
      }
      setLoading(false);
    };
    fetchReviews();
  }, []);

  // Filtering
  const filteredReviews = reviews.filter(
    (r) =>
      (r.customerName || r.name || r.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (r.productName || "").toLowerCase().includes(search.toLowerCase())
  );

  // Sorting
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortBy === "date") {
      return sortDir === "desc"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt);
    }
    if (sortBy === "rating") {
      return sortDir === "desc" ? b.rating - a.rating : a.rating - b.rating;
    }
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedReviews.length / REVIEWS_PER_PAGE);
  const paginatedReviews = sortedReviews.slice(
    (currentPage - 1) * REVIEWS_PER_PAGE,
    currentPage * REVIEWS_PER_PAGE
  );

  // Actions
  const handleStatus = async (id, newStatus) => {
    const prev = [...reviews];
    setReviews((revs) =>
      revs.map((r) => (r._id === id ? { ...r, status: newStatus } : r))
    );
    try {
      const token = localStorage.getItem("accesstoken");
      await axios.patch(
        `${API_URL}/api/admin/reviews/${id}/status`,
        { status: newStatus },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      toast.success(`Review ${newStatus}`);
    } catch (err) {
      setReviews(prev);
      toast.error("Failed to update review status");
    }
  };

  const handleDelete = async (id) => {
    const prev = [...reviews];
    setReviews((revs) => revs.filter((r) => r._id !== id));
    try {
      const token = localStorage.getItem("accesstoken");
      await axios.delete(`${API_URL}/api/admin/reviews/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      toast.success("Review deleted");
    } catch (err) {
      setReviews(prev);
      toast.error("Failed to delete review");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Product Reviews</h1>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search by customer or product..."
            className="w-full border border-gray-300 rounded px-4 py-2 pl-10 focus:outline-none focus:ring"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
        <div className="flex gap-2 mt-2 md:mt-0">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="date">Sort by Date</option>
            <option value="rating">Sort by Rating</option>
          </select>
          <button
            className="border rounded px-2 py-1"
            onClick={() => setSortDir((d) => (d === "desc" ? "asc" : "desc"))}
          >
            {sortDir === "desc" ? "↓" : "↑"}
          </button>
        </div>
      </div>
      <ReviewTable
        reviews={paginatedReviews}
        loading={loading}
        onStatus={handleStatus}
        onDelete={handleDelete}
        onView={setModalReview}
      />
      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-4">
        <button
          className="px-3 py-1 rounded border disabled:opacity-50"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span className="px-2">Page {currentPage} of {totalPages}</span>
        <button
          className="px-3 py-1 rounded border disabled:opacity-50"
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
      {/* Modal for review details */}
      {modalReview && (
        <ReviewModal
          review={modalReview}
          onClose={() => setModalReview(null)}
        />
      )}
    </div>
  );
};

export default AdminReviews;
