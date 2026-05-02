import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('biletbul_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('biletbul_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('biletbul_user');
    }
  }, [user]);

  const login = (name, email, role = 'user') => {
    setUser({
      id: "u_" + Date.now(),
      name: name || "Demo Kullanıcı",
      email: email || "demo@biletbul.com",
      role: role, // 'user', 'admin', 'organizer'
      tickets: []
    });
  };

  const register = (name, email, role = 'user') => {
    // Sunum amaçlı mock kayıt, anında giriş yapar
    setUser({
      id: "u_" + Date.now(),
      name: name || "Yeni Kullanıcı",
      email: email,
      role: role,
      tickets: []
    });
  };

  const logout = () => {
    setUser(null);
  };

  const addTicket = (ticket) => {
    if (user) {
      setUser(prev => ({
        ...prev,
        tickets: [ticket, ...prev.tickets]
      }));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, addTicket }}>
      {children}
    </AuthContext.Provider>
  );
};
