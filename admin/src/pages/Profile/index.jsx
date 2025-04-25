import React, { useEffect, useState } from "react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("accesstoken");
      const backendUrl = import.meta.env.VITE_BACKEND_URI || "http://localhost:8000";
      try {
        const res = await fetch(`${backendUrl}/api/users/details`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          setError("Failed to load profile");
        }
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div className="p-8">Loading profile...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8 mt-12 flex flex-col items-center gap-6 border border-gray-100">
      <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-blue-500 shadow-md mb-2">
        <img
          src={user.avatar || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.name || user.email || "User") + "&background=3b82f6&color=fff&size=128"}
          alt="Profile Avatar"
          className="w-full h-full object-cover"
        />
      </div>
      <h2 className="text-3xl font-extrabold text-gray-800 mb-2">{user.name}</h2>
      <div className="flex flex-col items-center gap-2 w-full">
        <div className="flex items-center w-full justify-between bg-gray-50 rounded-lg px-4 py-3">
          <span className="font-semibold text-gray-700">Email:</span>
          <span className="text-gray-600">{user.email}</span>
        </div>
        <div className="flex items-center w-full justify-between bg-gray-50 rounded-lg px-4 py-3">
          <span className="font-semibold text-gray-700">Role:</span>
          <span className="text-blue-600 font-semibold uppercase tracking-wide">{user.role}</span>
        </div>
      </div>
      {/* Add more fields as needed */}
      <button className="mt-4 px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow transition duration-150">
        Edit Profile
      </button>
    </div>
  );
};

export default Profile;
