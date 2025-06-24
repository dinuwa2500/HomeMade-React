import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
import DashboardBoxes from "../../components/DashboardBoxes";

const API_URL = import.meta.env.VITE_BACKEND_URI || "http://localhost:8000";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("accesstoken");
        const usersRes = await axios.get(`${API_URL}/api/users/all`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        let usersArr = [];
        if (Array.isArray(usersRes.data.users)) usersArr = usersRes.data.users;
        else if (Array.isArray(usersRes.data)) usersArr = usersRes.data;
        else if (Array.isArray(usersRes.data.result))
          usersArr = usersRes.data.result;
        setUsers(usersArr);

        const ordersRes = await axios.get(`${API_URL}/api/order/all`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        let ordersArr = [];
        if (Array.isArray(ordersRes.data.orders))
          ordersArr = ordersRes.data.orders;
        else if (Array.isArray(ordersRes.data)) ordersArr = ordersRes.data;
        else if (Array.isArray(ordersRes.data.result))
          ordersArr = ordersRes.data.result;
        setOrders(ordersArr);
      } catch (err) {
        setUsers([]);
        setOrders([]);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const totalUsers = users.length;
  const totalSales = orders.length;
  const totalRevenue = orders.reduce(
    (sum, o) => sum + (o.totalAmt || o.total || 0),
    0
  );

  function getLast12MonthsLabels() {
    const labels = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      labels.push(label);
    }
    return labels;
  }
  const chartLabels = getLast12MonthsLabels();
  const revenueByMonth = {};
  orders.forEach((order) => {
    const date = order.createdAt ? new Date(order.createdAt) : null;
    if (!date) return;
    const label = date.toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    revenueByMonth[label] =
      (revenueByMonth[label] || 0) + (order.totalAmt || order.total || 0);
  });
  const chartData = chartLabels.map((label) => revenueByMonth[label] || 0);

  const handleGeneratePDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });
    let y = 40;
    doc.setFillColor(202, 8, 21);
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), 60, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(26);
    doc.text(
      "Admin Dashboard Report",
      doc.internal.pageSize.getWidth() / 2,
      38,
      { align: "center" }
    );
    doc.setFontSize(12);
    doc.text(
      `Date: ${new Date().toLocaleDateString()}`,
      doc.internal.pageSize.getWidth() - 40,
      55,
      { align: "right" }
    );
    y = 75;
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(40, y, 160, 60, 8, 8, "F");
    doc.roundedRect(220, y, 160, 60, 8, 8, "F");
    doc.roundedRect(400, y, 160, 60, 8, 8, "F");
    doc.setFontSize(18);
    doc.setTextColor(202, 8, 21);
    doc.text("Users", 120, y + 22, { align: "center" });
    doc.text("Sales", 300, y + 22, { align: "center" });
    doc.text("Revenue", 480, y + 22, { align: "center" });
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text(`${totalUsers}`, 120, y + 48, { align: "center" });
    doc.text(`${totalSales}`, 300, y + 48, { align: "center" });
    doc.text(`Rs ${totalRevenue.toLocaleString()}`, 480, y + 48, {
      align: "center",
    });
    y += 90;
    doc.setFontSize(14);
    doc.setTextColor(202, 8, 21);
    doc.text("Monthly Revenue (Last 12 Months)", 40, y);
    y += 10;
    autoTable(doc, {
      head: [["Month", "Revenue (Rs)"]],
      body: chartLabels.map((m) => [m, revenueByMonth[m] || 0]),
      startY: y,
      theme: "grid",
      headStyles: {
        fillColor: [202, 8, 21],
        textColor: 255,
        fontStyle: "bold",
      },
      styles: { fontSize: 11, cellPadding: 6 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 40, right: 40 },
    });
    y = doc.lastAutoTable.finalY + 20;
    if (orders.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(202, 8, 21);
      doc.text("Recent Orders (Top 10)", 40, y);
      y += 10;
      autoTable(doc, {
        head: [["#", "Order ID", "User", "Amount", "Status", "Date"]],
        body: orders
          .slice(0, 10)
          .map((o, i) => [
            i + 1,
            o._id || "-",
            o.user?.name || o.userName || "-",
            o.totalAmt || o.total || 0,
            o.status || "-",
            o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "-",
          ]),
        startY: y,
        theme: "striped",
        headStyles: {
          fillColor: [202, 8, 21],
          textColor: 255,
          fontStyle: "bold",
        },
        styles: { fontSize: 11, cellPadding: 6 },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { left: 40, right: 40 },
      });
    }
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFontSize(10);
    doc.setTextColor(180, 180, 180);
    doc.text(
      "Generated by HomeMade Admin Dashboard",
      doc.internal.pageSize.getWidth() / 2,
      pageHeight - 18,
      { align: "center" }
    );
    doc.save("dashboard_report.pdf");
  };

  return (
    <div>
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-light text-gray-500">Good Morning</h1>
            <h2 className="text-3xl font-bold text-gray-800 mt-1">
              Admin
            </h2>
            <p className="text-gray-500 mt-2 max-w-md">
              Here's what's happening on your store today. See the statistics at
              once.
            </p>
          </div>
          <button
            style={{ position: "relative", top: 20, right: 30, zIndex: 10 }}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded shadow"
            onClick={handleGeneratePDF}
          >
            Generate PDF Report
          </button>
        </div>
      </div>
      <DashboardBoxes
        totalUsers={totalUsers}
        totalSales={totalSales}
        totalRevenue={totalRevenue}
      />

      <div className="mt-12">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">
          Monthly Revenue
        </h3>
        <Bar
          data={{
            labels: chartLabels,
            datasets: [
              {
                label: "Revenue (Rs.)",
                data: chartData,
                backgroundColor: "#2563eb",
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: { display: false },
              title: {
                display: false,
              },
            },
            scales: {
              x: { title: { display: true, text: "Month" } },
              y: { title: { display: true, text: "Revenue (Rs.)" } },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Dashboard;
