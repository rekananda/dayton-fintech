'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Stack,
  Alert,
  Group,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import {IconAlertCircle } from '@tabler/icons-react';
import { useAuth } from '@/config/auth-context';
import { notifications } from '@mantine/notifications';
import AuthLayout from '@/components/layouts/AuthLayout';
import MainButton from '@/components/Atoms/Button/MainButton';
import MainInput from '@/components/Atoms/FormInput/MainInput';
import PasswordInput from '@/components/Atoms/FormInput/PasswordInput';
import MainText from '@/components/Atoms/MainText';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const form = useForm({
    initialValues: {
      username: '',
      password: '',
    },
    validate: {
      username: (value) => (value.length >= 3 ? null : 'Username minimal 3 karakter'),
      password: (value) => (value.length >= 3 ? null : 'Password minimal 3 karakter'),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setIsLoading(true);
    setError('');

    try {
      const success = await login(values.username, values.password);
      
      if (success) {
        notifications.show({
          title: 'Login Berhasil',
          message: 'Selamat datang di Backoffice Dayton Fintech!',
          color: 'teal',
        });
        
        router.push('/backoffice');
      } else {
        setError('Username atau password salah. Silakan coba lagi.');
        notifications.show({
          title: 'Login Gagal',
          message: 'Username atau password yang Anda masukkan salah.',
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

  return (
    <AuthLayout>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <MainText mb={32} variant="heading3" ta="center">Sign in</MainText>
          <MainInput
            label="Username"
            placeholder="Enter username"
            required
            {...form.getInputProps('username')}
          />
          <PasswordInput
            label="Password"
            placeholder="Enter password"
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

          <MainButton type="submit" fullWidth loading={isLoading} mt={32}>
            Login
          </MainButton>

          <Group justify="center" gap={4}>
            <MainText variant="body" ta="center">
              Belum punya akun?
            </MainText>
            <MainText className="cursor-pointer" variant='body-bold' color="primary" onClick={() => router.push('/backoffice/register')}>
              Daftar disini
            </MainText>
          </Group>
        </Stack>
      </form>
    </AuthLayout>
  );
}

