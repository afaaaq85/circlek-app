import React, { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';
import config from '@/config/config';

interface User {
  id: string;
  username: string;
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

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    // await new Promise(resolve => setTimeout(resolve, 1000));

    // if (username && password) {
    //   setUser({
    //     id: '1',
    //     username,
    //   });
    //   return true;
    // }
    // return false;

    try {
      const response = await axios.post(`${config.BASE_ROUTE}/login`, {
        username,
        password,
      });
      setUser({
        id: '1',
        username,
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
