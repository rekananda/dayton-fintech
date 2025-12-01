import { TimelineDataT } from "@/config/types";
import { BaseFormPropsT } from "./type";
import { Group, Stack, Select, Textarea, Box, Anchor, Text } from "@mantine/core";
import MainInput from "@/components/Atoms/FormInput/MainInput";
import NumberInput from "@/components/Atoms/FormInput/NumberInput";
import { useForm } from "@mantine/form";
import { timelineValidator } from "@/hooks/validator/timelineValidation";
import MainButton from "@/components/Atoms/Button/MainButton";
import { useEffect, useRef, useMemo, useCallback } from "react";
import * as materialIcons from '@mui/icons-material';
import { IconCheck, icons } from '@tabler/icons-react';
import { IconNameT } from "@/components/Atoms/Icon/type";
import { SelectProps, ComboboxLikeRenderOptionInput, ComboboxItem } from "@mantine/core";
import { LoadingOverlay } from "@mantine/core";

const TimelineForm = ({ handleSubmit, handleCancel, isLoading=false, forEdit=false, defaultValues }: BaseFormPropsT<TimelineDataT>) => {
  const allIconNames = useMemo(() => {
    const materialIconNames = Object.keys(materialIcons).filter(
      (key) => !key.includes('Outlined') || key.endsWith('Outlined')
    );
    const tablerIconNames = Object.keys(icons);
    return [...materialIconNames, ...tablerIconNames];
  }, []);

  const iconData = useMemo(() => 
    allIconNames.map(name => ({ value: name, label: name })),
    [allIconNames]
  );

  const colorOptions = [
    { value: 'primary', label: 'Primary' },
    { value: 'blue', label: 'Blue' },
    { value: 'cyan', label: 'Cyan' },
    { value: 'teal', label: 'Teal' },
    { value: 'green', label: 'Green' },
    { value: 'lime', label: 'Lime' },
    { value: 'yellow', label: 'Yellow' },
    { value: 'orange', label: 'Orange' },
    { value: 'red', label: 'Red' },
    { value: 'pink', label: 'Pink' },
    { value: 'grape', label: 'Grape' },
    { value: 'violet', label: 'Violet' },
    { value: 'indigo', label: 'Indigo' },
  ];

  const form = useForm<TimelineDataT>({
    initialValues: {
      id: 0,
      icon: "CandlestickChartOutlined" as IconNameT,
      title: "",
      description: "",
      color: "primary",
      order: 1,
    },
    validateInputOnChange: true,
    validate: timelineValidator,
  });

  const prevDefaultValuesRef = useRef<typeof defaultValues>(undefined);
  const prevForEditRef = useRef<boolean>(false);
  
  useEffect(() => {
    if (forEdit && defaultValues) {
      const forEditChanged = prevForEditRef.current !== forEdit;
      const valuesChanged = !prevDefaultValuesRef.current || 
        prevDefaultValuesRef.current.id !== defaultValues.id ||
        prevDefaultValuesRef.current.icon !== defaultValues.icon ||
        prevDefaultValuesRef.current.title !== defaultValues.title ||
        prevDefaultValuesRef.current.description !== defaultValues.description ||
        prevDefaultValuesRef.current.color !== defaultValues.color ||
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

  const renderSelectColorOption: SelectProps['renderOption'] = useCallback(
    (item: ComboboxLikeRenderOptionInput<ComboboxItem>) => {
      const { option, checked } = item;
      return (
        <Group flex="1" gap="xs">
          <Box bg={option.value} w={20} h={20} style={{ borderRadius: 6 }} />
          {option.label}
          {checked && <IconCheck style={{ marginInlineStart: 'auto' }} />}
        </Group>
      );
    },
    []
  );

  const renderSelectIconOption: SelectProps['renderOption'] = useCallback(
    (item: ComboboxLikeRenderOptionInput<ComboboxItem>) => {
      const { option } = item;
      return (
        <Group flex="1" gap="xs">
          <span>{option.label}</span>
        </Group>
      );
    },
    []
  );

  return (
    <Box pos="relative">
      <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <Select
            label="Icon"
            placeholder="Pilih icon"
            data={iconData}
            searchable
            withAsterisk
            radius="xl"
            limit={100}
            description={
              <Text size="sm" c="dimmed">
                Buka{' '}
                <Anchor href="https://tabler.io/icons" target="_blank" rel="noopener noreferrer">
                  https://tabler.io/icons
                </Anchor>
                {' '}dan{' '}
                <Anchor href="https://mui.com/material-ui/material-icons" target="_blank" rel="noopener noreferrer">
                  https://mui.com/material-ui/material-icons
                </Anchor>
                {' '}untuk melihat semua icon yang tersedia
              </Text>
            }
            renderOption={renderSelectIconOption}
            {...form.getInputProps("icon")}
          />
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
            minRows={3}
            radius="md"
            {...form.getInputProps("description")}
          />
          <Select
            label="Color"
            placeholder="Pilih color"
            data={colorOptions}
            searchable
            withAsterisk
            radius="xl"
            renderOption={renderSelectColorOption}
            {...form.getInputProps("color")}
          />
          <NumberInput
            label="Order"
            description="Urutan timeline akan ditampilkan"
            placeholder="Enter timeline order"
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
              {forEdit ? "Save" : "Add Timeline"}
            </MainButton>
          </Group>
        </Stack>
      </form>
    </Box>
  );
};

export default TimelineForm;

