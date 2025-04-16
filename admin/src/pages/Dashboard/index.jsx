import React from 'react';
import DashboardBoxes from '../../components/DashboardBoxes';

const Dashboard = () => {
  return (
    <>
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

          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-5 rounded-lg flex items-center transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add Product
          </button>
        </div>
      </div>
      <DashboardBoxes />
    </>
  );
};

export default Dashboard;
