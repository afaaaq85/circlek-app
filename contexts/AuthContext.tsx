import React, { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';
import config from '@/config/config';

interface User {
  id: string;
  username: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  // const [user, setUser] = useState<User | null>(null);

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    try {
      const response = await axios.post(
        `${config.BASE_ROUTE}/login/`,
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      let userRole = '';
      if (response.data.role === 'Super Admin') {
        userRole = 'Super Admin';
      } else if (response.data.role === 'Agent') {
        userRole = 'Agent';
      } else {
        userRole = 'Viewer';
      }

      setUser({
        id: '1',
        username,
        role: userRole,
      });
      console.log('login response successfull', response.data);
      return true;
    } catch (error) {
      console.error('login error', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
