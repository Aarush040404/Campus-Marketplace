import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(localStorage.getItem("campusmarket_token")));

  useEffect(() => {
    if (!localStorage.getItem("campusmarket_token")) return;
    api("/auth/me")
      .then(({ user: currentUser }) => setUser(currentUser))
      .catch(() => localStorage.removeItem("campusmarket_token"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const clearSession = () => setUser(null);
    window.addEventListener("campusmarket:unauthorized", clearSession);
    return () => window.removeEventListener("campusmarket:unauthorized", clearSession);
  }, []);

  const authenticate = async (mode, formData) => {
    const data = await api(`/auth/${mode}`, {
      method: "POST",
      body: JSON.stringify(formData),
    });
    localStorage.setItem("campusmarket_token", data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("campusmarket_token");
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      login: (credentials) => authenticate("login", credentials),
      register: (details) => authenticate("register", details),
      logout,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// The provider and its companion hook intentionally share this small module.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}

