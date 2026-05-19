import { createContext, useContext, useState, useCallback } from "react";
import { API_BASE } from "../config";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("mkt_user")); }
    catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem("mkt_token") || null);

  const login = (userData, tok) => {
    setUser(userData);
    setToken(tok);
    localStorage.setItem("mkt_user", JSON.stringify(userData));
    localStorage.setItem("mkt_token", tok);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("mkt_user");
    localStorage.removeItem("mkt_token");
  };

  const authFetch = useCallback(async (url, options = {}) => {
    const headers = { ...options.headers };
    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const res = await fetch(`${API_BASE}${url}`, { ...options, headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Request failed");
    return data;
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, authFetch }}>
      {children}
    </AuthContext.Provider>
  );
}