'use client';

import { BusinessModelDataT } from "@/store/dataBusinessModelSlice";
import { BaseFormPropsT } from "./type";
import { Group, LoadingOverlay, Stack, Textarea, TagsInput } from "@mantine/core";
import MainInput from "@/components/Atoms/FormInput/MainInput";
import NumberInput from "@/components/Atoms/FormInput/NumberInput";
import { useForm } from "@mantine/form";
import MainButton from "@/components/Atoms/Button/MainButton";
import { useEffect, useRef } from "react";
import { Box } from "@mantine/core";

const BusinessModelForm = ({ handleSubmit, handleCancel, isLoading=false, forEdit=false, defaultValues }: BaseFormPropsT<BusinessModelDataT>) => {
  const form = useForm<BusinessModelDataT>({
    initialValues: {
      id: 0,
      title: "",
      description: "",
      tags: [],
      order: 1,
      tnc: "",
    },
    validateInputOnChange: true,
    validate: {
      title: (value) => (!value ? "Title is required" : null),
      description: (value) => (!value ? "Description is required" : null),
      order: (value) => (typeof value !== "number" || value < 1 ? "Order must be at least 1" : null),
    },
  });

  const prevDefaultValuesRef = useRef<typeof defaultValues>(undefined);
  const prevForEditRef = useRef<boolean>(false);
  
  useEffect(() => {
    if (forEdit && defaultValues) {
      const forEditChanged = prevForEditRef.current !== forEdit;
      const valuesChanged = !prevDefaultValuesRef.current || 
        prevDefaultValuesRef.current.id !== defaultValues.id;
      
      if (forEditChanged || valuesChanged) {
        form.setValues({
          id: defaultValues.id || 0,
          title: defaultValues.title || "",
          description: defaultValues.description || "",
          tags: defaultValues.tags || [],
          order: defaultValues.order || 1,
          tnc: defaultValues.tnc || "",
        });
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
            placeholder="Enter business model title"
            withAsterisk
            radius="xl"
            {...form.getInputProps("title")}
          />
          <Textarea
            label="Description"
            placeholder="Enter business model description"
            withAsterisk
            autosize
            minRows={4}
            maxRows={6}
            radius={16}
            {...form.getInputProps("description")}
          />
          <TagsInput
            label="Tags"
            placeholder="Enter tags (e.g., MINGGUAN, BULANAN)"
            description="Press Enter to add tag"
            radius="xl"
            {...form.getInputProps("tags")}
          />
          <NumberInput
            label="Order"
            description="Urutan tampilan business model"
            placeholder="Enter order"
            min={1}
            clampBehavior="strict"
            withAsterisk
            {...form.getInputProps("order")}
          />
          <Textarea
            label="Terms & Conditions (Optional)"
            placeholder="Enter terms and conditions or explanation"
            autosize
            minRows={4}
            maxRows={6}
            radius={16}
            {...form.getInputProps("tnc")}
          />
          <Group justify="space-between" mt="md" preventGrowOverflow={false} wrap="nowrap">
            <MainButton variant="outline" onClick={handleReset} miw={100} disabled={isLoading}>
              Cancel
            </MainButton>
            <MainButton type="submit" loading={isLoading} fullWidth>
              {forEdit ? "Save" : "Add Business Model"}
            </MainButton>
          </Group>
        </Stack>
      </form>
    </Box>
  );
};

export default BusinessModelForm;

