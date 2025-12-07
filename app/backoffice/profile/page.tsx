'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ControlLayout from "@/components/layouts/ControlLayout";
import { Stack, Paper } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import { useAuth } from "@/config/auth-context";
import ProfileForm, { ProfileDataT } from "@/components/Molecules/Forms/ProfileForm";

const ProfilePage = () => {
  const router = useRouter();
  const { updateProfile, user, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: Partial<ProfileDataT>) => {
    setIsLoading(true);

    try {
      if (!values.email || !values.username || !values.name) {
        notifications.show({
          title: 'Gagal',
          message: 'Email, username, dan nama wajib diisi',
          color: 'red',
        });
        setIsLoading(false);
        return;
      }

      const result = await updateProfile(values.email, values.username, values.name);
      
      if (result.success) {
        notifications.show({
          title: 'Berhasil! ✅',
          message: result.message,
          color: 'teal',
          icon: <IconCheck size={18} />,
        });
      } else {
        notifications.show({
          title: 'Gagal',
          message: result.message,
          color: 'red',
        });
      }
    } catch (error) {
      console.error('Update profile error:', error);
      notifications.show({
        title: 'Gagal',
        message: 'Terjadi kesalahan. Silakan coba lagi.',
        color: 'red',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/backoffice');
  };

  if (authLoading || !user) {
    return (
      <Stack>
        <ControlLayout title="Profile" />
        <Paper p="md" radius="md" withBorder maw={500}>
          <Stack gap="md">
            <div>Loading...</div>
          </Stack>
        </Paper>
      </Stack>
    );
  }

  const defaultValues: Partial<ProfileDataT> = {
    email: user.email,
    username: user.username,
    name: user.name || '',
  };

  return (
    <Stack>
      <ControlLayout
        title="Profile"
      />
      <Paper p="md" radius="md" withBorder maw={500}>
        <Stack gap="md">
          <ProfileForm
            handleSubmit={handleSubmit}
            handleCancel={handleCancel}
            isLoading={isLoading}
            forEdit={true}
            defaultValues={defaultValues}
          />
        </Stack>
      </Paper>
    </Stack>
  );
};

export default ProfilePage;

