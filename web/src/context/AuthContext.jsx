/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useEffect, useState } from "react";
import API from "../services/api";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isAuthReady, setIsAuthReady] = useState(!localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser);
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  });

  useEffect(() => {
    if (!token) {
      setIsAuthReady(true);
      return;
    }

    let ignore = false;

    const loadCurrentUser = async () => {
      try {
        const response = await API.get("/auth/me");

        if (!ignore) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
          setUser(response.data.user);
        }
      } catch {
        if (!ignore) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setToken(null);
          setUser(null);
        }
      } finally {
        if (!ignore) {
          setIsAuthReady(true);
        }
      }
    };

    loadCurrentUser();

    return () => {
      ignore = true;
    };
  }, [token]);

  const login = useCallback((token, userData) => {
    localStorage.setItem("token", token);
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    }
    setToken(token);
    setIsAuthReady(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setIsAuthReady(true);
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, isAuthReady, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
