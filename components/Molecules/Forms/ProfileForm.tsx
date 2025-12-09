import { BaseFormPropsT } from "./type";
import { Group, Stack, Box } from "@mantine/core";
import { useForm } from "@mantine/form";
import MainButton from "@/components/Atoms/Button/MainButton";
import MainInput from "@/components/Atoms/FormInput/MainInput";
import { LoadingOverlay } from "@mantine/core";
import { IconUser, IconMail, IconAt } from "@tabler/icons-react";
import { profileValidator } from "@/hooks/validator/profileValidation";
import { useEffect, useRef } from "react";

export type ProfileDataT = {
  email: string;
  username: string;
  name: string;
};

const ProfileForm = ({ 
  handleSubmit, 
  handleCancel, 
  isLoading = false,
  forEdit = false,
  defaultValues
}: BaseFormPropsT<ProfileDataT>) => {
  const form = useForm<ProfileDataT>({
    initialValues: {
      email: "",
      username: "",
      name: "",
    },
    validateInputOnChange: true,
    validate: profileValidator,
  });

  const prevDefaultValuesRef = useRef<typeof defaultValues>(undefined);
  const prevForEditRef = useRef<boolean>(false);

  useEffect(() => {
    if (forEdit && defaultValues) {
      const forEditChanged = prevForEditRef.current !== forEdit;
      const valuesChanged = !prevDefaultValuesRef.current || 
        prevDefaultValuesRef.current.email !== defaultValues.email ||
        prevDefaultValuesRef.current.username !== defaultValues.username ||
        prevDefaultValuesRef.current.name !== defaultValues.name;
      
      if (forEditChanged || valuesChanged) {
        form.setValues(defaultValues);
        prevDefaultValuesRef.current = defaultValues;
        prevForEditRef.current = forEdit;
      }
    } else if (!forEdit && prevForEditRef.current) {
      form.reset();
      prevDefaultValuesRef.current = undefined;
      prevForEditRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forEdit, defaultValues]);

  const handleReset = () => {
    form.reset();
    form.resetDirty();
    handleCancel?.();
  };

  const handleFormSubmit = async (values: Partial<ProfileDataT>) => {
    await handleSubmit(values);
  };

  return (
    <Box pos="relative">
      <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
      <form onSubmit={form.onSubmit(handleFormSubmit)}>
        <Stack>
          <MainInput
            label="Nama Lengkap"
            placeholder="Masukkan nama lengkap"
            leftSection={<IconUser size={18} />}
            withAsterisk
            {...form.getInputProps("name")}
          />

          <MainInput
            label="Email"
            placeholder="Masukkan email"
            leftSection={<IconMail size={18} />}
            withAsterisk
            {...form.getInputProps("email")}
          />

          <MainInput
            label="Username"
            description="Username digunakan untuk login"
            placeholder="Masukkan username"
            leftSection={<IconAt size={18} />}
            withAsterisk
            value={form.values.username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const lowerValue = e.target.value.toLowerCase();
              form.setFieldValue("username", lowerValue);
            }}
            onBlur={() => form.validateField("username")}
            error={form.errors.username}
          />

          <Group justify="space-between" mt="md" preventGrowOverflow={false} wrap="nowrap">
            <MainButton variant="outline" onClick={handleReset} miw={100} disabled={isLoading}>
              Cancel
            </MainButton>
            <MainButton type="submit" loading={isLoading} fullWidth>
              Simpan Profile
            </MainButton>
          </Group>
        </Stack>
      </form>
    </Box>
  );
};

export default ProfileForm;

