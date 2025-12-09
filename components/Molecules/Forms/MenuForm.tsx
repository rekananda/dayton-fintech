'use client';

import { MenuDataT } from "@/config/types";
import { BaseFormPropsT } from "./type";
import { Group, LoadingOverlay, Stack } from "@mantine/core";
import MainInput from "@/components/Atoms/FormInput/MainInput";
import NumberInput from "@/components/Atoms/FormInput/NumberInput";
import { useForm } from "@mantine/form";
import { menuValidator } from "@/hooks/validator/menuValidation";
import MainButton from "@/components/Atoms/Button/MainButton";
import { useEffect, useRef } from "react";
import { Box } from "@mantine/core";

const MenuForm = ({ handleSubmit, handleCancel, isLoading=false, forEdit=false, defaultValues }: BaseFormPropsT<MenuDataT>) => {
  const form = useForm<MenuDataT>({
    initialValues: {
      id: 0,
      label: "",
      href: "",
      order: 1,
    },
    validateInputOnChange: true,
    validate: menuValidator,
  });

  const prevDefaultValuesRef = useRef<typeof defaultValues>(undefined);
  const prevForEditRef = useRef<boolean>(false);
  
  useEffect(() => {
    if (forEdit && defaultValues) {
      const forEditChanged = prevForEditRef.current !== forEdit;
      const valuesChanged = !prevDefaultValuesRef.current || 
        prevDefaultValuesRef.current.id !== defaultValues.id ||
        prevDefaultValuesRef.current.label !== defaultValues.label ||
        prevDefaultValuesRef.current.href !== defaultValues.href ||
        prevDefaultValuesRef.current.order !== defaultValues.order;
      
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

  return (
    <Box pos="relative">
      <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <MainInput
            label="Label"
            placeholder="Enter menu name"
            withAsterisk
            {...form.getInputProps("label")}
          />
          {forEdit && <MainInput 
            label="target" 
            disabled 
            placeholder="Target menu will be generated automatically" 
            readOnly
            {...form.getInputProps("href")}
          />}
          <NumberInput
            label="Order"
            description="Urutan menu akan ditampilkan"
            placeholder="Enter menu order"
            min={1}
            clampBehavior="strict"
            withAsterisk
            {...form.getInputProps("order")}
          />
          <Group justify="space-between" mt="md" preventGrowOverflow={false} wrap="nowrap">
            <MainButton variant="outline" onClick={handleReset} miw={100} disabled={isLoading}>
              Cancel
            </MainButton>
            <MainButton type="submit" loading={isLoading} fullWidth>
              {forEdit ? "Save" : "Add Menu"}
            </MainButton>
          </Group>
        </Stack>
      </form>
    </Box>
  );
};

export default MenuForm;