import React, { useContext, useEffect, useState } from "react";
import { Button, Typography, TextField, MenuItem } from "@mui/material";
import MyContext from "../../context";
import { putData } from "../../pages/api";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";

const API_BASE = "http://localhost:8000";

const MyProfile = () => {
  const context = useContext(MyContext);
  const location = useLocation();
  const token = localStorage.getItem("accesstoken");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [role, setRole] = useState("");
  const [errors, setErrors] = useState({});
  const [twoFaStatus, setTwoFaStatus] = useState(null);
  const [show2faPrompt, setShow2faPrompt] = useState(false);
  const [twoFaCode, setTwoFaCode] = useState("");
  const [twoFaError, setTwoFaError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (context.user) {
      setFullName(context.user.name || "");
      setEmail(context.user.email || "");
      setPhone(context.user.mobile || "");
      setAddress(context.user.address || "");
      setCity(context.user.city || "");
      setDob(context.user.dob ? context.user.dob.substring(0, 10) : "");
      setGender(context.user.gender || "");
      setRole(context.user.role || "");
      setTwoFaStatus(context.user.twoFaEnabled);
    }
  }, [context.user, location.pathname]);

  const validateForm = () => {
    const newErrors = {};
    if (!fullName.trim()) newErrors.fullName = "Name is required";
    if (fullName && (fullName.length < 2 || fullName.length > 50)) 
      newErrors.fullName = "Name must be between 2 and 50 characters";
    if (fullName && !/^[a-zA-Z\s'-]+$/.test(fullName))
      newErrors.fullName = "Name can only contain letters, spaces, hyphens and apostrophes";

    if (!email.trim()) newErrors.email = "Email is required";
    if (email && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email))
      newErrors.email = "Please enter a valid email address";

    if (phone && !/^\d{10}$/.test(phone))
      newErrors.phone = "Phone number must be exactly 10 digits";
    
    if (address && address.length < 5)
      newErrors.address = "Address must be at least 5 characters";
    if (address && address.length > 200)
      newErrors.address = "Address cannot exceed 200 characters";
    if (address && !/[a-zA-Z]/.test(address))
      newErrors.address = "Address must contain at least one letter";
    
    if (city && city.length > 50)
      newErrors.city = "City name cannot exceed 50 characters";
    if (city && !/[a-zA-Z]/.test(city))
      newErrors.city = "City name must contain at least one letter";
    
    if (dob) {
      const dobDate = new Date(dob);
      const today = new Date();
      const minDate = new Date();
      minDate.setFullYear(today.getFullYear() - 120); // Max age 120 years
      const maxDate = new Date();
      maxDate.setFullYear(today.getFullYear() - 13); // Min age 13 years
      
      if (isNaN(dobDate.getTime())) {
        newErrors.dob = "Please enter a valid date";
      } else if (dobDate > today) {
        newErrors.dob = "Date of birth cannot be in the future";
      } else if (dobDate < minDate) {
        newErrors.dob = "Age cannot exceed 120 years";
      } else if (dobDate > maxDate) {
        newErrors.dob = "You must be at least 13 years old";
      }
    }
    
    if (dob && !address.trim())
      newErrors.address = "Address is required when date of birth is provided";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Update the corresponding state based on input name
    switch(name) {
      case "fullName": 
        setFullName(value); 
        // Validate name on change
        if (!value.trim()) {
          setErrors(prev => ({ ...prev, fullName: "Name is required" }));
        } else if (value.length < 2 || value.length > 50) {
          setErrors(prev => ({ ...prev, fullName: "Name must be between 2 and 50 characters" }));
        } else if (!/^[a-zA-Z\s'-]+$/.test(value)) {
          setErrors(prev => ({ ...prev, fullName: "Name can only contain letters, spaces, hyphens and apostrophes" }));
        } else {
          setErrors(prev => ({ ...prev, fullName: "" }));
        }
        break;
      
      case "phone": 
        setPhone(value); 
        // Validate phone on change
        if (value && !/^\d{10}$/.test(value)) {
          setErrors(prev => ({ ...prev, phone: "Phone number must be exactly 10 digits" }));
        } else {
          setErrors(prev => ({ ...prev, phone: "" }));
        }
        break;
      
      case "address": 
        setAddress(value); 
        // Validate address on change
        if (!value.trim() && dob) {
          setErrors(prev => ({ ...prev, address: "Address is required when date of birth is provided" }));
        } else if (value && value.length < 5) {
          setErrors(prev => ({ ...prev, address: "Address must be at least 5 characters" }));
        } else if (value && value.length > 200) {
          setErrors(prev => ({ ...prev, address: "Address cannot exceed 200 characters" }));
        } else if (value && !/[a-zA-Z]/.test(value)) {
          setErrors(prev => ({ ...prev, address: "Address must contain at least one letter" }));
        } else {
          setErrors(prev => ({ ...prev, address: "" }));
        }
        break;
      
      case "city": 
        setCity(value); 
        // Validate city on change
        if (value && value.length > 50) {
          setErrors(prev => ({ ...prev, city: "City name cannot exceed 50 characters" }));
        } else if (value && !/[a-zA-Z]/.test(value)) {
          setErrors(prev => ({ ...prev, city: "City name must contain at least one letter" }));
        } else {
          setErrors(prev => ({ ...prev, city: "" }));
        }
        break;
      
      case "dob": 
        setDob(value); 
        // Validate date of birth on change
        if (value) {
          const dobDate = new Date(value);
          const today = new Date();
          const minDate = new Date();
          minDate.setFullYear(today.getFullYear() - 120); // Max age 120 years
          const maxDate = new Date();
          maxDate.setFullYear(today.getFullYear() - 13); // Min age 13 years
          
          if (isNaN(dobDate.getTime())) {
            setErrors(prev => ({ ...prev, dob: "Please enter a valid date" }));
          } else if (dobDate > today) {
            setErrors(prev => ({ ...prev, dob: "Date of birth cannot be in the future" }));
          } else if (dobDate < minDate) {
            setErrors(prev => ({ ...prev, dob: "Age cannot exceed 120 years" }));
          } else if (dobDate > maxDate) {
            setErrors(prev => ({ ...prev, dob: "You must be at least 13 years old" }));
          } else {
            setErrors(prev => ({ ...prev, dob: "" }));
          }
          
          // Check if address is required when DOB is provided
          if (!address.trim()) {
            setErrors(prev => ({ ...prev, address: "Address is required when date of birth is provided" }));
          }
        } else {
          setErrors(prev => ({ ...prev, dob: "" }));
        }
        break;
      
      case "gender": 
        setGender(value);
        break;
        
      case "role":
        setRole(value);
        break;
        
      default: break;
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const formData = new FormData();
    formData.append("name", fullName);
    formData.append("email", email);
    formData.append("mobile", phone);
    formData.append("address", address);
    formData.append("city", city);
    formData.append("dob", dob);
    formData.append("gender", gender);
    formData.append("role", role);
    try {
      const res = await putData(`/api/users/${context.user._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.success) {
        context.Toast("success", "Profile updated successfully");
        if (context.setUser) context.setUser(res.user);
      }
    } catch (err) {
      context.Toast(
        "error",
        err.response?.data?.message || err.message || "Failed to update profile"
      );
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete your profile? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d32f2f",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });
    if (!result.isConfirmed) return;
    try {
      await putData(`/api/users/me`, null, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await Swal.fire("Deleted!", "Your profile has been deleted.", "success");
      if (context.logout) context.logout();
      window.location.href = "/";
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message ||
          err.message ||
          "Failed to delete profile",
        "error"
      );
    }
  };

  const handleDisable2fa = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/users/2fa/disable`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: context.user._id }),
      });
      const data = await res.json();
      if (data.success) {
        setTwoFaStatus(false);
        context.setUser({ ...context.user, twoFaEnabled: false });
        toast.success("Two-factor authentication disabled.");
      } else {
        toast.error(data.message || "Failed to disable 2FA");
      }
    } catch (err) {
      toast.error("Failed to disable 2FA: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEnable2fa = async () => {
    setLoading(true);
    setTwoFaError("");
    try {
      // Send 2FA code to user's email
      const res = await fetch(`${API_BASE}/api/users/2fa/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: context.user._id }),
      });
      const data = await res.json();
      if (data.success) {
        setShow2faPrompt(true);
        toast.success("2FA code sent to your email.");
      } else {
        toast.error(data.message || "Failed to send 2FA code");
      }
    } catch (err) {
      toast.error("Failed to send 2FA code: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2fa = async (e) => {
    e.preventDefault();
    setTwoFaError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/users/2fa/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userId: context.user._id, 
          code: twoFaCode,
          enableTwoFa: true 
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTwoFaStatus(true);
        setShow2faPrompt(false);
        setTwoFaCode("");
        context.setUser({ ...context.user, twoFaEnabled: true });
        toast.success("Two-factor authentication enabled.");
      } else {
        setTwoFaError(data.message || "Invalid code");
      }
    } catch (err) {
      setTwoFaError("Failed to verify code: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-md rounded-md p-5 bg-white">
      <h2 className="pb-3 text-xl font-semibold">My Profile</h2>
      <hr className="mb-4" />

      <form onSubmit={handleUpdate}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="Full Name"
            name="fullName"
            value={fullName}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            error={!!errors.fullName}
            helperText={errors.fullName}
            required
          />
          <TextField
            label="Email"
            name="email"
            value={email}
            fullWidth
            margin="normal"
            error={!!errors.email}
            helperText={errors.email}
            required
            disabled
          />
          <TextField
            label="Phone"
            name="phone"
            value={phone}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            error={!!errors.phone}
            helperText={errors.phone}
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
          />
          <TextField
            label="Address"
            name="address"
            value={address}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            error={!!errors.address}
            helperText={errors.address}
            multiline
            rows={2}
          />
          <TextField
            label="City"
            name="city"
            value={city}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            error={!!errors.city}
            helperText={errors.city}
          />
          <TextField
            label="Date of Birth"
            name="dob"
            type="date"
            value={dob}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            error={!!errors.dob}
            helperText={errors.dob}
          />
          <TextField
            label="Gender"
            select
            value={gender}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          >
            <MenuItem value="">Select Gender</MenuItem>
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>
          <TextField
            label="Role"
            name="role"
            select
            value={role}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          >
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="driver">Driver</MenuItem>
          </TextField>
        </div>

        <div className="mt-6 flex gap-4">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="!bg-blue-600"
          >
            Save Changes
          </Button>
          <Button
            type="button"
            variant="outlined"
            color="error"
            onClick={handleDelete}
            sx={{
              backgroundColor: "#d32f2f",
              color: "#fff",
              "&:hover": { backgroundColor: "#b71c1c" },
            }}
          >
            Delete Profile
          </Button>
        </div>
      </form>

      {/* Two-Factor Authentication Status and Controls */}
      <div className="my-6">
        <div className="mb-2">
          <span className="font-semibold">
            Two-Factor Authentication Status: {" "}
          </span>
          <span className={`text-${twoFaStatus ? "green" : "red"}-600`}>
            {twoFaStatus ? "Enabled" : "Disabled"}
          </span>
        </div>
        {twoFaStatus ? (
          <button
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
            onClick={handleDisable2fa}
            disabled={loading}
          >
            {loading ? "Disabling..." : "Disable Two-Factor Authentication"}
          </button>
        ) : (
          <>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition mr-2"
              onClick={handleEnable2fa}
              disabled={loading}
            >
              {loading ? "Sending..." : "Enable Two-Factor Authentication"}
            </button>
            {show2faPrompt && (
              <form onSubmit={handleVerify2fa} className="mt-4 flex flex-col gap-2">
                <label htmlFor="twofa-code">Enter 2FA code sent to your email:</label>
                <input
                  id="twofa-code"
                  type="text"
                  value={twoFaCode}
                  onChange={(e) => setTwoFaCode(e.target.value)}
                  maxLength={6}
                  className="border rounded p-2"
                  disabled={loading}
                  autoFocus
                />
                {twoFaError && <div className="text-red-600 text-sm">{twoFaError}</div>}
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                  disabled={loading}
                >
                  {loading ? "Verifying..." : "Verify & Enable 2FA"}
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
