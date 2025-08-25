import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
        setIsLoggedIn(true);
      } catch (err) {
        console.error("Invalid token", err);
        localStorage.removeItem("access");
        setUser(null);
        setIsLoggedIn(false);
      }
    } else {
      setUser(null);
      setIsLoggedIn(false);
    }
    setLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem("access", token);
    try {
      const decoded = jwtDecode(token);
      setUser(decoded);
      setIsLoggedIn(true);
    } catch (err) {
      console.error("Invalid token", err);
      setUser(null);
      setIsLoggedIn(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("access");
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        isStaff: user?.is_staff || false,
        isAdmin: user?.is_superuser || false,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
