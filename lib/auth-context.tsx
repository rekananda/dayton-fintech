'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  email: string;
  name: string;
  role: 'admin' | 'ADMIN';
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

  // Cookie helpers
  const getCookie = (name: string): string | null => {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
    };
  const setCookie = (name: string, value: string, maxAgeSeconds = 60 * 60 * 24) => {
    const isProd = typeof window !== 'undefined' && window.location.protocol === 'https:';
    document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax${isProd ? '; Secure' : ''}`;
  };
  const deleteCookie = (name: string) => {
    document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
  };

  const clearSessionArtifacts = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_token');
    } catch {}
    deleteCookie('auth_user');
    deleteCookie('auth_token');
  }, []);

  useEffect(() => {
    // Check if user is logged in on mount
    const checkAuth = () => {
      // Prefer cookies as source of truth
      const userCookie = getCookie('auth_user');
      if (userCookie) {
        try {
          setUser(JSON.parse(userCookie));
        } catch {
          // fallback cleanup
          clearSessionArtifacts();
        }
      } else {
        // backward compatibility with previous localStorage implementation
        const storedUser = typeof window !== 'undefined' ? localStorage.getItem('auth_user') : null;
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
            setCookie('auth_user', storedUser);
            const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
            if (token) setCookie('auth_token', token);
          } catch {
            clearSessionArtifacts();
          }
        }
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, [clearSessionArtifacts]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success || !data.user) {
        return false;
      }

      const userData: User = data.user;

      setUser(userData);

      // Mirror to localStorage for backward compatibility with legacy reads
      try {
        localStorage.setItem('auth_user', JSON.stringify(userData));
        if (data.token) {
          localStorage.setItem('auth_token', data.token);
        }
      } catch {}

      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      if (response.status === 401) {
        clearSessionArtifacts();
        router.push('/backoffice/login');
        return { success: false, message: 'Sesi berakhir. Silakan login kembali.' };
      }

      const data = await response.json().catch(() => null);
      const success = Boolean(response.ok && data?.success);

      return {
        success,
        message: data?.message ?? (success ? 'Registrasi berhasil! Silakan login.' : 'Registrasi gagal.'),
      };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Terjadi kesalahan saat registrasi' };
    }
  };

  const changePassword = async (
    oldPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> => {
    if (!user) {
      return { success: false, message: 'User tidak ditemukan' };
    }

    try {
      const token =
        getCookie('auth_token') ??
        (typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null);

      if (!token) {
        clearSessionArtifacts();
        router.push('/backoffice/login');
        return { success: false, message: 'Sesi tidak valid. Silakan login ulang.' };
      }

      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      if (response.status === 401) {
        clearSessionArtifacts();
        router.push('/backoffice/login');
        return { success: false, message: 'Sesi berakhir. Silakan login kembali.' };
      }

      const data = await response.json().catch(() => null);
      const success = Boolean(response.ok && data?.success);

      return {
        success,
        message: data?.message ?? (success ? 'Password berhasil diperbarui.' : 'Gagal memperbarui password.'),
      };
    } catch (error) {
      console.error('Change password error:', error);
      return { success: false, message: 'Terjadi kesalahan saat mengubah password' };
    }
  };

  const logout = () => {
    clearSessionArtifacts();
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
  if (typeof document === 'undefined') return false;
  const getCookie = (name: string): string | null => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  };
  const token = getCookie('auth_token');
  const user = getCookie('auth_user');
  return Boolean(token && user);
}

