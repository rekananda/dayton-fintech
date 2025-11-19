'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Container, 
  Card, 
  Title, 
  Text, 
  TextInput, 
  PasswordInput, 
  Button, 
  Stack,
  Alert,
  Paper,
  Group,
  Loader
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconLock, IconMail, IconAlertCircle } from '@tabler/icons-react';
import { useAuth } from '@/lib/auth-context';
import { notifications } from '@mantine/notifications';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const clearClientSession = () => {
    if (typeof document !== 'undefined') {
      document.cookie = 'auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
      document.cookie = 'auth_user=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    }
    try {
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_token');
    } catch {}
  };

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => (value.length >= 3 ? null : 'Username minimal 3 karakter'),
      password: (value) => (value.length >= 3 ? null : 'Password minimal 3 karakter'),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setIsLoading(true);
    setError('');

    try {
      const success = await login(values.email, values.password);
      
      if (success) {
        notifications.show({
          title: 'Login Berhasil',
          message: 'Selamat datang di Backoffice Dayton Fintech!',
          color: 'teal',
        });
        
        router.push('/backoffice');
      } else {
        setError('Email atau password salah. Silakan coba lagi.');
        notifications.show({
          title: 'Login Gagal',
          message: 'Email atau password yang Anda masukkan salah.',
          color: 'red',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/session', { cache: 'no-store' });
        if (!isMounted) return;

        if (response.ok) {
          router.replace('/backoffice');
          return;
        }

        if (response.status === 401) {
          clearClientSession();
        }
      } catch (error) {
        console.error('Session check error:', error);
        clearClientSession();
      } finally {
        if (isMounted) {
          setIsCheckingSession(false);
        }
      }
    };

    checkSession();

    return () => {
      isMounted = false;
    };
  }, [router]);

  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <Stack align="center" gap="sm">
          <Loader color="blue" />
          <Text c="dimmed" size="sm">
            Memeriksa sesi...
          </Text>
        </Stack>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <Container size="xs" className="w-full">
        <Stack gap="lg">
          {/* Logo & Title */}
          <div className="text-center">
            <Group justify="center" mb="md">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl"></div>
            </Group>
            <Title order={1} className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Backoffice Login
            </Title>
            <Text c="dimmed" size="sm">
              Dayton Fintech - Admin Panel
            </Text>
          </div>

          {/* Login Card */}
          <Card shadow="xl" padding="xl" radius="lg" withBorder>
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <Stack gap="md">
                <TextInput
                  label="Username"
                  placeholder="admin"
                  leftSection={<IconMail size={18} />}
                  size="md"
                  required
                  {...form.getInputProps('email')}
                />

                <PasswordInput
                  label="Password"
                  placeholder="Masukkan password"
                  leftSection={<IconLock size={18} />}
                  size="md"
                  required
                  {...form.getInputProps('password')}
                />

                {error && (
                  <Alert 
                    icon={<IconAlertCircle size={18} />} 
                    title="Login Gagal" 
                    color="red"
                    variant="light"
                  >
                    {error}
                  </Alert>
                )}

                <Button 
                  type="submit" 
                  fullWidth 
                  size="md"
                  variant="gradient"
                  gradient={{ from: 'blue', to: 'indigo' }}
                  loading={isLoading}
                  className="mt-2"
                >
                  Login
                </Button>
              </Stack>
            </form>
          </Card>

          {/* Demo Credentials Info */}
          <Paper p="md" radius="md" withBorder className="bg-blue-50 dark:bg-gray-800">
            <Stack gap="xs">
              <Text size="sm" fw={600} className="text-blue-900 dark:text-blue-300">
                Demo Credentials:
              </Text>
              <Text size="xs" className="text-blue-700 dark:text-blue-400">
                Username: admin
              </Text>
              <Text size="xs" className="text-blue-700 dark:text-blue-400">
                Password: admin
              </Text>
            </Stack>
          </Paper>

          {/* Register Link */}
          <div className="text-center">
            <Text size="sm" c="dimmed">
              Belum punya akun?{' '}
              <span 
                className="text-blue-600 dark:text-blue-400 cursor-pointer hover:underline font-semibold"
                onClick={() => router.push('/backoffice/register')}
              >
                Daftar disini
              </span>
            </Text>
          </div>

          {/* Back to Home Link */}
          <div className="text-center">
            <Text 
              size="sm" 
              c="dimmed" 
              className="cursor-pointer hover:underline"
              onClick={() => router.push('/')}
            >
              ← Kembali ke Halaman Utama
            </Text>
          </div>
        </Stack>
      </Container>
    </div>
  );
}

