import React, { createContext, useContext, useEffect, useState } from "react";

const LOCAL_KEY = "photolab_user";
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });

  useEffect(() => {
    try {
      if (user) localStorage.setItem(LOCAL_KEY, JSON.stringify(user));
      else localStorage.removeItem(LOCAL_KEY);
    } catch {}
  }, [user]);

  const login = async ({ email, password }) => {
    if (!email || !password) throw new Error("Email and password are required.");
    await new Promise(r => setTimeout(r, 350)); // fake delay
    const fakeUser = { id: "local-" + Math.random().toString(36).slice(2,9), name: email.split("@")[0] || "Guest", email };
    setUser(fakeUser);
    return fakeUser;
  };

  const logout = () => setUser(null);

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() { return useContext(AuthContext); }

 