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
import { useRouter, notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { registerValidator } from "@/hooks/validator/registerValidation";
import mainConfig from "@/config";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { canRegisterUser } = mainConfig;

  useEffect(() => {
    if (!canRegisterUser) {
      notFound();
    }
  }, [canRegisterUser, router]);

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
    validate: registerValidator,
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
            description="Minimal 8 karakter"
            placeholder="Enter password"
            required
            {...form.getInputProps('password')}
          />
          <PasswordInput
            label="Konfirmasi Password"
            description="Ulangi password"
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
}

