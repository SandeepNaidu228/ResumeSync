import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  loginUser,
  registerUser,
  getCurrentUser,
} from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [token, setToken] = useState(() => {
    return localStorage.getItem("resumesync_token");
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await getCurrentUser(token);

        setUser(data.user);
      } catch (error) {
        localStorage.removeItem("resumesync_token");
        localStorage.removeItem("resumesync_user");

        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, [token]);

  const register = async (userData) => {
    const data = await registerUser(userData);

    localStorage.setItem(
      "resumesync_token",
      data.token
    );

    localStorage.setItem(
      "resumesync_user",
      JSON.stringify(data.user)
    );

    setToken(data.token);
    setUser(data.user);

    return data;
  };

  const login = async (credentials) => {
    const data = await loginUser(credentials);

    localStorage.setItem(
      "resumesync_token",
      data.token
    );

    localStorage.setItem(
      "resumesync_user",
      JSON.stringify(data.user)
    );

    setToken(data.token);
    setUser(data.user);

    return data;
  };

  const logout = () => {
    localStorage.removeItem("resumesync_token");
    localStorage.removeItem("resumesync_user");
    localStorage.removeItem("resumesync_remember");

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: Boolean(user && token),
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};