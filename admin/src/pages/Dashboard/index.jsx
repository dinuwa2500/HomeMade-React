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
        // Try another likely endpoint for all users
        const usersRes = await axios.get(`${API_URL}/api/users/all`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        // Try to find the array in the response
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

  // Calculations
  const totalUsers = users.length;
  const totalSales = orders.length;
  const totalRevenue = orders.reduce(
    (sum, o) => sum + (o.totalAmt || o.total || 0),
    0
  );

  // Chart data: sales per month (real world usage)
  // Get last 12 months labels
  function getLast12MonthsLabels() {
    const labels = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleString('default', { month: 'short', year: 'numeric' });
      labels.push(label);
    }
    return labels;
  }
  const chartLabels = getLast12MonthsLabels();
  // Map revenue to each month
  const revenueByMonth = {};
  orders.forEach((order) => {
    const date = order.createdAt ? new Date(order.createdAt) : null;
    if (!date) return;
    const label = date.toLocaleString('default', { month: 'short', year: 'numeric' });
    revenueByMonth[label] = (revenueByMonth[label] || 0) + (order.totalAmt || order.total || 0);
  });
  const chartData = chartLabels.map((label) => revenueByMonth[label] || 0);

  return (
    <div>
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-light text-gray-500">Good Morning</h1>
            <h2 className="text-3xl font-bold text-gray-800 mt-1">Cameron</h2>
            <p className="text-gray-500 mt-2 max-w-md">
              Here's what's happening on your store today. See the statistics at
              once.
            </p>
          </div>

          
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
