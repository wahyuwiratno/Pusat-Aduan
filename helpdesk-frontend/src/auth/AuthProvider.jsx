import { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "../api/auth";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function refreshMe() {
    const token = localStorage.getItem("token");
    if (!token) { setUser(null); setLoading(false); return; }
    try {
      const me = await authApi.me();
      setUser(me);
    } catch {
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(email, password) {
    const res = await authApi.login({ email, password });
    // backend biasanya mengembalikan { token }
    if (res?.token) localStorage.setItem("token", res.token);
    await refreshMe();
  }

  // ✅ BARU: register user, simpan token jika backend mengembalikan token
  async function register(name, email, password) {
    const res = await authApi.register({ name, email, password });
    if (res?.token) {
      localStorage.setItem("token", res.token);
      await refreshMe();
    } else {
      // kalau backend TIDAK mengembalikan token, auto-login setelah register
      await login(email, password);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  useEffect(() => { refreshMe(); }, []);

  return (
    <AuthCtx.Provider value={{ user, loading, login, logout, register, refreshMe }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  return useContext(AuthCtx);
}
