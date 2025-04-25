import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/payment/all`, { withCredentials: true });
        setPayments(res.data.payments);
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Failed to fetch payments' });
      }
      setLoading(false);
    };
    fetchPayments();
  }, []);

  const handleAction = async (id, status) => {
    const { value: adminNote } = await Swal.fire({
      title: status === 'approved' ? 'Approve Payment' : 'Reject Payment',
      input: 'text',
      inputLabel: 'Admin Note (optional)',
      showCancelButton: true,
      confirmButtonText: status === 'approved' ? 'Approve' : 'Reject',
      confirmButtonColor: status === 'approved' ? '#16a34a' : '#ca0815',
      cancelButtonColor: '#888',
    });
    if (adminNote !== undefined) {
      try {
        await axios.patch(`${import.meta.env.VITE_BACKEND_URI}/api/payment/${id}`, { status, adminNote }, { withCredentials: true });
        setPayments(payments.map((p) => (p._id === id ? { ...p, status, adminNote } : p)));
        Swal.fire({ icon: 'success', title: `Payment ${status}` });
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Update failed' });
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 mt-8">
      <h2 className="text-2xl font-bold mb-6">Payment Slips</h2>
      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : payments.length === 0 ? (
        <div className="text-center text-gray-500">No payment slips found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg shadow">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="py-2 px-4">User</th>
                <th className="py-2 px-4">Order ID</th>
                <th className="py-2 px-4">Slip</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Admin Note</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p._id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{p.userId?.email}</td>
                  <td className="py-2 px-4">{p.orderId}</td>
                  <td className="py-2 px-4">
                    <a href={p.slipUrl} target="_blank" rel="noopener noreferrer">
                      <img src={p.slipUrl} alt="Slip" className="w-20 h-20 object-contain border rounded" />
                    </a>
                  </td>
                  <td className="py-2 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${p.status === 'approved' ? 'bg-green-100 text-green-700' : p.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{p.status}</span>
                  </td>
                  <td className="py-2 px-4 text-xs">{p.adminNote}</td>
                  <td className="py-2 px-4 space-x-2">
                    {p.status === 'pending' && (
                      <>
                        <button onClick={() => handleAction(p._id, 'approved')} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition">Approve</button>
                        <button onClick={() => handleAction(p._id, 'rejected')} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition">Reject</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPayments;
