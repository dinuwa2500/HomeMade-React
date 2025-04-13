import { TextField, InputAdornment, IconButton, Button } from '@mui/material';
import React, { useState } from 'react';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
const Register = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <section className="section py-10">
      <div className="container">
        <div className="card shadow-md w-[500px] m-auto rounded-md bg-white p-5 px-10">
          <h3 className="text-center text-[20px] font-semibold text-black mb-6">
            Create a new account
          </h3>
          <form className="w-full">
            <div className="form-group w-full mb-5">
              <TextField
                type="text"
                id="name"
                label="Full Name"
                variant="outlined"
                className="w-full"
                autoComplete="off"
              />
            </div>

            <div className="form-group w-full mb-5">
              <TextField
                type="email"
                id="email"
                label="Email"
                variant="outlined"
                className="w-full"
                autoComplete="off"
              />
            </div>

            <div className="form-group w-full mb-5">
              <TextField
                type="tel"
                id="phone"
                label="Phone Number"
                variant="outlined"
                className="w-full"
                autoComplete="off"
                inputProps={{
                  pattern: '[0-9]{3}-[0-9]{3}-[0-9]{4}', // for phone number format
                }}
                helperText="Format: 123-456-7890"
              />
            </div>

            <div className="form-group w-full mb-5">
              <TextField
                id="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                className="w-full"
                autoComplete="new-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePassword}
                        edge="end"
                        tabIndex={-1}
                      >
                        {showPassword ? <IoMdEyeOff /> : <IoMdEye />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </div>

            <div className="form-group w-full mb-5">
              <TextField
                id="confirm-password"
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                className="w-full"
                autoComplete="new-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePassword}
                        edge="end"
                        tabIndex={-1}
                      >
                        {showPassword ? <IoMdEyeOff /> : <IoMdEye />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </div>

            <div className="form-group w-full mb-5">
              <Button
                type="submit"
                className="w-full h-[45px] !cursor-pointer !bg-blue-600 !text-white py-2 px-4 rounded-md hover:!bg-blue-700 transition duration-200 ease-in-out font-semibold text-sm"
              >
                Register
              </Button>
            </div>

            <p className="text-center text-sm">
              Already have an account?
              <Link
                to="/login"
                className="link ml-1 text-sm font-semibold text-gray-600 hover:text-blue-600 transition duration-150 ease-in-out"
              >
                Login
              </Link>
            </p>
          </form>
          <div className="flex justify-center mt-2">
            <Button
              startIcon={<FcGoogle />}
              type="submit"
              className="w-full h-[45px] !cursor-pointer !bg-gray-200 !text-black py-2 px-4 rounded-md hover:!bg-gray-300 transition duration-200 ease-in-out font-semibold text-sm"
            >
              Login with Google
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
