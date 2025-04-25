import React, { useContext, useEffect, useState } from "react";
import { Button, Typography, TextField, MenuItem } from "@mui/material";
import MyContext from "../../context";
import { putData } from "../../pages/api";
import toast from "react-hot-toast";

const API_BASE = "http://localhost:8000";

const MyProfile = () => {
  const context = useContext(MyContext);
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
  }, [context.user]);

  const validateForm = () => {
    const newErrors = {};
    if (!fullName.trim()) newErrors.fullName = "Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    if (email && !/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Invalid email format";
    if (phone && !/^\d{10}$/.test(phone))
      newErrors.phone = "Phone should be 10 digits";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

      <form onSubmit={handleUpdate} className="flex flex-wrap gap-5">
        <div className="w-[48%]">
          <TextField
            fullWidth
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            error={!!errors.fullName}
            helperText={errors.fullName}
            variant="outlined"
            margin="normal"
          />
        </div>

        <div className="w-[48%]">
          <TextField
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            variant="outlined"
            margin="normal"
            disabled
          />
        </div>

        <div className="w-[48%]">
          <TextField
            fullWidth
            label="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={!!errors.phone}
            helperText={errors.phone}
            variant="outlined"
            margin="normal"
          />
        </div>

        <div className="w-[48%]">
          <TextField
            fullWidth
            label="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            variant="outlined"
            margin="normal"
          />
        </div>

        <div className="w-[48%]">
          <TextField
            fullWidth
            label="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            variant="outlined"
            margin="normal"
          />
        </div>

        <div className="w-[48%]">
          <TextField
            fullWidth
            label="Date of Birth"
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            margin="normal"
          />
        </div>

        <div className="w-[48%]">
          <TextField
            fullWidth
            label="Gender"
            select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            variant="outlined"
            margin="normal"
          >
            <MenuItem value="">Select Gender</MenuItem>
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>
        </div>

        <div className="w-[48%]">
          <TextField
            fullWidth
            label="Role"
            select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            variant="outlined"
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
