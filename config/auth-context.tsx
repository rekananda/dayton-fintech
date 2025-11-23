'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContextType, UserT } from './types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserT | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const getCookie = (name: string): string | null => {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
    };
  const deleteCookie = (name: string) => {
    document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
  };

  const clearSessionArtifacts = useCallback(() => {
    setUser(null);
    deleteCookie('auth_user');
    deleteCookie('auth_token');
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      const userCookie = getCookie('auth_user');
      const userCookieDecoded = userCookie ? decodeURIComponent(userCookie) : null;

      if (userCookieDecoded) {
        try {
          setUser(JSON.parse(userCookieDecoded));
        } catch {
          clearSessionArtifacts();
        }
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, [clearSessionArtifacts]);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success || !data.user) {
        return false;
      }

      const userData: UserT = data.user as UserT;
      setUser(userData);

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

