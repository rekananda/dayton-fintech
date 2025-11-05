'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  email: string;
  name: string;
  role: 'admin';
}

interface RegisteredUser {
  email: string;
  password: string;
  name: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; message: string }>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in on mount
    const checkAuth = () => {
      const storedUser = localStorage.getItem('auth_user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Error parsing stored user:', error);
          localStorage.removeItem('auth_user');
        }
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simple demo authentication
    // Dalam production, ini harus menggunakan API backend yang proper
    
    // Check default admin
    if (email === 'admin' && password === 'admin') {
      const userData: User = {
        email: 'admin@dayton.com',
        name: 'Administrator',
        role: 'admin',
      };
      
      const token = 'demo_token_' + Date.now();
      
      setUser(userData);
      localStorage.setItem('auth_user', JSON.stringify(userData));
      localStorage.setItem('auth_token', token);
      
      // Set cookie for middleware
      document.cookie = `auth_token=${token}; path=/; max-age=86400; SameSite=Lax`;
      
      return true;
    }
    
    // Check registered users in localStorage
    const registeredUsersStr = localStorage.getItem('registered_users');
    if (registeredUsersStr) {
      try {
        const registeredUsers: RegisteredUser[] = JSON.parse(registeredUsersStr);
        const foundUser = registeredUsers.find(
          (u) => u.email === email && u.password === password
        );
        
        if (foundUser) {
          const userData: User = {
            email: foundUser.email,
            name: foundUser.name,
            role: 'admin',
          };
          
          const token = 'demo_token_' + Date.now();
          
          setUser(userData);
          localStorage.setItem('auth_user', JSON.stringify(userData));
          localStorage.setItem('auth_token', token);
          
          // Set cookie for middleware
          document.cookie = `auth_token=${token}; path=/; max-age=86400; SameSite=Lax`;
          
          return true;
        }
      } catch (error) {
        console.error('Error parsing registered users:', error);
      }
    }
    
    return false;
  };

  const register = async (email: string, password: string, name: string): Promise<{ success: boolean; message: string }> => {
    try {
      // Check if email already exists
      const registeredUsersStr = localStorage.getItem('registered_users');
      let registeredUsers: RegisteredUser[] = [];
      
      if (registeredUsersStr) {
        registeredUsers = JSON.parse(registeredUsersStr);
      }
      
      // Check if email is already registered
      const emailExists = registeredUsers.some((u) => u.email === email);
      if (emailExists || email === 'admin') {
        return { success: false, message: 'Email sudah terdaftar' };
      }
      
      // Add new user
      registeredUsers.push({
        email,
        password,
        name,
        createdAt: new Date().toISOString(),
      });
      
      localStorage.setItem('registered_users', JSON.stringify(registeredUsers));
      
      return { success: true, message: 'Registrasi berhasil! Silakan login.' };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Terjadi kesalahan saat registrasi' };
    }
  };

  const changePassword = async (oldPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    if (!user) {
      return { success: false, message: 'User tidak ditemukan' };
    }
    
    try {
      // For default admin
      if (user.email === 'admin@dayton.com') {
        return { success: false, message: 'Password admin default tidak dapat diubah' };
      }
      
      // Check registered users
      const registeredUsersStr = localStorage.getItem('registered_users');
      if (registeredUsersStr) {
        const registeredUsers: RegisteredUser[] = JSON.parse(registeredUsersStr);
        const userIndex = registeredUsers.findIndex(
          (u) => u.email === user.email && u.password === oldPassword
        );
        
        if (userIndex === -1) {
          return { success: false, message: 'Password lama tidak sesuai' };
        }
        
        // Update password
        registeredUsers[userIndex].password = newPassword;
        localStorage.setItem('registered_users', JSON.stringify(registeredUsers));
        
        return { success: true, message: 'Password berhasil diubah' };
      }
      
      return { success: false, message: 'User tidak ditemukan' };
    } catch (error) {
      console.error('Change password error:', error);
      return { success: false, message: 'Terjadi kesalahan saat mengubah password' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
    
    // Remove cookie
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    
    router.push('/backoffice/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, changePassword, logout, isLoading }}>
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

// Helper function to check if user is authenticated (for server-side)
export function checkAuth(): boolean {
  if (typeof window === 'undefined') return false;
  
  const token = localStorage.getItem('auth_token');
  const user = localStorage.getItem('auth_user');
  
  return !!(token && user);
}

