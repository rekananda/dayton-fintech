'use client';

import { BaseFormPropsT } from "./type";
import { Group, Stack, Box } from "@mantine/core";
import { useForm } from "@mantine/form";
import MainButton from "@/components/Atoms/Button/MainButton";
import PasswordInput from "@/components/Atoms/FormInput/PasswordInput";
import { LoadingOverlay } from "@mantine/core";
import { IconLock, IconKey } from "@tabler/icons-react";
import { changePasswordValidator } from "@/hooks/validator/changePasswordValidation";

export type ChangePasswordDataT = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const ChangePasswordForm = ({ 
  handleSubmit, 
  handleCancel, 
  isLoading = false 
}: BaseFormPropsT<ChangePasswordDataT>) => {
  const form = useForm<ChangePasswordDataT>({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validateInputOnChange: true,
    validate: changePasswordValidator,
  });

  const handleReset = () => {
    form.reset();
    form.resetDirty();
    handleCancel?.();
  };

  const handleFormSubmit = async (values: Partial<ChangePasswordDataT>) => {
    await handleSubmit(values);
  };

  return (
    <Box pos="relative">
      <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
      <form onSubmit={form.onSubmit(handleFormSubmit)}>
        <Stack>
          <PasswordInput
            label="Password Lama"
            placeholder="Masukkan password lama"
            leftSection={<IconLock size={18} />}
            withAsterisk
            {...form.getInputProps("oldPassword")}
          />

          <PasswordInput
            label="Password Baru"
            description="Minimal 8 karakter"
            placeholder="Masukkan password baru"
            leftSection={<IconKey size={18} />}
            withAsterisk
            {...form.getInputProps("newPassword")}
          />

          <PasswordInput
            label="Konfirmasi Password Baru"
            description="Ulangi password baru"
            placeholder="Ulangi password baru"
            leftSection={<IconKey size={18} />}
            withAsterisk
            {...form.getInputProps("confirmPassword")}
          />

          <Group justify="space-between" mt="md" preventGrowOverflow={false} wrap="nowrap">
            <MainButton variant="outline" onClick={handleReset} miw={100} disabled={isLoading}>
              Cancel
            </MainButton>
            <MainButton type="submit" loading={isLoading} fullWidth>
              Ubah Password
            </MainButton>
          </Group>
        </Stack>
      </form>
    </Box>
  );
};

export default ChangePasswordForm;

