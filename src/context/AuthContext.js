import { createContext, useState } from 'react';

export const AuthContext = createContext();

const API_URL = "http://localhost:5196/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('biletbul_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email, sifre) => {
    try {
      const res = await fetch(`${API_URL}/Auth/giris`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, sifre }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }

      const data = await res.json();
      
      const kullanici = {
        id: data.id,
        name: data.ad,
        email: email,
        role: data.rol, // 'admin', 'organizator', 'kullanici'
        token: data.token,
        tickets: []
      };

      setUser(kullanici);
      localStorage.setItem('biletbul_user', JSON.stringify(kullanici));
      return { basarili: true };
    } catch (err) {
      return { basarili: false, hata: err.message };
    }
  };

  const register = async (ad, email, sifre) => {
    try {
      const res = await fetch(`${API_URL}/Auth/kayit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ad, email, sifre }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }

      // Kayıt başarılıysa otomatik giriş yap
      return await login(email, sifre);
    } catch (err) {
      return { basarili: false, hata: err.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('biletbul_user');
  };

  const addTicket = (ticket) => {
    if (user) {
      const guncellendi = { ...user, tickets: [ticket, ...user.tickets] };
      setUser(guncellendi);
      localStorage.setItem('biletbul_user', JSON.stringify(guncellendi));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, addTicket }}>
      {children}
    </AuthContext.Provider>
  );
};