import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for the cookie
    const storedUserId = Cookies.get("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
    setLoading(false); // Stop loading once cookie is checked
  }, []);

  return (
    <AuthContext.Provider value={{ userId, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
