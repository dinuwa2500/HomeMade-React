import React, { useState, useContext, useEffect } from "react";
import { TextField, InputAdornment, IconButton, Button } from "@mui/material";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import MyContext from "../../context";
import { postData } from "../api.js";

const ForgotPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState(""); // Adding email field
  const [loading, setLoading] = useState(false); // For loading state
  const [emailError, setEmailError] = useState(""); // Email error state
  const [passwordError, setPasswordError] = useState(""); // New password error state
  const [confirmPasswordError, setConfirmPasswordError] = useState(""); // Confirm password error state

  const context = useContext(MyContext);
  const navigate = useNavigate();

  const [formFields, setFormFields] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Handle email validation on blur
  const handleEmailBlur = () => {
    if (!email) {
      setEmailError("Email is required");
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email");
    } else {
      setEmailError("");
    }
  };

  // Handle password validation on blur
  const handlePasswordBlur = () => {
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
    } else {
      setPasswordError("");
    }
  };

  // Effect to check if passwords match
  useEffect(() => {
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  }, [newPassword, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset error messages
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    // Email validation on submit
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email");
    }

    // Password validation on submit
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
    }

    // Confirm password validation on submit
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
    }

    if (emailError || passwordError || confirmPasswordError) {
      return;
    }

    // Ensure formFields contains valid data before sending
    const formData = {
      email,
      newPassword,
      confirmPassword,
    };

    try {
      setLoading(true); // Set loading state before API call

      await postData("/api/users/reset-password", formData).then((response) => {
        console.log(response);

        if (response.success) {
          context.Toast("success", "Password reset successful");
          navigate("/login");
        } else {
          context.Toast("error", response.message);
        }
      });
    } catch (error) {
      console.error("Error resetting password:", error);
      context.Toast("error", "Something went wrong. Please try again later");
    }
  };

  // Common sx style to hide any browser default adornments
  const sxHideDefaultIcons = {
    "& input::-ms-clear, & input::-ms-reveal": {
      display: "none",
    },
    "& input::-webkit-credentials-auto-fill-button": {
      display: "none",
      visibility: "hidden",
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
            {/* Email Field */}
            <div className="form-group w-full mb-5">
              <TextField
                label="Email"
                name="email"
                variant="outlined"
                fullWidth
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={handleEmailBlur} // Email validation on blur
                autoComplete="email"
                error={!!emailError}
                helperText={emailError}
              />
            </div>

            {/* New Password Field */}
            <div className="form-group w-full mb-5">
              <TextField
                label="New Password"
                variant="outlined"
                fullWidth
                name="newPassword"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onBlur={handlePasswordBlur} // Password validation on blur
                autoComplete="new-password"
                error={!!passwordError}
                helperText={passwordError}
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
                sx={sxHideDefaultIcons}
              />
            </div>

            {/* Confirm Password Field */}
            <div className="form-group w-full mb-5">
              <TextField
                label="Confirm Password"
                variant="outlined"
                fullWidth
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                error={!!confirmPasswordError}
                helperText={confirmPasswordError}
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

            {/* Submit Button */}
            <div className="form-group w-full mb-5">
              <Button
                type="submit"
                fullWidth
                disabled={loading} // Disable button while loading
                className="!cursor-pointer !bg-blue-600 !text-white h-[45px] rounded-md hover:!bg-blue-700 transition duration-200 ease-in-out font-semibold text-sm"
              >
                {loading ? "Resetting..." : "Reset Password"}
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
