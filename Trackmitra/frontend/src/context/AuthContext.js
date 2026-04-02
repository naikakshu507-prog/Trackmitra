import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const LS_USERS   = 'tmr_users';
const LS_SESSION = 'tmr_session';

const getUsers    = () => { try { return JSON.parse(localStorage.getItem(LS_USERS) || '[]'); } catch { return []; } };
const saveUsers   = (u) => localStorage.setItem(LS_USERS, JSON.stringify(u));
const getSession  = () => { try { return JSON.parse(localStorage.getItem(LS_SESSION) || 'null'); } catch { return null; } };
const saveSession = (u) => localStorage.setItem(LS_SESSION, JSON.stringify(u));
const clearSess   = () => localStorage.removeItem(LS_SESSION);

const simpleHash = (str) => {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h) ^ str.charCodeAt(i);
  return (h >>> 0).toString(16);
};

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const session = getSession();
      if (session && session.id) setUser(session);
    } catch {}
    setLoading(false);
  }, []);

  const register = async (name, email, password, phone) => {
    // Validate inputs
    if (!name || !name.trim()) throw new Error('Please enter your name.');
    if (!email || !email.trim()) throw new Error('Please enter your email.');
    if (!password || password.length < 6) throw new Error('Password must be at least 6 characters.');

    const cleanEmail = email.toLowerCase().trim();
    const cleanName  = name.trim();

    const users = getUsers();
    if (users.find((u) => u.email === cleanEmail)) {
      throw new Error('An account with this email already exists. Please sign in instead.');
    }

    const newUser = {
      id:           Date.now().toString(),
      name:         cleanName,
      email:        cleanEmail,
      phone:        (phone || '').trim(),
      passwordHash: simpleHash(password),
      createdAt:    new Date().toISOString(),
    };

    saveUsers([...users, newUser]);

    const sessionUser = { id: newUser.id, name: newUser.name, email: newUser.email, phone: newUser.phone };
    saveSession(sessionUser);
    setUser(sessionUser);
    return sessionUser;
  };

  const login = async (email, password) => {
    if (!email || !password) throw new Error('Please enter your email and password.');

    const cleanEmail = email.toLowerCase().trim();
    const users = getUsers();
    const found = users.find((u) => u.email === cleanEmail);

    if (!found) throw new Error('No account found with this email. Please register first.');
    if (found.passwordHash !== simpleHash(password)) throw new Error('Incorrect password. Please try again.');

    const sessionUser = { id: found.id, name: found.name, email: found.email, phone: found.phone };
    saveSession(sessionUser);
    setUser(sessionUser);
    return sessionUser;
  };

  const logout = () => {
    clearSess();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
