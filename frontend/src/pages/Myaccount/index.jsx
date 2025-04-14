import React from 'react';
import profilePic from '../../../src/assets/profile.png';
import { Button, Typography, TextField } from '@mui/material';
import {
  FaCloudUploadAlt,
  FaUser,
  FaList,
  FaBox,
  FaSignOutAlt,
} from 'react-icons/fa';

import { NavLink, Outlet } from 'react-router-dom';

const MyAccount = () => {
  return (
    <section className="py-10 w-full">
      <div className="container flex gap-5">
        {/* Sidebar */}
        <div className="col1 w-[20%]">
          <div className="card bg-white shadow-md rounded-md">
            <div className="w-full p-3 flex items-center justify-center flex-col">
              <div className="w-[100px] h-[100px] rounded-full mb-4 relative overflow-hidden group">
                <img
                  src={profilePic}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
                <label className="absolute inset-0 bg-[rgba(0,0,0,0.1)] group-hover:bg-[rgba(0,0,0,0.4)] transition-all duration-300 z-10 flex items-center justify-center cursor-pointer">
                  <FaCloudUploadAlt className="text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      console.log('Selected file:', file);
                    }}
                  />
                </label>
              </div>
              <h3 className="text-center font-[700]">Lakviru Perera</h3>
              <h6 className="text-center text-lg text-gray-700 font-[600]">
                lakviri@gmail.com
              </h6>
            </div>

            <ul className="list-none pb-5 bg-[#f1f1f1]">
              <li className="w-full">
                <NavLink to="/profile">
                  <Button
                    startIcon={<FaUser />}
                    className="w-full flex items-center !text-black gap-2 !text-left !px-5 !justify-start"
                    sx={{
                      fontSize: '16px',
                      paddingLeft: '3px',
                      textTransform: 'none',
                    }}
                  >
                    My Profile
                  </Button>
                </NavLink>
              </li>

              <li className="w-full">
                <NavLink to="/profile/my-list">
                  <Button
                    startIcon={<FaList />}
                    className="w-full flex items-center gap-2 !text-black !text-left !px-5 !justify-start"
                    sx={{
                      fontSize: '16px',
                      paddingLeft: '3px',
                      textTransform: 'none',
                    }}
                  >
                    My List
                  </Button>
                </NavLink>
              </li>

              <li className="w-full">
                <NavLink to="/profile/orders">
                  <Button
                    startIcon={<FaBox />}
                    className="w-full flex items-center gap-2 !text-black  !text-left !px-5 !justify-start"
                    sx={{
                      fontSize: '16px',
                      paddingLeft: '3px',
                      textTransform: 'none',
                    }}
                  >
                    My Orders
                  </Button>
                </NavLink>
              </li>

              <li className="w-full">
                <NavLink to="/logout">
                  <Button
                    startIcon={<FaSignOutAlt />}
                    className="w-full flex items-center gap-2  !text-black !text-left !px-5 !justify-start"
                    sx={{
                      fontSize: '16px',
                      paddingLeft: '3px',
                      textTransform: 'none',
                    }}
                  >
                    Logout
                  </Button>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="col2 w-[80%]">
          <Outlet />
        </div>
      </div>
    </section>
  );
};

export default MyAccount;
