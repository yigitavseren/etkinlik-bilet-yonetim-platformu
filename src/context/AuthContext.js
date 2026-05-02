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

  const login = (name, email) => {
    setUser({
      id: "u_" + Date.now(),
      name: name || "Demo Kullanıcı",
      email: email || "demo@biletbul.com",
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
    <AuthContext.Provider value={{ user, login, logout, addTicket }}>
      {children}
    </AuthContext.Provider>
  );
};
