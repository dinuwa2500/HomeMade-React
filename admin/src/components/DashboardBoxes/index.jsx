import React from 'react';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { FaMoneyBillWave, FaRegChartBar } from 'react-icons/fa';

const DashboardBoxes = () => {
  const data = [
    {
      title: 'New Orders',
      value: '1,390',
      icon: <AiOutlineShoppingCart className="text-3xl text-blue-500 cursor-pointer" />,
      bg: 'bg-blue-100',
      hoverBg: 'hover:bg-blue-200',
    },
    {
      title: 'Sales',
      value: 'Rs. 1,390',
      icon: <FaMoneyBillWave className="text-3xl text-green-500 " />,
      bg: 'bg-green-100',
      hoverBg: 'hover:bg-green-200',
    },
    {
      title: 'Revenue',
      value: 'Rs. 12,000',
      icon: <FaRegChartBar className="text-3xl text-purple-500" />,
      bg: 'bg-purple-100',
      hoverBg: 'hover:bg-purple-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 cursor-pointer">
      {data.map((item, index) => (
        <div
          key={index}
          className={`p-5 rounded-xl shadow-md flex items-center gap-4 transition-all duration-300 transform ${item.bg} ${item.hoverBg} hover:-translate-y-1 hover:shadow-lg`}
        >
          <div className="icon">{item.icon}</div>
          <div className="info">
            <p className="text-sm font-medium text-gray-600">{item.title}</p>
            <h3 className="text-xl font-bold text-gray-800">{item.value}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardBoxes;
