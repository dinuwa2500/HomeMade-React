import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const PaymentSlip = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  // Only use orderId (order number) as param
  const orderId = params.get('orderId');
  const userInfo = useSelector((state) => state.user.userInfo) || JSON.parse(localStorage.getItem('userInfo')) || {};
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      Swal.fire({ icon: 'warning', title: 'Please select a payment slip image.' });
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('slip', file); // Use 'slip' as in Orders/index.jsx
      const token = userInfo.token || localStorage.getItem('accesstoken');
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/order/${orderId}/slip`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          withCredentials: true
        }
      );
      Swal.fire({ icon: 'success', title: 'Payment slip uploaded! Awaiting admin approval.' });
      setFile(null);
      setPreview(null);
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Upload failed', text: err.response?.data?.message || 'Try again.' });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow mt-10">
      <h2 className="text-xl font-bold mb-4">Upload Payment Slip</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="file" accept="image/*" onChange={handleFileChange} className="block w-full text-sm" />
        {preview && (
          <img src={preview} alt="Preview" className="w-40 h-40 object-contain mx-auto border rounded" />
        )}
        <button type="submit" disabled={loading} className="w-full py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">
          {loading ? 'Uploading...' : 'Submit Slip'}
        </button>
      </form>
    </div>
  );
};

export default PaymentSlip;
