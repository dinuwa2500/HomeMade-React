import React, { useState, useEffect } from "react";
import { RiMenu2Line } from "react-icons/ri";
import Badge from "@mui/material/Badge";
import { FaRegBell } from "react-icons/fa";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import { FaUser, FaCog, FaSignOutAlt } from "react-icons/fa"; 
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URI || "http://localhost:8000";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
    padding: "0 4px",
  },
}));

const Header = ({ toggleSidebar }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const [user, setUser] = useState({ firstName: "", email: "" });
  const [lowStockCount, setLowStockCount] = useState(0);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [showLowStockDropdown, setShowLowStockDropdown] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("accesstoken");
        const res = await axios.get(`${API_URL}/api/users/details`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = res.data.user || res.data || {};
        setUser({
          firstName: data.firstName || data.name || "",
          email: data.email || "",
        });
      } catch (err) {
        setUser({ firstName: "", email: "" });
      }
    };

    const fetchLowStock = async () => {
      try {
        const token = localStorage.getItem("accesstoken");
        const res = await axios.get(`${API_URL}/api/products/all-products`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const products = res.data.products || [];
        const lowStock = products.filter(p => p.countInStock !== undefined && p.countInStock <= 5);
        setLowStockCount(lowStock.length);
        setLowStockProducts(lowStock.map(p => ({ name: p.name, count: p.countInStock })));
      } catch (err) {
        setLowStockCount(0);
        setLowStockProducts([]);
      }
    };

    fetchUser();
    fetchLowStock();
  }, []);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    localStorage.removeItem("accesstoken");
    toast.success("Logged out successfully!");
    setTimeout(() => {
      navigate("/login");
    }, 1200);
  };

  return (
    <header className="w-full h-[50px] pl-72 pr-7 bg-[#e9e7e7] flex items-center justify-between">
      <div className="part1">
        <IconButton
          className="!h-[40px] !w-[40px] !min-w-[40px] !rounded-full bg-primary text-white"
          onClick={toggleSidebar}
        >
          <RiMenu2Line />
        </IconButton>
      </div>

      <div className="part2 w-[40%] flex items-center justify-end gap-3">
        <div className="relative">
          <IconButton aria-label="notifications" onClick={() => setShowLowStockDropdown(v => !v)}>
            <StyledBadge badgeContent={lowStockCount} color="error">
              <FaRegBell className="text-xl text-gray-700" />
            </StyledBadge>
          </IconButton>
          {showLowStockDropdown && lowStockCount > 0 && (
            <div className="absolute right-0 mt-2 w-64 bg-white border shadow-lg rounded z-50">
              <div className="p-2 text-sm font-semibold border-b">Low Stock Products</div>
              <ul className="max-h-60 overflow-y-auto">
                {lowStockProducts.map((prod, idx) => (
                  <li key={idx} className="px-4 py-2 text-xs flex justify-between hover:bg-gray-100">
                    <span>{prod.name}</span>
                    <span className="text-red-600 font-bold">{prod.count}</span>
                  </li>
                ))}
              </ul>
              {lowStockProducts.length === 0 && <div className="px-4 py-2 text-xs text-gray-500">No low stock products</div>}
            </div>
          )}
        </div>

        <div
          onClick={handleAvatarClick}
          className="rounded-full w-[40px] h-[40px] overflow-hidden cursor-pointer"
        >
          <img
            src="https://ecme-react.themenate.net/img/avatars/thumb-1.jpg"
            className="w-full h-full object-cover"
            alt="Profile"
          />
        </div>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          PaperProps={{
            sx: { minWidth: 200 },
          }}
        >
          <div className="px-4 py-2">
            <div className="text-sm font-semibold">{user.firstName}</div>
            <div className="text-xs text-gray-500">{user.email}</div>
          </div>
          <Divider />
          <MenuItem
            onClick={() => {
              handleMenuClose();
              window.location.href = "/profile";
            }}
          >
            <FaUser className="mr-2" /> Profile
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <FaCog className="mr-2" /> Settings
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <FaSignOutAlt className="mr-2" /> Logout
          </MenuItem>
        </Menu>
      </div>
    </header>
  );
};

export default Header;
