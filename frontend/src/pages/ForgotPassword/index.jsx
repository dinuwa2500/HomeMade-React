import React, { useState, useContext } from 'react';
import { TextField, InputAdornment, IconButton, Button } from '@mui/material';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import MyContext from '../../context';

const ForgotPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const context = useContext(MyContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      context.Toast('error', 'Please fill out both fields');
      return;
    }

    if (newPassword.length < 6) {
      context.Toast('error', 'Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      context.Toast('error', 'Passwords do not match');
      return;
    }

    context.Toast('success', 'Password reset successful');
    navigate('/login');
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
            Forgot Password
          </h3>

          <form className="w-full" onSubmit={handleSubmit}>
            {/* New Password Field */}
            <div className="form-group w-full mb-5">
              <TextField
                label="New Password"
                variant="outlined"
                fullWidth
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <IoMdEyeOff size={20} />
                        ) : (
                          <IoMdEye size={20} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                // Apply styling to always hide any default icons
                sx={sxHideDefaultIcons}
              />
            </div>

            {/* Confirm Password Field */}
            <div className="form-group w-full mb-5">
              <TextField
                label="Confirm Password"
                variant="outlined"
                fullWidth
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        edge="end"
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? (
                          <IoMdEyeOff size={20} />
                        ) : (
                          <IoMdEye size={20} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={sxHideDefaultIcons}
              />
            </div>

            <div className="form-group w-full mb-5">
              <Button
                type="submit"
                fullWidth
                className="!cursor-pointer !bg-blue-600 !text-white h-[45px] rounded-md hover:!bg-blue-700 transition duration-200 ease-in-out font-semibold text-sm"
              >
                Reset Password
              </Button>
            </div>

            <p className="text-center text-sm">
              Back to
              <Link
                to="/login"
                className="ml-1 font-semibold text-blue-600 hover:underline"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
