'use client';

import MainButton from "@/components/Atoms/Button/MainButton";
import MainInput from "@/components/Atoms/FormInput/MainInput";
import PasswordInput from "@/components/Atoms/FormInput/PasswordInput";
import MainText from "@/components/Atoms/MainText";
import AuthLayout from "@/components/layouts/AuthLayout";
import { useAuth } from "@/config/auth-context";
import { Alert, Group, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconAlertCircle, IconCheck } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const form = useForm({
    initialValues: {
      username: '',
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'uncontrolled',
    validateInputOnChange: true,
    validate: {
      username: (value) => (value.length >= 3 ? null : 'Username minimal 3 karakter'),
      name: (value) => (value.length >= 3 ? null : 'Nama minimal 3 karakter'),
      email: (value) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : 'Email tidak valid',
      password: (value) => (value.length >= 5 ? null : 'Password minimal 5 karakter'),
      confirmPassword: (value, values) => 
        value === values.password ? null : 'Password tidak sama',
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
      setIsLoading(true);
      setError('');
  
      try {
        const result = await register(values.username, values.name, values.email, values.password);
        
        if (result.success) {
          notifications.show({
            title: 'Registrasi Berhasil!',
            message: result.message,
            color: 'teal',
            icon: <IconCheck size={18} />,
          });
          
          router.replace('/backoffice/login');
        } else {
          setError(result.message);
          notifications.show({
            title: 'Registrasi Gagal',
            message: result.message,
            color: 'red',
          });
        }
      } catch (error) {
        console.error('Register error:', error);
        setError('Terjadi kesalahan. Silakan coba lagi.');
      } finally {
        setIsLoading(false);
      }
    };

  return (
    <AuthLayout>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <MainText mb={32} variant="heading3" ta="center">Sign up</MainText>
          <MainInput
            label="Nama Lengkap"
            placeholder="Enter name"
            required
            {...form.getInputProps('name')}
          />
          <MainInput
            label="E-mail"
            placeholder="Enter e-mail"
            required
            {...form.getInputProps('email')}
          />
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
          <PasswordInput
            label="Konfirmasi Password"
            placeholder="Enter confirm password"
            required
            {...form.getInputProps('confirmPassword')}
          />

          {error && (
            <Alert 
              icon={<IconAlertCircle size={18} />} 
              title="Registrasi Gagal" 
              color="red"
              variant="light"
            >
              {error}
            </Alert>
          )}

          <MainButton type="submit" fullWidth loading={isLoading} mt={32}>
            Daftar
          </MainButton>

          <Group justify="center" gap={4}>
            <MainText variant="body" ta="center">
              Sudah punya akun?
            </MainText>
            <MainText className="cursor-pointer" variant='body-bold' color="primary" onClick={() => router.push('/backoffice/login')}>
              Login disini
            </MainText>
          </Group>
        </Stack>
      </form>
    </AuthLayout>
  );
  // return (
  //   <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
  //     <Container size="xs" className="w-full">
  //       <Stack gap="lg">
  //         {/* Logo & Title */}
  //         <div className="text-center">
  //           <Group justify="center" mb="md">
  //             <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl"></div>
  //           </Group>
  //           <Title order={1} className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
  //             Daftar Admin Baru
  //           </Title>
  //           <Text c="dimmed" size="sm">
  //             Dayton Fintech - Backoffice Registration
  //           </Text>
  //         </div>

  //         {/* Register Card */}
  //         <Card shadow="xl" padding="xl" radius="lg" withBorder>
  //           <form onSubmit={form.onSubmit(handleSubmit)}>
  //             <Stack gap="md">
  //               <TextInput
  //                 label="Nama Lengkap"
  //                 placeholder="Masukkan nama lengkap"
  //                 leftSection={<IconUser size={18} />}
  //                 size="md"
  //                 required
  //                 {...form.getInputProps('name')}
  //               />

  //               <TextInput
  //                 label="Email / Username"
  //                 placeholder="Masukkan email atau username"
  //                 leftSection={<IconMail size={18} />}
  //                 size="md"
  //                 required
  //                 {...form.getInputProps('email')}
  //               />

  //               <PasswordInput
  //                 label="Password"
  //                 placeholder="Minimal 5 karakter"
  //                 leftSection={<IconLock size={18} />}
  //                 size="md"
  //                 required
  //                 {...form.getInputProps('password')}
  //               />

  //               <PasswordInput
  //                 label="Konfirmasi Password"
  //                 placeholder="Ulangi password"
  //                 leftSection={<IconLock size={18} />}
  //                 size="md"
  //                 required
  //                 {...form.getInputProps('confirmPassword')}
  //               />

  //               {error && (
  //                 <Alert 
  //                   icon={<IconAlertCircle size={18} />} 
  //                   title="Registrasi Gagal" 
  //                   color="red"
  //                   variant="light"
  //                 >
  //                   {error}
  //                 </Alert>
  //               )}

  //               <Button 
  //                 type="submit" 
  //                 fullWidth 
  //                 size="md"
  //                 variant="gradient"
  //                 gradient={{ from: 'purple', to: 'pink' }}
  //                 loading={isLoading}
  //                 className="mt-2"
  //               >
  //                 Daftar
  //               </Button>
  //             </Stack>
  //           </form>
  //         </Card>

  //         {/* Info */}
  //         <Paper p="md" radius="md" withBorder className="bg-purple-50 dark:bg-gray-800">
  //           <Stack gap="xs">
  //             <Text size="sm" fw={600} className="text-purple-900 dark:text-purple-300">
  //               ℹ️ Informasi:
  //             </Text>
  //             <Text size="xs" className="text-purple-700 dark:text-purple-400">
  //               • Akun baru langsung tersimpan ke database
  //             </Text>
  //             <Text size="xs" className="text-purple-700 dark:text-purple-400">
  //               • Setelah registrasi, gunakan email/username dan password untuk login
  //             </Text>
  //           </Stack>
  //         </Paper>

  //         {/* Login Link */}
  //         <div className="text-center">
  //           <Text size="sm" c="dimmed">
  //             Sudah punya akun?{' '}
  //             <span 
  //               className="text-purple-600 dark:text-purple-400 cursor-pointer hover:underline font-semibold"
  //               onClick={() => router.push('/backoffice/login')}
  //             >
  //               Login disini
  //             </span>
  //           </Text>
  //         </div>

  //         {/* Back to Home Link */}
  //         <div className="text-center">
  //           <Text 
  //             size="sm" 
  //             c="dimmed" 
  //             className="cursor-pointer hover:underline"
  //             onClick={() => router.push('/')}
  //           >
  //             ← Kembali ke Halaman Utama
  //           </Text>
  //         </div>
  //       </Stack>
  //     </Container>
  //   </div>
  // );
}

