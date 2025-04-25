import React, { useState } from "react";

const TwoFactorVerify = ({ onVerify, error }) => {
  const [code, setCode] = useState("");

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow mt-10">
      <h2 className="text-xl font-bold mb-4">Two-Factor Authentication</h2>
      <form onSubmit={e => { e.preventDefault(); onVerify(code); }} className="space-y-4">
        <label className="block">Enter the 6-digit code from your authenticator app:</label>
        <input
          type="text"
          value={code}
          onChange={e => setCode(e.target.value)}
          maxLength={6}
          className="w-full border p-2 rounded"
          autoFocus
        />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button type="submit" className="w-full py-2 bg-green-600 text-white rounded">Verify</button>
      </form>
    </div>
  );
};

export default TwoFactorVerify;
