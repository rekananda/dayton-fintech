'use client';

import { LegalDataT } from "@/config/types";
import { BaseFormPropsT } from "./type";
import { Group, Stack, Textarea } from "@mantine/core";
import MainInput from "@/components/Atoms/FormInput/MainInput";
import NumberInput from "@/components/Atoms/FormInput/NumberInput";
import { useForm } from "@mantine/form";
import { legalValidator } from "@/hooks/validator/legalValidation";
import MainButton from "@/components/Atoms/Button/MainButton";
import { useEffect, useRef } from "react";
import { Box } from "@mantine/core";
import { LoadingOverlay } from "@mantine/core";

const LegalForm = ({ handleSubmit, handleCancel, isLoading=false, forEdit=false, defaultValues }: BaseFormPropsT<LegalDataT>) => {
  const form = useForm<LegalDataT>({
    initialValues: {
      id: 0,
      title: "",
      description: "",
      order: 1,
    },
    validateInputOnChange: true,
    validate: legalValidator,
  });

  const prevDefaultValuesRef = useRef<typeof defaultValues>(undefined);
  const prevForEditRef = useRef<boolean>(false);
  
  useEffect(() => {
    if (forEdit && defaultValues) {
      const forEditChanged = prevForEditRef.current !== forEdit;
      const valuesChanged = !prevDefaultValuesRef.current || 
        prevDefaultValuesRef.current.id !== defaultValues.id ||
        prevDefaultValuesRef.current.title !== defaultValues.title ||
        prevDefaultValuesRef.current.description !== defaultValues.description ||
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
            label="Title"
            placeholder="Enter title"
            withAsterisk
            {...form.getInputProps("title")}
          />
          <Textarea
            label="Description"
            placeholder="Enter description"
            withAsterisk
            autosize
            minRows={4}
            maxRows={6}
            radius={16}
            {...form.getInputProps("description")}
          />
          <NumberInput
            label="Order"
            description="Urutan legal akan ditampilkan"
            placeholder="Enter legal order"
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
              {forEdit ? "Save" : "Add Legal"}
            </MainButton>
          </Group>
        </Stack>
      </form>
    </Box>
  );
};

export default LegalForm;

