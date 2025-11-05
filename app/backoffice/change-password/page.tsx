'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Container, 
  Card, 
  Title, 
  Text, 
  PasswordInput, 
  Button, 
  Stack,
  Alert,
  Paper,
  Group
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconLock, IconAlertCircle, IconCheck, IconKey } from '@tabler/icons-react';
import { useAuth } from '@/lib/auth-context';
import { notifications } from '@mantine/notifications';

export default function ChangePasswordPage() {
  const router = useRouter();
  const { changePassword, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const form = useForm({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validate: {
      oldPassword: (value) => (value.length >= 3 ? null : 'Password lama harus diisi'),
      newPassword: (value) => (value.length >= 5 ? null : 'Password baru minimal 5 karakter'),
      confirmPassword: (value, values) => 
        value === values.newPassword ? null : 'Password tidak sama',
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setIsLoading(true);
    setError('');

    try {
      const result = await changePassword(values.oldPassword, values.newPassword);
      
      if (result.success) {
        notifications.show({
          title: 'Berhasil! ✅',
          message: result.message,
          color: 'teal',
          icon: <IconCheck size={18} />,
        });
        
        form.reset();
        
        // Redirect to dashboard after 1.5 seconds
        setTimeout(() => {
          router.push('/backoffice');
        }, 1500);
      } else {
        setError(result.message);
        notifications.show({
          title: 'Gagal',
          message: result.message,
          color: 'red',
        });
      }
    } catch (error) {
      console.error('Change password error:', error);
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <Container size="xs" className="w-full">
        <Stack gap="lg">
          {/* Logo & Title */}
          <div className="text-center">
            <Group justify="center" mb="md">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-600 rounded-xl flex items-center justify-center">
                <IconKey size={28} color="white" />
              </div>
            </Group>
            <Title order={1} className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Ubah Password
            </Title>
            <Text c="dimmed" size="sm">
              {user?.name} - {user?.email}
            </Text>
          </div>

          {/* Change Password Card */}
          <Card shadow="xl" padding="xl" radius="lg" withBorder>
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <Stack gap="md">
                <PasswordInput
                  label="Password Lama"
                  placeholder="Masukkan password lama"
                  leftSection={<IconLock size={18} />}
                  size="md"
                  required
                  {...form.getInputProps('oldPassword')}
                />

                <PasswordInput
                  label="Password Baru"
                  placeholder="Minimal 5 karakter"
                  leftSection={<IconKey size={18} />}
                  size="md"
                  required
                  {...form.getInputProps('newPassword')}
                />

                <PasswordInput
                  label="Konfirmasi Password Baru"
                  placeholder="Ulangi password baru"
                  leftSection={<IconKey size={18} />}
                  size="md"
                  required
                  {...form.getInputProps('confirmPassword')}
                />

                {error && (
                  <Alert 
                    icon={<IconAlertCircle size={18} />} 
                    title="Gagal" 
                    color="red"
                    variant="light"
                  >
                    {error}
                  </Alert>
                )}

                <Group grow>
                  <Button 
                    variant="light"
                    color="gray"
                    size="md"
                    onClick={() => router.push('/backoffice')}
                  >
                    Batal
                  </Button>
                  <Button 
                    type="submit" 
                    size="md"
                    variant="gradient"
                    gradient={{ from: 'blue', to: 'teal' }}
                    loading={isLoading}
                  >
                    Ubah Password
                  </Button>
                </Group>
              </Stack>
            </form>
          </Card>

          {/* Info */}
          <Paper p="md" radius="md" withBorder className="bg-blue-50 dark:bg-gray-800">
            <Stack gap="xs">
              <Text size="sm" fw={600} className="text-blue-900 dark:text-blue-300">
                ℹ️ Informasi:
              </Text>
              <Text size="xs" className="text-blue-700 dark:text-blue-400">
                • Password harus minimal 5 karakter
              </Text>
              <Text size="xs" className="text-blue-700 dark:text-blue-400">
                • Pastikan Anda mengingat password baru
              </Text>
              {user?.email === 'admin@dayton.com' && (
                <Text size="xs" className="text-orange-600 dark:text-orange-400 font-semibold">
                  ⚠️ Password admin default tidak dapat diubah
                </Text>
              )}
            </Stack>
          </Paper>

          {/* Back to Dashboard Link */}
          <div className="text-center">
            <Text 
              size="sm" 
              c="dimmed" 
              className="cursor-pointer hover:underline"
              onClick={() => router.push('/backoffice')}
            >
              ← Kembali ke Dashboard
            </Text>
          </div>
        </Stack>
      </Container>
    </div>
  );
}

