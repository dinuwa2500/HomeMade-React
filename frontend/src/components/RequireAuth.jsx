import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";

const RequireAuth = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem("accesstoken") || localStorage.getItem("token");

  if (!token) {
    toast.error("Login first");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;
