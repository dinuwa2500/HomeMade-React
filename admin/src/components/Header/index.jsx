import React, { useState } from 'react';
import { RiMenu2Line } from 'react-icons/ri';
import Badge from '@mui/material/Badge';
import { FaRegBell } from 'react-icons/fa';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import { FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa'; // Importing icons

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
    padding: '0 4px',
  },
}));

const Header = ({ toggleSidebar }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // You can replace this with dynamic user info from context or props
  const firstName = 'John';
  const email = 'john.doe@example.com';

  return (
    <header className="w-full h-[50px] pl-72 pr-7 bg-[#e9e7e7] flex items-center justify-between">
      {/* Left: Menu Icon */}
      <div className="part1">
        <IconButton
          className="!h-[40px] !w-[40px] !min-w-[40px] !rounded-full bg-primary text-white"
          onClick={toggleSidebar}
        >
          <RiMenu2Line />
        </IconButton>
      </div>

      {/* Right: Notifications & Profile */}
      <div className="part2 w-[40%] flex items-center justify-end gap-3">
        {/* Bell Notification */}
        <IconButton aria-label="notifications">
          <StyledBadge badgeContent={4} color="secondary">
            <FaRegBell className="text-xl text-gray-700" />
          </StyledBadge>
        </IconButton>

        {/* Avatar with Click Menu */}
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

        {/* Profile Dropdown Menu */}
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          PaperProps={{
            sx: { minWidth: 200 },
          }}
        >
          <div className="px-4 py-2">
            <div className="text-sm font-semibold">{firstName}</div>
            <div className="text-xs text-gray-500">{email}</div>
          </div>
          <Divider />
          <MenuItem onClick={handleMenuClose}>
            <FaUser className="mr-2" /> Profile
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <FaCog className="mr-2" /> Settings
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <FaSignOutAlt className="mr-2" /> Logout
          </MenuItem>
        </Menu>
      </div>
    </header>
  );
};

export default Header;
