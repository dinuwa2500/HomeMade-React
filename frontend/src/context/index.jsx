import React, { createContext, useState, useEffect } from "react";

// Create and export the context
export const MyContext = createContext();

export const MyProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from localStorage if available
  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <MyContext.Provider values={{ user, setUser }}>
      {children}
    </MyContext.Provider>
  );
};

export default MyContext;
