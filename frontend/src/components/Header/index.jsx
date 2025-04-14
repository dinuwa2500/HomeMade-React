import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/Lgoo.png';
import Search from '../Search';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import { Button, IconButton } from '@mui/material';
import { MdOutlineShoppingCart } from 'react-icons/md';
import Navigation from './Navigation';
import MyContext from '../../context';
import { FiUser } from 'react-icons/fi';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { FiShoppingBag, FiHeart, FiLogOut } from 'react-icons/fi';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
  },
}));

const Header = () => {
  const context = useContext(MyContext);

  // State to manage menu anchor (open or close)
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleProfileClick = (event) => {
    // Toggle the profile menu
    if (anchorEl) {
      setAnchorEl(null); // Close if already open
    } else {
      setAnchorEl(event.currentTarget); // Open if not open
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
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
              {context.isLogin === 'false' ? (
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
                  <Button
                    className="!text-black myAccountWrap flex items-center gap-3"
                    onClick={handleProfileClick} // Toggle profile menu on click
                  >
                    <Button
                      variant="outlined"
                      sx={{
                        minWidth: 0,
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <FiUser size={18} />
                    </Button>

                    <div className="info flex flex-col">
                      <h4 className=" text-[14px] mb-0 text-left justify-start">
                        Lakviru
                      </h4>
                      <span className="text-[13px] text-left justify-start">
                        lakviru@gmail.com
                      </span>
                    </div>
                  </Button>

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
                          overflow: 'visible',
                          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                          mt: 1.5,
                          '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                          },
                          '&::before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                          },
                        },
                      },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    {/* User Profile Section */}
                    <MenuItem onClick={handleClose}>
                      <Avatar sx={{ width: 24, height: 24, mr: 1.5 }} />
                      My Account
                    </MenuItem>

                 

                    {/* Orders */}
                    <MenuItem onClick={handleClose}>
                      <FiShoppingBag fontSize="small" sx={{ mr: 1.5 }} />
                      My Orders
                    </MenuItem>

                    {/* Wishlist/Favorites */}
                    <MenuItem onClick={handleClose}>
                      <FiHeart fontSize="small" sx={{ mr: 1.5 }} />
                      My Wishlist
                    </MenuItem>

                    {/* Logout */}
                    <MenuItem>
                      <FiLogOut fontSize="small" sx={{ mr: 1.5 }} />
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              )}

              <li>
                <IconButton
                  aria-label="cart"
                  onClick={() => context.setOpenCartPanel(true)}
                >
                  <StyledBadge badgeContent={4} color="secondary">
                    <MdOutlineShoppingCart className="text-[25px]" />
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
