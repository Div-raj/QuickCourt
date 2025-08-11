
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { MOCK_USER, MOCK_FACILITATOR } from '../constants';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<void>;
  facilitatorLogin: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  signup: () => Promise<void>;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('quickcourt_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string): Promise<void> => {
    setLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        if (email === MOCK_USER.email && pass === 'password') {
          const loggedInUser = MOCK_USER;
          setUser(loggedInUser);
          localStorage.setItem('quickcourt_user', JSON.stringify(loggedInUser));
        }
        setLoading(false);
        resolve();
      }, 1000);
    });
  };

  const facilitatorLogin = async (email: string, pass: string): Promise<void> => {
    setLoading(true);
    return new Promise((resolve) => {
        setTimeout(() => {
            if (email === MOCK_FACILITATOR.email && pass === 'password') {
                const loggedInUser = MOCK_FACILITATOR;
                setUser(loggedInUser);
                localStorage.setItem('quickcourt_user', JSON.stringify(loggedInUser));
            }
            setLoading(false);
            resolve();
        }, 1000);
    });
  }

  const signup = async (): Promise<void> => {
    setLoading(true);
    // Mock signup logic
    return new Promise(resolve => {
        setTimeout(() => {
            setLoading(false);
            resolve();
        }, 1500);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('quickcourt_user');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    facilitatorLogin,
    logout,
    signup,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
