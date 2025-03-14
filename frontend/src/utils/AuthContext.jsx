// utils/AuthContext.js

import { createContext, useContext, useState } from "react";

// Create authentication context
const AuthContext = createContext(null);

// Authentication provider component
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    role: null,
    userId: null,
    token: null,
  });

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  // console.log("Auth Context:", context); // Add this line
  return context;
};