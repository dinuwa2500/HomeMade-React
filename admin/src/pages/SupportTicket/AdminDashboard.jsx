import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FaDownload, FaTrash, FaSearch } from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import html2canvas from "html2canvas";

const DEFAULT_AVATAR =
  "https://ui-avatars.com/api/?name=User&background=cccccc&color=555555&size=128";

const AdminDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [replyData, setReplyData] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [solvedData, setSolvedData] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);

  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxImages, setLightboxImages] = useState([]);

  const reportRef = useRef();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem("accesstoken");
      const response = await axios.get(
        "http://localhost:8000/api/tickets/all",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTickets(response.data.tickets);

      const solvedByDay = {};
      response.data.tickets.forEach((ticket) => {
        if (ticket.replies.length > 0) {
          const day = new Date(ticket.updatedAt).toLocaleDateString();
          solvedByDay[day] = (solvedByDay[day] || 0) + 1;
        }
      });
      setSolvedData(
        Object.entries(solvedByDay)
          .sort((a, b) => new Date(a[0]) - new Date(b[0]))
          .map(([date, count]) => ({ date, count }))
      );

      const customerMap = {};
      response.data.tickets.forEach((ticket) => {
        const email = ticket.userId?.email || ticket.user?.email || "Unknown";
        if (!customerMap[email]) {
          customerMap[email] = {
            name: ticket.userId?.name || ticket.user?.name || "Unknown",
            profilePic: ticket.userId?.profilePic || ticket.user?.profilePic || DEFAULT_AVATAR,
            email,
            count: 0,
          };
        }
        customerMap[email].count += 1;
      });
      setTopCustomers(
        Object.values(customerMap)
          .sort((a, b) => b.count - a.count)
          .slice(0, 5)
      );
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to fetch tickets");
    }
  };

  const totalTickets = tickets.length;
  const solvedTickets = tickets.filter((t) => t.replies.length > 0).length;
  const pendingTickets = tickets.filter((t) => t.replies.length === 0).length;
  const todaySolved = tickets.filter(
    (t) =>
      t.replies.length > 0 &&
      new Date(t.updatedAt).toLocaleDateString() ===
        new Date().toLocaleDateString()
  ).length;

  const filteredTickets = tickets.filter((ticket) => {
    const name = ticket.userId?.name || ticket.user?.name || "";
    const email = ticket.userId?.email || ticket.user?.email || "";
    const searchMatch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase());
    let dateMatch = true;
    if (dateFrom) {
      dateMatch =
        dateMatch &&
        new Date(ticket.createdAt) >= new Date(dateFrom + "T00:00:00");
    }
    if (dateTo) {
      dateMatch =
        dateMatch &&
        new Date(ticket.createdAt) <= new Date(dateTo + "T23:59:59");
    }
    return searchMatch && dateMatch;
  });

  const ticketImages = filteredTickets
    .map((ticket) => ticket.image)
    .filter((img) => !!img);

  const downloadReport = async () => {
    if (!reportRef.current) return;

    const colorProps = [
      'color',
      'backgroundColor',
      'borderColor',
      'outlineColor',
      'boxShadow',
    ];

    const nodesWithOverrides = [];
    function saveAndOverride(element) {
      const computedStyle = window.getComputedStyle(element);
      let changed = false;
      const original = {};
      for (const prop of colorProps) {
        let value = computedStyle[prop];
        if (prop === 'boxShadow' && value && value.includes('oklch')) {
          original.boxShadow = element.style.boxShadow;
          element.style.boxShadow = 'none';
          changed = true;
        } else if (value && value.includes('oklch')) {
          original[prop] = element.style[prop];
          if (prop === 'color' || prop === 'outlineColor' || prop === 'borderColor') {
            element.style[prop] = '#222';
          } else if (prop === 'backgroundColor') {
            element.style[prop] = '#f3f4f6';
          }
          changed = true;
        }
      }
      if (changed) nodesWithOverrides.push({ element, original });
      for (const child of element.children) {
        saveAndOverride(child);
      }
    }
    saveAndOverride(reportRef.current);

    const canvas = await html2canvas(reportRef.current, {
      useCORS: true,
      backgroundColor: "#f3f4f6",
      scale: 2,
    });

    nodesWithOverrides.forEach(({ element, original }) => {
      for (const prop in original) {
        element.style[prop] = original[prop];
      }
    });

    const link = document.createElement("a");
    link.download = `ticket_report_${new Date()
      .toLocaleDateString()
      .replace(/\//g, "-")}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handleReplyChange = (ticketId, value) => {
    setReplyData((prev) => ({ ...prev, [ticketId]: value }));
  };

  const handleReplySubmit = async (ticketId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accesstoken");
      await axios.post(
        "http://localhost:8000/api/tickets/reply",
        { ticketId, reply: replyData[ticketId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Reply sent successfully");
      setReplyData((prev) => ({ ...prev, [ticketId]: "" }));
      fetchTickets();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to send reply");
    } finally {
      setLoading(false);
    }
  };

  const deleteTicket = async (ticketId) => {
    if (!window.confirm("Are you sure you want to delete this ticket?")) return;
    try {
      const token = localStorage.getItem("accesstoken");
      await axios.delete(
        `http://localhost:8000/api/tickets/delete/${ticketId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTickets(tickets.filter((ticket) => ticket._id !== ticketId));
      setMessage("Ticket deleted successfully");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to delete ticket");
    }
  };

  const openLightbox = (imgUrl) => {
    const idx = ticketImages.findIndex((img) => img === imgUrl);
    setLightboxImages(ticketImages);
    setLightboxIndex(idx);
    setIsLightboxOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-6">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-blue-900">
            Support Tickets Admin Dashboard
          </h1>
        </div>
        <button
          onClick={downloadReport}
          className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition"
        >
          <FaDownload className="mr-2" />
          Download Today's Report (PNG)
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <div className="flex items-center bg-white rounded-lg shadow px-4 py-2 w-full md:w-1/3">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search by name or email"
            className="outline-none w-full bg-transparent"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-gray-700 font-medium">From:</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="p-2 border rounded"
            max={dateTo || ""}
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-gray-700 font-medium">To:</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="p-2 border rounded"
            min={dateFrom || ""}
          />
        </div>
        {(dateFrom || dateTo) && (
          <button
            onClick={() => {
              setDateFrom("");
              setDateTo("");
            }}
            className="ml-2 text-blue-600 underline"
          >
            Clear Dates
          </button>
        )}
      </div>

      <div
        ref={reportRef}
        className="bg-white rounded-xl shadow p-6 mb-8 border border-blue-200"
      >
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-blue-800">
              Support Report
            </span>
          </div>
          <span className="text-gray-500 text-sm">
            {new Date().toLocaleDateString()} |{" "}
            {new Date().toLocaleTimeString()}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-50 rounded-xl shadow p-6 flex flex-col items-center border border-blue-100">
            <span className="text-2xl font-bold text-blue-700">
              {totalTickets}
            </span>
            <span className="text-gray-500 mt-1">Total Tickets</span>
          </div>
          <div className="bg-green-50 rounded-xl shadow p-6 flex flex-col items-center border border-green-100">
            <span className="text-2xl font-bold text-green-600">
              {solvedTickets}
            </span>
            <span className="text-gray-500 mt-1">Solved Tickets</span>
          </div>
          <div className="bg-red-50 rounded-xl shadow p-6 flex flex-col items-center border border-red-100">
            <span className="text-2xl font-bold text-red-500">
              {pendingTickets}
            </span>
            <span className="text-gray-500 mt-1">Pending Tickets</span>
          </div>
          <div className="bg-purple-50 rounded-xl shadow p-6 flex flex-col items-center border border-purple-100">
            <span className="text-2xl font-bold text-purple-600">
              {todaySolved}
            </span>
            <span className="text-gray-500 mt-1">Solved Today</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow p-6 col-span-2 border border-blue-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Solved Tickets Over Time
              </h2>
              <span className="text-gray-400 text-sm">Last 30 days</span>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={solvedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-xl shadow p-6 border border-blue-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Top Customers
            </h2>
            <ul>
              {topCustomers.map((c, i) => (
                <li key={i} className="flex items-center mb-4">
                  <img
                    src={c.profilePic}
                    alt={c.name}
                    className="w-10 h-10 rounded-full border-2 border-blue-400 object-cover mr-3"
                  />
                  <div className="flex-1">
                    <span className="font-semibold text-gray-700">
                      {c.name}
                    </span>
                    <span className="block text-xs text-gray-400">
                      {c.email}
                    </span>
                  </div>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                    {c.count} Tickets
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6 border border-blue-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Recent Tickets</h2>
            <span className="text-gray-400 text-sm">
              Showing {Math.min(10, filteredTickets.length)} of{" "}
              {filteredTickets.length}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-3 text-left">User</th>
                  <th className="py-2 px-3 text-left">Product</th>
                  <th className="py-2 px-3 text-left">Subject</th>
                  <th className="py-2 px-3 text-left">Inquiry</th>
                  <th className="py-2 px-3 text-left">Image</th>
                  <th className="py-2 px-3 text-left">Status</th>
                  <th className="py-2 px-3 text-left">Reply</th>
                  <th className="py-2 px-3 text-left">Delete</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.slice(0, 10).map((ticket) => (
                  <tr key={ticket._id} className="border-b">
                    <td className="py-2 px-3 flex items-center">
                      <img
                        src={
                          ticket.userId?.profilePic
                            ? ticket.userId.profilePic
                            : ticket.user?.profilePic
                            ? ticket.user.profilePic
                            : DEFAULT_AVATAR
                        }
                        alt="Profile"
                        className="w-8 h-8 rounded-full mr-2 border-2 border-blue-400 object-cover"
                      />
                      <span>
                        {ticket.userId?.name || ticket.user?.name || "Unknown"}
                        <br />
                        <span className="text-xs text-gray-400">
                          {ticket.userId?.email || ticket.user?.email || "No Email"}
                        </span>
                      </span>
                    </td>
                    <td className="py-2 px-3">{ticket.product}</td>
                    <td className="py-2 px-3">{ticket.subject}</td>
                    <td className="py-2 px-3">{ticket.inquiry}</td>
                    <td className="py-2 px-3">
                      {ticket.image ? (
                        <img
                          src={
                            ticket.image.match(/^\/?uploads\//)
                              ? `http://localhost:8000/${ticket.image.replace(
                                  /^\/+/,
                                  ""
                                )}`
                              : `http://localhost:8000/uploads/${ticket.image}`
                          }
                          alt="Ticket"
                          className="w-14 h-14 rounded-lg object-cover border-2 border-blue-200 cursor-pointer hover:scale-105 transition"
                          onClick={() => openLightbox(ticket.image)}
                        />
                      ) : (
                        <span className="text-gray-400">No Image</span>
                      )}
                    </td>
                    <td className="py-2 px-3">
                      {ticket.replies.length > 0 ? (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                          Solved
                        </span>
                      ) : (
                        <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-semibold">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3">
                      <div className="flex flex-col">
                        <textarea
                          className="w-full p-1 border rounded mb-1"
                          rows="1"
                          placeholder="Reply..."
                          value={replyData[ticket._id] || ""}
                          onChange={(e) =>
                            handleReplyChange(ticket._id, e.target.value)
                          }
                        />
                        <button
                          className="bg-black text-white px-2 py-1 rounded hover:bg-blue-700 text-xs"
                          onClick={() => handleReplySubmit(ticket._id)}
                          disabled={loading || !replyData[ticket._id]}
                        >
                          {loading ? "Sending..." : "Send"}
                        </button>
                      </div>
                    </td>
                    <td className="py-2 px-3">
                      <FaTrash
                        className="text-red-600 cursor-pointer hover:text-red-800"
                        size={16}
                        title="Delete Ticket"
                        onClick={() => deleteTicket(ticket._id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {message && (
            <p className="text-center text-red-500 mt-4">{message}</p>
          )}
        </div>

        <div className="border-t pt-4 mt-8 flex justify-between items-center text-xs text-gray-400">
          <span>
            &copy; {new Date().getFullYear()} Ticket Support System. All rights
            reserved.
          </span>
          <span>Generated by Admin Dashboard</span>
        </div>
      </div>

      {isLightboxOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setIsLightboxOpen(false)}
        >
          <img
            src={
              lightboxImages[lightboxIndex]?.match(/^https?:\/\//)
                ? lightboxImages[lightboxIndex]
                : `http://localhost:8000/${lightboxImages[lightboxIndex].replace(
                    /^\/+/, ""
                  )}`
            }
            alt="Large Preview"
            style={{
              maxWidth: "90vw",
              maxHeight: "90vh",
              borderRadius: "8px",
              boxShadow: "0 4px 32px rgba(0,0,0,0.5)",
            }}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            style={{
              position: "absolute",
              top: 30,
              right: 40,
              background: "white",
              border: "none",
              borderRadius: "50%",
              width: 36,
              height: 36,
              fontSize: 18,
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            }}
            onClick={() => setIsLightboxOpen(false)}
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
