import React, { useContext, useState } from 'react';
import { TextField, InputAdornment, IconButton, Button } from '@mui/material';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { postData } from '../api';
import MyContext from '../../context';
import { useDispatch } from 'react-redux';
import { setUserInfo } from '../../features/userSlice';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formFields, setFormFields] = useState({
    email: '',
    password: '',
  });

  const context = useContext(MyContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });

    setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    const { email, password } = formFields;
    const newErrors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await postData('/api/users/login', formFields, false);

      if (response.twofa) {
        localStorage.setItem('pending2faUserId', response.userId);
        navigate('/verify2fa');
      } else if (response.success) {
        context.Toast('success', 'Login successful!');
        localStorage.setItem('accesstoken', response.data.accesstoken);
        localStorage.setItem('refreshtoken', response.data.refreshtoken);
        localStorage.setItem('userEmail', response.user.email);
        localStorage.setItem('userRole', response.user.role);
        
        dispatch(
          setUserInfo({ ...response.user, token: response.data.accesstoken })
        );
        context.setisLogin(true);

        navigate('/');
      } else {
        context.Toast('error', response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      context.Toast('error', 'Something went wrong. Try again.');
    }
  };

  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [twoFaError, setTwoFaError] = useState('');

  const handle2faVerify = async (code) => {
    setTwoFaError('');
    try {
      const userId = localStorage.getItem('pending2faUserId');
      const response = await postData(
        '/api/users/2fa/verify',
        {
          userId,
          code,
        },
        false
      );
      if (response.success) {
        localStorage.removeItem('pending2faUserId');
        localStorage.setItem('accesstoken', response.data.accesstoken);
        localStorage.setItem('refreshtoken', response.data.refreshtoken);
        localStorage.setItem('userEmail', response.user.email);
        localStorage.setItem('userRole', response.user.role);
        dispatch(
          setUserInfo({ ...response.user, token: response.data.accesstoken })
        );
        context.setisLogin(true);
        navigate('/');
      } else {
        setTwoFaError(response.message || 'Invalid or expired code');
      }
    } catch (error) {
      setTwoFaError('Something went wrong. Try again.');
    }
  };

  const forgotPassword = async () => {
    if (!formFields.email) {
      context.Toast('error', 'Email is required');
      return;
    }

    try {
      const response = await postData(
        '/api/users/forgot-password',
        {
          email: formFields.email,
        },
        false
      );

      if (response.success) {
        context.Toast('success', 'OTP sent successfully!');
        localStorage.setItem('userEmail', formFields.email);
        localStorage.setItem('action', 'forgotpsw');
        navigate('/verify');
      } else {
        context.Toast('error', response.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      context.Toast('error', 'Something went wrong. Please try again.');
    }
  };

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
    <>
      {showTwoFactor ? (
        <TwoFactorVerify onVerify={handle2faVerify} error={twoFaError} />
      ) : (
        <section className="section py-10">
          <div className="container">
            <div className="card shadow-md w-[500px] m-auto rounded-md bg-white p-5 px-10">
              <h3 className="text-center text-[20px] font-semibold text-black mb-6">
                Login to your account
              </h3>

              <form className="w-full" onSubmit={handleSubmit}>
                <div className="form-group w-full mb-5">
                  <TextField
                    type="email"
                    name="email"
                    label="Email"
                    value={formFields.email}
                    onChange={handleInputChange}
                    variant="outlined"
                    className="w-full"
                    error={!!errors.email}
                    helperText={errors.email}
                    autoComplete="off"
                  />
                </div>

                <div className="form-group w-full mb-5">
                  <TextField
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={formFields.password}
                    onChange={handleInputChange}
                    variant="outlined"
                    className="w-full"
                    autoComplete="new-password"
                    error={!!errors.password}
                    helperText={errors.password}
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
                  <span
                    className="cursor-pointer text-sm font-semibold text-gray-600 hover:text-blue-600 transition"
                    onClick={forgotPassword}
                  >
                    Forgot password?
                  </span>
                </div>

                <div className="form-group w-full mb-5">
                  <Button
                    type="submit"
                    className="w-full h-[45px] !cursor-pointer !bg-blue-600 !text-white py-2 px-4 rounded-md hover:!bg-blue-700 transition font-semibold text-sm"
                  >
                    Login
                  </Button>
                </div>

                <p className="text-center text-sm">
                  Not registered?
                  <Link
                    to="/register"
                    className="ml-1 text-sm font-semibold text-gray-600 hover:text-blue-600 transition"
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
                    type="button"
                    className="w-full h-[45px] !cursor-pointer !bg-gray-200 !text-black py-2 px-4 rounded-md hover:!bg-gray-300 transition font-semibold text-sm"
                  >
                    Login with Google
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Login;
