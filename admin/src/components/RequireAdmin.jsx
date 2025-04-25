import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const RequireAdmin = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem("accesstoken");
      if (!token) {
        navigate("/login");
        return;
      }
      const backendUrl =
        import.meta.env.VITE_BACKEND_URI || "http://localhost:8000";
      try {
        const res = await fetch(`${backendUrl}/api/users/details`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        if (!data.user || data.user.role !== "admin") {
          localStorage.removeItem("accesstoken");
          navigate("/login");
        } else {
          setLoading(false);
        }
      } catch (err) {
        localStorage.removeItem("accesstoken");
        navigate("/login");
      }
    };
    checkAdmin();
    // eslint-disable-next-line
  }, []);

  if (loading) return null;
  return children;
};

export default RequireAdmin;
