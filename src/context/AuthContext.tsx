import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: Role) => Promise<void>;
  logout: () => void;
  register: (user: Omit<User, 'id'>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define API URL. In production, this can point to the real backend URL.
const API_URL = 'http://localhost:5000/api';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('authUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (email: string, password: string, role: Role) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        alert(data.message || 'Login failed');
        return;
      }

      // Check if role matches what they requested (e.g. learner vs manager)
      if (data.user.role !== role) {
        alert(`You are not registered as a ${role}`);
        return;
      }

      // Save user & token
      const authUser: User = {
        id: data.user.id,
        fullName: data.user.name,
        email: data.user.email,
        role: data.user.role as Role,
        password: '', // Don't store password in context
        isActive: true
      };

      setUser(authUser);
      localStorage.setItem('authUser', JSON.stringify(authUser));
      localStorage.setItem('token', data.token);
      
    } catch (error) {
      console.error(error);
      alert('Error connecting to the server');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authUser');
    localStorage.removeItem('token');
  };

  const register = async (newUser: Omit<User, 'id'>) => {
    try {
      // Map fullName from frontend to name for backend
      const payload = {
        name: newUser.fullName,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role
      };

      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        alert(data.message || 'Registration failed');
        return;
      }

      alert('Registration successful! Please login.');
    } catch (error) {
      console.error(error);
      alert('Error connecting to the server');
    }
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
