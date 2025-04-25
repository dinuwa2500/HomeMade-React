import React, { useState } from "react";

const API_BASE = "http://localhost:8000";

const TwoFactorSetup = ({ onSendCode, onVerify }) => {
  const [step, setStep] = useState("setup");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Default API call if no onSendCode provided
  const sendCode = async (email) => {
    try {
      const res = await fetch(`${API_BASE}/api/users/2fa/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      return data;
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    }
  };

  // Default API call if no onVerify provided
  const verifyCode = async (email, code) => {
    try {
      const res = await fetch(`${API_BASE}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      return data;
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    }
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError("");
    const fn = onSendCode || sendCode;
    const res = await fn(email);
    setMessage(res?.message || "Verification code sent to your email.");
    if (res.success) setStep("verify");
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    const fn = onVerify || verifyCode;
    const res = await fn(email, code);
    setMessage(res?.message || "");
    if (!res.success) setError(res.message);
    // Optionally, redirect or update user state on success
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow mt-10">
      <h2 className="text-xl font-bold mb-4">
        Two-Factor Authentication Setup
      </h2>
      {step === "setup" && (
        <form onSubmit={handleSendCode} className="space-y-4">
          <label className="block">
            Enter your email to receive a verification code:
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Enter your email"
          />
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded"
          >
            Send Code
          </button>
          {message && <div className="text-green-600 text-sm">{message}</div>}
          {error && <div className="text-red-600 text-sm">{error}</div>}
        </form>
      )}
      {step === "verify" && (
        <form onSubmit={handleVerify} className="space-y-4">
          <label className="block">
            Enter the 6-digit code sent to your email:
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={6}
            className="w-full border p-2 rounded"
            autoFocus
          />
          <button
            type="submit"
            className="w-full py-2 bg-green-600 text-white rounded"
          >
            Verify
          </button>
          {message && <div className="text-green-600 text-sm">{message}</div>}
          {error && <div className="text-red-600 text-sm">{error}</div>}
        </form>
      )}
    </div>
  );
};

export default TwoFactorSetup;
