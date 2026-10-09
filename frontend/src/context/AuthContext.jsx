import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCurrentUser = async () => {
    try {
      const response = await API.get("/users/current-user");
      setUser(response.data.data.user);
    } catch (error) {
      if (error.response?.status === 401) {
        setUser(null);
      } else {
        console.error("Failed to fetch current user:", error.message);
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();

    const handleLogout = () => {
      setUser(null);
      navigate("/login");
    };

    window.addEventListener("auth:logout", handleLogout);

    return () => {
      window.removeEventListener("auth:logout", handleLogout);
    };
  }, [navigate]);

  const register = async (fullName, email, password, role) => {
    const response = await API.post("/users/register", {
      fullName,
      email,
      password,
      role,
    });
    setUser(response.data.data.user);
    return response.data;
  };

  const login = async (email, password) => {
    const response = await API.post("/users/login", { email, password });
    setUser(response.data.data.user);
    return response.data;
  };

  const logout = async () => {
    try {
      await API.post("/users/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      navigate("/login");
    }
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
