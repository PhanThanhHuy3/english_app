import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';
import { mockUsers } from '../mockData';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: Role) => void;
  logout: () => void;
  register: (user: Omit<User, 'id'>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('authUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [usersDb, setUsersDb] = useState<User[]>(() => {
    const saved = localStorage.getItem('usersDb');
    if (saved) {
      const parsed = JSON.parse(saved);
      // If legacy data without passwords, fallback to mockUsers
      if (parsed.length > 0 && parsed[0].password === undefined) {
        return mockUsers;
      }
      return parsed;
    }
    return mockUsers;
  });

  useEffect(() => {
    localStorage.setItem('usersDb', JSON.stringify(usersDb));
  }, [usersDb]);

  const login = (email: string, password: string, role: Role) => {
    const foundUser = usersDb.find(u => u.email === email && u.password === password && u.role === role && u.isActive);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('authUser', JSON.stringify(foundUser));
    } else {
      alert('Invalid credentials or inactive account.');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authUser');
  };

  const register = (newUser: Omit<User, 'id'>) => {
    const exists = usersDb.find(u => u.email === newUser.email);
    if (exists) {
      alert('Email already in use.');
      return;
    }
    const userWithId = { ...newUser, id: Date.now().toString() };
    setUsersDb([...usersDb, userWithId]);
    alert('Registration successful! Please login.');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
