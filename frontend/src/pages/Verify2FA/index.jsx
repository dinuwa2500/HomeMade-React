import React, { useState } from "react";
import security from "../../assets/shield.png";
import { useNavigate } from "react-router-dom";
import OtpInput from "../../components/OTPbox";
import { useContext } from "react";
import MyContext from "../../context";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../../features/userSlice";

const API_BASE = "http://localhost:8000";

const Verify2FA = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const context = useContext(MyContext);
  const dispatch = useDispatch();

  const handleVerify = async (otpCode) => {
    setLoading(true);
    setError("");
    try {
      const userId = localStorage.getItem("pending2faUserId");
      if (!userId) {
        setError("Session expired. Please login again.");
        navigate("/login");
        return;
      }

      const response = await fetch(`${API_BASE}/api/users/2fa/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, code: otpCode }),
      });
      const data = await response.json();

      if (data.success) {
        // Store tokens and user info
        localStorage.setItem("accesstoken", data.data.accesstoken);
        localStorage.setItem("refreshtoken", data.data.refreshtoken);
        localStorage.setItem("userEmail", data.user.email);
        localStorage.setItem("userRole", data.user.role);
        localStorage.removeItem("pending2faUserId");

        // Update Redux store with user info
        dispatch(setUserInfo({
          ...data.user,
          token: data.data.accesstoken
        }));

        // Update context state
        context.setisLogin(true);
        context.setUser && context.setUser(data.user);

        // Show success message
        context.Toast("success", "2FA verification successful!");

        // Redirect to dashboard
        navigate("/");
      } else {
        setError(data.message || "Invalid or expired code");
      }
    } catch (err) {
      console.error("2FA verification error:", err);
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section py-10 rounded-md shadow-md">
      <div className="container">
        <div className="card shadow-md w-[500px] m-auto rounded-md bg-white p-5 px-10">
          <div className="text-center flex items-center justify-center">
            <img src={security} width="80" alt="Security shield" />
          </div>
          <h3 className="text-center text-[20px] font-semibold text-black mb-6">
            Two-Factor Authentication
          </h3>
          <p className="text-center text-gray-600 mb-6">
            Please enter the 6-digit code sent to your email
          </p>

          <div className="flex flex-col gap-4">
            <OtpInput onSubmitOTP={handleVerify} />
            {error && (
              <div className="text-red-600 text-center text-sm">{error}</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Verify2FA;
