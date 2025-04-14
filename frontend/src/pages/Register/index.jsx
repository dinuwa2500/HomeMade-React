import { TextField, InputAdornment, IconButton, Button } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formFields, setFormFields] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const allFieldsFilled = Object.values(formFields).every(
      (value) => value.trim() !== ''
    );
    const noErrors = Object.values(errors).every((error) => !error);
    setIsFormValid(allFieldsFilled && noErrors);
  }, [formFields, errors]);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    const updatedFields = { ...formFields, [id]: value };
    setFormFields(updatedFields);

    const error = validateField(id, value, updatedFields);
    setErrors((prevErrors) => ({ ...prevErrors, [id]: error }));
  };

  const handleBlur = (e) => {
    const { id, value } = e.target;
    const error = validateField(id, value, formFields);
    setErrors((prevErrors) => ({ ...prevErrors, [id]: error }));
  };

  const validateField = (id, value, allValues) => {
    switch (id) {
      case 'name':
        if (!value.trim()) return 'Full name is required';
        if (value.length < 3) return 'Name must be at least 3 characters';
        if (/\d/.test(value)) return 'Name cannot contain numbers';
        return '';
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return 'Invalid email address';
        return '';
      case 'phone':
        if (!value.trim()) return 'Phone number is required';
        if (!/^\d{10}$/.test(value)) return 'Phone number must be 10 digits';
        return '';
      case 'password':
        if (!value.trim()) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        return '';
      case 'confirmPassword':
        if (!value.trim()) return 'Confirm password is required';
        if (value !== allValues.password) return 'Passwords do not match';
        return '';
      default:
        return '';
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
    <section className="section py-10">
      <div className="container">
        <div className="card shadow-md w-[500px] m-auto rounded-md bg-white p-5 px-10">
          <h3 className="text-center text-[20px] font-semibold text-black mb-6">
            Create a new account
          </h3>
          <form className="w-full">
            {/* Full Name */}
            <div className="form-group w-full mb-5">
              <TextField
                type="text"
                id="name"
                label="Full Name"
                variant="outlined"
                className="w-full"
                autoComplete="off"
                value={formFields.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.name}
                helperText={errors.name}
              />
            </div>

            {/* Email */}
            <div className="form-group w-full mb-5">
              <TextField
                type="email"
                id="email"
                label="Email"
                variant="outlined"
                className="w-full"
                autoComplete="off"
                value={formFields.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.email}
                helperText={errors.email}
              />
            </div>

            {/* Phone */}
            <div className="form-group w-full mb-5">
              <TextField
                type="tel"
                id="phone"
                label="Phone Number"
                variant="outlined"
                className="w-full"
                autoComplete="off"
                value={formFields.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.phone}
                helperText={
                  errors.phone || 'Enter 10 digit number (e.g., 9876543210)'
                }
                inputProps={{ maxLength: 10 }}
              />
            </div>

            {/* Password */}
            <div className="form-group w-full mb-5">
              <TextField
                id="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                className="w-full"
                autoComplete="new-password"
                value={formFields.password}
                onChange={handleChange}
                onBlur={handleBlur}
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

            {/* Confirm Password */}
            <div className="form-group w-full mb-5">
              <TextField
                id="confirmPassword"
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                className="w-full"
                autoComplete="new-password"
                value={formFields.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
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

            {/* Register Button */}
            <div className="form-group w-full mb-5">
              <Button
                type="submit"
                disabled={!isFormValid}
                className={`w-full h-[45px] !cursor-pointer ${
                  isFormValid
                    ? '!bg-blue-600 hover:!bg-blue-700'
                    : '!bg-gray-400 cursor-not-allowed'
                } !text-white py-2 px-4 rounded-md transition duration-200 ease-in-out font-semibold text-sm`}
              >
                Register
              </Button>
            </div>

            {/* Login Redirect */}
            <p className="text-center text-sm">
              Already have an account?
              <Link
                to="/login"
                className="link ml-1 text-sm font-semibold text-gray-600 hover:text-blue-600 transition duration-150 ease-in-out"
              >
                Login
              </Link>
            </p>

            {/* Google Login */}
            <div className="flex justify-center mt-6">
              <Button
                startIcon={<FcGoogle />}
                type="button"
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

export default Register;
