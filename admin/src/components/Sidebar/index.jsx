import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  MdDashboard,
  MdSlideshow,
  MdPeople,
  MdCategory,
  MdListAlt,
  MdLocalShipping,
  MdLogout,
  MdShoppingCart,
  MdOutlineReviews,
  MdArrowDropDown,
  MdArrowDropUp,
} from "react-icons/md";
import Collapse from "react-collapse"; // Import Collapse

const iconMap = {
  Dashboard: <MdDashboard />,
  "Home Slides": <MdSlideshow />,
  Users: <MdPeople />,
  Products: <MdShoppingCart />,
  Category: <MdCategory />,
  Orders: <MdListAlt />,
  Deliveries: <MdLocalShipping />,
  Logout: <MdLogout />,
  Reviews: <MdOutlineReviews />,
  Payments: <MdDashboard />, // Add Payments icon
  Drivers: <MdPeople />,
};

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState(null); // Manage the active item

  const handleToggle = (itemName, e) => {
    e.preventDefault(); // Prevent navigation on menu click
    // Toggle between showing and hiding the section
    setActiveItem(activeItem === itemName ? null : itemName);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("accesstoken");
    window.location.href = "/login";
  };

  const menuSections = [
    {
      title: "DASHBOARD",
      items: [
        { name: "Dashboard", link: "/dashboard" },
        { name: "Home Slides" },
        { name: "Users", link: "/users" },
        {
          name: "Products",
          link: "/products",
          options: ["Add Product", "View Products"],
        },
        {
          name: "Category",
          link: "/category",
          options: ["Add Category", "View Categories"],
        },
        // Orders: Only view all orders
        {
          name: "Orders",
          link: "/orders",
          options: [{ name: "View Orders", link: "/orders" }],
        },
        // Payments: Only approve/reject payments
        {
          name: "Payments",
          link: "/payments",
          options: [{ name: "Approve/Reject Slips", link: "/payments" }],
        },
        {
          name: "Deliveries",
          link: "/deliveries",
          options: [
            { name: "View Deliveries", link: "/deliveries" },
            { name: "Track Deliveries", link: "/deliveries/track" },
          ],
        },
        {
          name: "Drivers",
          link: "/admin/drivers",
          options: [{ name: "View Drivers", link: "/admin/drivers" }],
        },
        { name: "Logout" },
        {
          name: "Reviews",
          link: "/reviews",
          options: [{ name: "View Reviews", link: "/reviews" }],
        },
      ],
    },
  ];

  return (
    <div className="sidebar fixed top-0 left-0 bg-[#f8f9fa] w-64 h-full border-r border-gray-200 overflow-y-auto scrollbar-hide">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">Eome</h1>
      </div>

      <nav className="px-4">
        {menuSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-8">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2">
              {section.title}
            </h2>
            <ul className="space-y-1">
              {section.items.map((item, index) => (
                <div key={index}>
                  <li>
                    {item.name === "Logout" ? (
                      <Link
                        to={item.link || "/"}
                        onClick={handleLogout}
                        className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors duration-200"
                      >
                        <span className="mr-3 text-lg">
                          {iconMap[item.name] || <MdDashboard />}
                        </span>
                        <span className="ml-3">{item.name}</span>
                      </Link>
                    ) : (
                      <Link
                        to={item.link || "/"} // Use the link property if available
                        onClick={
                          item.link
                            ? undefined
                            : (e) => handleToggle(item.name, e)
                        }
                        className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors duration-200"
                      >
                        <span className="mr-3 text-lg">
                          {iconMap[item.name] || <MdDashboard />}
                        </span>
                        <span className="ml-3">{item.name}</span>
                        {/* Add the up/down toggle icon */}
                        {item.options && (
                          <span className="ml-auto">
                            {activeItem === item.name ? (
                              <MdArrowDropUp />
                            ) : (
                              <MdArrowDropDown />
                            )}
                          </span>
                        )}
                      </Link>
                    )}
                  </li>

                  {/* Use Collapse to show/hide submenu */}
                  <Collapse isOpened={activeItem === item.name}>
                    {item.options && (
                      <ul className="ml-6 mt-2">
                        {item.options.map((option, optionIndex) => (
                          <li key={optionIndex}>
                            {typeof option === "object" && option.link ? (
                              <Link
                                to={option.link}
                                className="block text-sm font-medium text-gray-700 px-3 py-2 hover:bg-gray-200 transition-colors duration-200"
                              >
                                {option.name}
                              </Link>
                            ) : (
                              <Link
                                to={`/${encodeURIComponent(
                                  option.toLowerCase().replace(/\s+/g, "-")
                                )}`}
                                className="block text-sm font-medium text-gray-700 px-3 py-2 hover:bg-gray-200 transition-colors duration-200"
                              >
                                {option}
                              </Link>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </Collapse>
                </div>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
