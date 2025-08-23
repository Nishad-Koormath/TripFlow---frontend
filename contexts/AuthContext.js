import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading]=useState(true)

  useEffect(() => {
    const token = localStorage.getItem("access");
    setIsLoggedIn(!!token);
    setLoading(false)
  }, []);

  const login = (token) => {
    localStorage.setItem("access", token);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("access");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
