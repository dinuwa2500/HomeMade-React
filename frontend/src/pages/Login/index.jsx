import { TextField, InputAdornment, IconButton, Button } from '@mui/material';
import React, { useContext, useState } from 'react';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import MyContext from '../../context';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [formFields, setformFields] = useState({
    email: '',
    password: '',
  });

  const context = useContext(MyContext);

  const history = useNavigate();

  const forgotPassword = () => {
    context.Toast('success', 'OTP Send');
    history('/verify');
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  // Common sx style to hide any browser default adornments
  const sxHideDefaultIcons = {
    '& input::-ms-clear, & input::-ms-reveal': {
      display: 'none',
    },
    '& input::-webkit-credentials-auto-fill-button': {
      display: 'none',
      visibility: 'hidden',
    },
  };

  return (
    <section className="section py-10">
      <div className="container">
        <div className="card shadow-md w-[500px] m-auto rounded-md bg-white p-5 px-10">
          <h3 className="text-center text-[20px] font-semibold text-black mb-6">
            Login to your account
          </h3>
          <form className="w-full">
            <div className="form-group w-full mb-5">
              <TextField
                type="email"
                name="email"
                id="email"
                label="Email"
                variant="outlined"
                className="w-full"
                autoComplete="off"
              />
            </div>

            <div className="form-group w-full mb-5">
              <TextField
                id="password"
                name="password"
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
                sx={sxHideDefaultIcons}
              />
            </div>

            <div className="flex justify-start mb-5">
              <a
                className="link cursor-pointer text-sm font-semibold text-gray-600 hover:text-blue-600 transition duration-150 ease-in-out"
                onClick={forgotPassword}
              >
                Forgot password?
              </a>
            </div>

            <div className="form-group w-full mb-5">
              <Button
                type="submit"
                className="w-full h-[45px] !cursor-pointer !bg-blue-600 !text-white py-2 px-4 rounded-md hover:!bg-blue-700 transition duration-200 ease-in-out font-semibold text-sm"
              >
                Login
              </Button>
            </div>

            <p className="text-center text-sm">
              Not registered?
              <Link
                to="/register"
                className="link ml-1 text-sm font-semibold text-gray-600 hover:text-blue-600 transition duration-150 ease-in-out"
              >
                Sign Up
              </Link>
            </p>

            <p className="mt-6 mb-3 text-center text-[16px] font-medium text-gray-600">
              Or continue with
            </p>

            <div className="flex justify-center">
              <Button
                startIcon={<FcGoogle />}
                type="submit"
                className="w-full h-[45px] !cursor-pointer !bg-gray-200 !text-black py-2 px-4 rounded-md hover:!bg-gray-300 transition duration-200 ease-in-out font-semibold text-sm"
              >
                Login with Google
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
