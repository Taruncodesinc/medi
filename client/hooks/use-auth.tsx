import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export interface AuthUser { id: string; name: string; role: string }

export function useAuth() {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const raw = localStorage.getItem("auth_user");
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "auth_user") {
        try { setUser(e.newValue ? JSON.parse(e.newValue) : null); } catch { setUser(null); }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function saveTokens(access: string, refresh: string, authUser: AuthUser) {
    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);
    localStorage.setItem("auth_user", JSON.stringify(authUser));
    setUser(authUser);
  }

  async function logout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('auth_user');
    setUser(null);
    navigate('/');
  }

  return { user, saveTokens, logout };
}
