'use client';

import { QnADataT } from "@/config/types";
import { BaseFormPropsT } from "./type";
import { Box, Group, Stack, Textarea } from "@mantine/core";
import MainInput from "@/components/Atoms/FormInput/MainInput";
import NumberInput from "@/components/Atoms/FormInput/NumberInput";
import { useForm } from "@mantine/form";
import { qnaValidator } from "@/hooks/validator/qnaValidation";
import MainButton from "@/components/Atoms/Button/MainButton";
import { useEffect, useRef } from "react";
import { LoadingOverlay } from "@mantine/core";

const QnAForm = ({ handleSubmit, handleCancel, isLoading=false, forEdit=false, defaultValues }: BaseFormPropsT<QnADataT>) => {
  const form = useForm<QnADataT>({
    initialValues: {
      id: 0,
      question: "",
      answer: "",
      order: 1,
    },
    validateInputOnChange: true,
    validate: qnaValidator,
  });

  const prevDefaultValuesRef = useRef<typeof defaultValues>(undefined);
  const prevForEditRef = useRef<boolean>(false);
  
  useEffect(() => {
    if (forEdit && defaultValues) {
      const forEditChanged = prevForEditRef.current !== forEdit;
      const valuesChanged = !prevDefaultValuesRef.current || 
        prevDefaultValuesRef.current.id !== defaultValues.id ||
        prevDefaultValuesRef.current.question !== defaultValues.question ||
        prevDefaultValuesRef.current.answer !== defaultValues.answer ||
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
            label="Question"
            placeholder="Enter question"
            withAsterisk
            {...form.getInputProps("question")}
          />
          <Textarea
            label="Answer"
            placeholder="Enter answer"
            withAsterisk
            autosize
            minRows={4}
            maxRows={6}
            radius={16}
            {...form.getInputProps("answer")}
          />
          <NumberInput
            label="Order"
            description="Urutan Q&A akan ditampilkan"
            placeholder="Enter Q&A order"
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
              {forEdit ? "Save" : "Add Q&A"}
            </MainButton>
          </Group>
        </Stack>
      </form>
    </Box>
  );
};

export default QnAForm;

