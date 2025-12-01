import { ConfigDataT } from "@/config/types";
import { BaseFormPropsT } from "./type";
import { Group, Stack, Textarea, ActionIcon, Box, Text } from "@mantine/core";
import MainInput from "@/components/Atoms/FormInput/MainInput";
import { useForm } from "@mantine/form";
import { configValidator } from "@/hooks/validator/configValidation";
import MainButton from "@/components/Atoms/Button/MainButton";
import { useEffect, useRef, useState } from "react";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { LoadingOverlay } from "@mantine/core";

const ConfigForm = ({ handleSubmit, handleCancel, isLoading=false, forEdit=false, defaultValues }: BaseFormPropsT<ConfigDataT>) => {
  const [isArrayValue, setIsArrayValue] = useState(false);
  const [arrayValues, setArrayValues] = useState<string[]>([]);

  const form = useForm<ConfigDataT>({
    initialValues: {
      id: 0,
      key: "",
      value: "",
      description: "",
    },
    validateInputOnChange: true,
    validate: (values) => {
      const baseErrors = configValidator(values);
      const errors: Record<string, string> = { ...baseErrors };

      if (isArrayValue) {
        arrayValues.forEach((val, index) => {
          if (val.includes('"')) {
            errors[`array_${index}`] = "Tidak boleh mengandung double quote (\")";
          }
        });
        if (arrayValues.length === 0) {
          errors.array = "Minimal harus ada 1 item";
        }
      } else {
        if (values.value && values.value.includes('"')) {
          errors.value = "Tidak boleh mengandung double quote (\")";
        }
      }

      return Object.keys(errors).length > 0 ? errors : {};
    },
  });

  const prevDefaultValuesRef = useRef<typeof defaultValues>(undefined);
  const prevForEditRef = useRef<boolean>(false);

  const parseValue = (value: string) => {
    if (!value) {
      setIsArrayValue(false);
      setArrayValues([]);
      return;
    }

    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        setIsArrayValue(true);
        setArrayValues(parsed.length > 0 ? parsed : [""]);
      } else {
        setIsArrayValue(false);
        setArrayValues([]);
      }
    } catch {
      setIsArrayValue(false);
      setArrayValues([]);
    }
  };

  useEffect(() => {
    if (forEdit && defaultValues) {
      const forEditChanged = prevForEditRef.current !== forEdit;
      const valuesChanged = !prevDefaultValuesRef.current || 
        prevDefaultValuesRef.current.id !== defaultValues.id ||
        prevDefaultValuesRef.current.key !== defaultValues.key ||
        prevDefaultValuesRef.current.value !== defaultValues.value ||
        prevDefaultValuesRef.current.description !== defaultValues.description;
      
      if (forEditChanged || valuesChanged) {
        form.setValues(defaultValues);
        parseValue(defaultValues.value || "");
        prevDefaultValuesRef.current = defaultValues;
        prevForEditRef.current = forEdit;
      }
    } else if (!forEdit && prevForEditRef.current) {
      form.reset();
      setIsArrayValue(false);
      setArrayValues([]);
      prevDefaultValuesRef.current = undefined;
      prevForEditRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forEdit, defaultValues]);

  const handleAddArrayItem = () => {
    setArrayValues([...arrayValues, ""]);
  };

  const handleRemoveArrayItem = (index: number) => {
    setArrayValues(arrayValues.filter((_, i) => i !== index));
  };

  const handleArrayItemChange = (index: number, value: string) => {
    const newArray = [...arrayValues];
    newArray[index] = value;
    setArrayValues(newArray);
  };

  const handleToggleArrayMode = () => {
    if (isArrayValue) {
      setIsArrayValue(false);
      setArrayValues([]);
      form.setFieldValue("value", "");
    } else {
      setIsArrayValue(true);
      setArrayValues([""]);
      form.setFieldValue("value", "");
    }
  };

  const handleReset = () => {
    form.reset();
    form.resetDirty();
    setIsArrayValue(false);
    setArrayValues([]);
    handleCancel?.();
  };

  const handleFormSubmit = (values: Partial<ConfigDataT>) => {
    let finalValue = values.value || "";

    if (isArrayValue) {
      const hasDoubleQuote = arrayValues.some(val => val.includes('"'));
      if (hasDoubleQuote) {
        form.setFieldError("value", "Array items tidak boleh mengandung double quote");
        return;
      }
      if (arrayValues.length === 0) {
        form.setFieldError("value", "Minimal harus ada 1 item");
        return;
      }
      finalValue = JSON.stringify(arrayValues);
    } else {
      if (finalValue.includes('"')) {
        form.setFieldError("value", "Value tidak boleh mengandung double quote");
        return;
      }
    }

    handleSubmit({
      ...values,
      value: finalValue,
    });
  };

  return (
    <Box pos="relative">
      <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
      <form onSubmit={form.onSubmit(handleFormSubmit)}>
        <Stack>
          <MainInput
            label="Key"
            placeholder="Enter config key"
            withAsterisk
            disabled={forEdit}
            readOnly={forEdit}
            {...form.getInputProps("key")}
          />
          
          <Box>
            <Group justify="space-between" mb="xs">
              <Text size="sm" fw={500}>
                Value {form.errors.value && <Text span c="red" size="sm">*</Text>}
              </Text>
              {!forEdit && (
                <MainButton
                  type="button"
                  variant="subtle"
                  size="xs"
                  onClick={handleToggleArrayMode}
                >
                  {isArrayValue ? "Switch to Single Value" : "Switch to Array"}
                </MainButton>
              )}
            </Group>

            {isArrayValue ? (
              <Stack gap="xs">
                {arrayValues.map((item, index) => (
                  <Group key={index} gap="xs" align="flex-start">
                    <MainInput
                      placeholder={`Item ${index + 1}`}
                      value={item}
                      onChange={(e) => handleArrayItemChange(index, e.target.value)}
                      style={{ flex: 1 }}
                      error={form.errors[`array_${index}`]}
                      onKeyDown={(e) => {
                        if (e.key === '"') {
                          e.preventDefault();
                        }
                      }}
                    />
                    <ActionIcon
                      color="red"
                      variant="light"
                      onClick={() => handleRemoveArrayItem(index)}
                      disabled={arrayValues.length === 1}
                      mt={2}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                ))}
                <MainButton
                  type="button"
                  variant="light"
                  size="xs"
                  leftSection={<IconPlus size={16} />}
                  onClick={handleAddArrayItem}
                  fullWidth
                >
                  Add Item
                </MainButton>
                {form.errors.array && (
                  <Text size="xs" c="red">
                    {form.errors.array}
                  </Text>
                )}
              </Stack>
            ) : (
              <Textarea
                placeholder="Enter config value"
                minRows={2}
                radius="md"
                {...form.getInputProps("value")}
                onKeyDown={(e) => {
                  if (e.key === '"') {
                    e.preventDefault();
                  }
                }}
              />
            )}
            {form.errors.value && (
              <Text size="xs" c="red" mt={4}>
                {form.errors.value}
              </Text>
            )}
          </Box>

          <Textarea
            label="Description"
            placeholder="Enter description"
            withAsterisk
            minRows={2}
            radius="md"
            disabled={forEdit}
            readOnly={forEdit}
            {...form.getInputProps("description")}
          />
          <Group justify="space-between" mt="md" preventGrowOverflow={false} wrap="nowrap">
            <MainButton variant="outline" onClick={handleReset} miw={100} disabled={isLoading}>
              Cancel
            </MainButton>
            <MainButton type="submit" loading={isLoading} fullWidth>
              {forEdit ? "Save" : "Add Config"}
            </MainButton>
          </Group>
        </Stack>
      </form>
    </Box>
  );
};

export default ConfigForm;
