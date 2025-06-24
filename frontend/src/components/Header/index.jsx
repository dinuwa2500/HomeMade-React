import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/Lgoo.png";
import Search from "../Search";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import { Button, IconButton, Avatar, Menu, MenuItem } from "@mui/material";
import { MdOutlineShoppingCart } from "react-icons/md";
import Navigation from "./Navigation";
import MyContext from "../../context";
import {
  FiUser,
  FiShoppingBag,
  FiHeart,
  FiLogOut,
  FiClipboard,
  FiPlusCircle,
} from "react-icons/fi";
import { useSelector } from "react-redux";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
  },
}));

const Header = () => {
  const context = useContext(MyContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const userInfo = useSelector((state) => state.user.userInfo);

  const cartCount = Array.isArray(cartItems) ? cartItems.length : 0;
  const totalUnits = Array.isArray(cartItems)
    ? cartItems.reduce((acc, item) => acc + (item.qty || 0), 0)
    : 0;

  const handleProfileClick = (event) => {
    if (anchorEl) {
      setAnchorEl(null);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("accesstoken");
    localStorage.removeItem("refreshtoken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");

    context.setisLogin(false);

    context.Toast("success", "Logged out successfully!");

    navigate("/login");
  };

  return (
    <header className="bg-white">
      <div className="top-strip py-2 border-t-[1px] border-gray-200 border-b-[1px]">
        <div className="container">
          <div className="flex items-center justify-between">
            <div className="col1 w-[50%]">
              <p className="text-[14px]">
                Get up to 50% off new season styles, limited time only
              </p>
            </div>
            <div className="flex items-center justify-end ">
              <ul className="flex items-center gap-3">
                <li className="list-none">
                  <Link
                    to="/help-center"
                    className="link text-[12px] transition"
                  >
                    Help Center
                  </Link>
                </li>
                <li className="list-none">
                  <Link
                    to="/order-tracking"
                    className="link text-[12px] transition"
                  >
                    Order Tracking
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="header py-4 border-b-[1px] border-gray-200">
        <div className="container flex items-center justify-between">
          <div className="col1 w-[30%]">
            <Link to="/" className="logo">
              <img src={logo} alt="logo" className="w-50" />
            </Link>
          </div>

          <div className="col2 w-[40%]">
            <Search />
          </div>

          <div className="col3 w-[30%] flex items-center pl-5">
            <ul className="flex items-center gap-3">
              {!context.isLogin ? (
                <li className="list-none">
                  <Link
                    to="/login"
                    className="link text-[15px] transition font-[500]"
                  >
                    Login
                  </Link>
                  |
                  <Link
                    to="/register"
                    className="link text-[15px] transition font-[500]"
                  >
                    Register
                  </Link>
                </li>
              ) : (
                <>
                  <div
                    onClick={handleProfileClick}
                    className="cursor-pointer flex items-center gap-3 myAccountWrap"
                  >
                    <Button
                      variant="outlined"
                      sx={{
                        minWidth: 0,
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        padding: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FiUser size={18} />
                    </Button>

                    <div className="info flex flex-col">
                      <h4 className="text-[14px] mb-0 text-left justify-start">
                        {userInfo?.name}
                      </h4>
                      <span className="text-[13px] text-left justify-start">
                        {userInfo?.email}
                      </span>
                    </div>
                  </div>

                  <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    slotProps={{
                      paper: {
                        elevation: 0,
                        sx: {
                          overflow: "visible",
                          filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                          mt: 1.5,
                          "& .MuiAvatar-root": {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                          },
                          "&::before": {
                            content: '""',
                            display: "block",
                            position: "absolute",
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: "background.paper",
                            transform: "translateY(-50%) rotate(45deg)",
                            zIndex: 0,
                          },
                        },
                      },
                    }}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  >
                    <MenuItem
                      onClick={() => {
                        handleClose();
                        navigate("/profile");
                      }}
                    >
                      <Avatar sx={{ width: 24, height: 24, mr: 1.5 }} />
                      My Account
                    </MenuItem>

                    <MenuItem onClick={() => navigate("/profile/my-tickets")}>
                      <FiClipboard
                        fontSize="small"
                        style={{ marginRight: "12px" }}
                      />
                      My Tickets
                    </MenuItem>
                    <MenuItem onClick={() => navigate("/raise-ticket")}>
                      <FiPlusCircle
                        fontSize="small"
                        style={{ marginRight: "12px" }}
                      />
                      Raise a Ticket
                    </MenuItem>

                    <MenuItem onClick={handleLogout}>
                      <FiLogOut
                        fontSize="small"
                        style={{ marginRight: "12px" }}
                      />
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              )}

              <li>
                <IconButton
                  component={Link}
                  to="/cart"
                  size="large"
                  aria-label="show cart items"
                  color="inherit"
                >
                  <StyledBadge badgeContent={cartCount} color="error">
                    <MdOutlineShoppingCart className="text-[24px]" />
                  </StyledBadge>
                </IconButton>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Navigation />
    </header>
  );
};

export default Header;
