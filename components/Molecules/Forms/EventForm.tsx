'use client';

import { EventDataT } from "@/config/types";
import { BaseFormPropsT } from "./type";
import { Group, Stack, Textarea, Box, Image, Text, AspectRatio } from "@mantine/core";
import MainInput from "@/components/Atoms/FormInput/MainInput";
import { useForm } from "@mantine/form";
import { eventValidator } from "@/hooks/validator/eventValidation";
import MainButton from "@/components/Atoms/Button/MainButton";
import { useState, useRef, useEffect } from "react";
import { Dropzone, IMAGE_MIME_TYPE, FileWithPath, FileRejection } from "@mantine/dropzone";
import { IconUpload, IconX, IconPhoto } from "@tabler/icons-react";
import { LoadingOverlay } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { DateTimePicker } from '@mantine/dates';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const EventForm = ({ handleSubmit, handleCancel, isLoading=false, forEdit=false, defaultValues }: BaseFormPropsT<EventDataT>) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<FileWithPath | null>(null);
  const openRef = useRef<() => void>(null);
  const prevDefaultValuesRef = useRef<typeof defaultValues>(undefined);
  const prevForEditRef = useRef<boolean>(false);

  const form = useForm<EventDataT>({
    initialValues: {
      id: 0,
      imageUrl: "",
      meetingLink: "",
      location: "",
      date: "",
      title: "",
      description: "",
    },
    validateInputOnChange: true,
    validate: eventValidator,
  });

  useEffect(() => {
    if (forEdit && defaultValues) {
      const forEditChanged = prevForEditRef.current !== forEdit;
      const valuesChanged = !prevDefaultValuesRef.current || 
        prevDefaultValuesRef.current.id !== defaultValues.id;
      
      if (forEditChanged || valuesChanged) {
        const dateValue = defaultValues.date 
          ? new Date(defaultValues.date).toISOString().slice(0, 16)
          : "";
        
        form.setValues({
          id: defaultValues.id || 0,
          imageUrl: defaultValues.imageUrl || "",
          meetingLink: defaultValues.meetingLink || "",
          location: defaultValues.location || "",
          date: dateValue,
          title: defaultValues.title || "",
          description: defaultValues.description || "",
        });
        
        if (defaultValues.imageUrl) {
          setPreview(defaultValues.imageUrl);
        }
        
        prevDefaultValuesRef.current = defaultValues;
        prevForEditRef.current = forEdit;
      }
    } else if (!forEdit && prevForEditRef.current) {
      form.reset();
      setPreview(null);
      setFile(null);
      prevDefaultValuesRef.current = undefined;
      prevForEditRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forEdit, defaultValues]);

  const handleDrop = (files: FileWithPath[]) => {
    if (files.length === 0) return;

    const selectedFile = files[0];
    
    if (selectedFile.size > MAX_FILE_SIZE) {
      notifications.show({
        color: "red",
        title: "File terlalu besar",
        message: "Ukuran file maksimal 10MB",
      });
      return;
    }

    setFile(selectedFile);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(selectedFile);
    
    if (!forEdit || !form.values.imageUrl) {
      form.setFieldValue('imageUrl', 'pending-upload');
    }
  };

  const handleReject = (files: FileRejection[]) => {
    files.forEach((file: FileRejection) => {
      file.errors.forEach((error: { code: string; message: string }) => {
        if (error.code === 'file-too-large') {
          notifications.show({
            color: "red",
            title: "File terlalu besar",
            message: "Ukuran file maksimal 10MB",
          });
        } else if (error.code === 'file-invalid-type') {
          notifications.show({
            color: "red",
            title: "Format tidak valid",
            message: "Hanya file gambar yang diperbolehkan",
          });
        }
      });
    });
  };

  const handleRemove = () => {
    setFile(null);
    if (forEdit && defaultValues?.imageUrl) {
      setPreview(defaultValues.imageUrl);
      form.setFieldValue('imageUrl', defaultValues.imageUrl);
    } else {
      setPreview(null);
      form.setFieldValue('imageUrl', '');
    }
  };

  const handleReset = () => {
    form.reset();
    form.resetDirty();
    setPreview(null);
    setFile(null);
    handleCancel?.();
  };

  const uploadFileToGoogleDrive = async (fileToUpload: FileWithPath): Promise<string> => {
    const formData = new FormData();
    formData.append('file', fileToUpload);

    const response = await fetch('/api/upload/gdrive', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      
      if (errorData.action === 'authorize') {
        notifications.show({
          color: "yellow",
          title: "Token Google Drive expired",
          message: "Harap hubungkan kembali dengan Google Drive untuk melanjutkan upload.",
        });
        
        const authResponse = await fetch('/api/upload/gdrive/auth');
        const authData = await authResponse.json();
        if (authData.authUrl) {
          window.location.href = authData.authUrl;
          throw new Error('Redirecting to Google OAuth');
        } else {
          throw new Error(authData.message || 'Gagal mendapatkan auth URL');
        }
      }
      
      throw new Error(errorData.message || 'Gagal upload gambar');
    }

    const result = await response.json();
    return result.url;
  };

  const onSubmit = form.onSubmit(async (values) => {
    if (forEdit && !file && values.imageUrl && values.imageUrl !== 'pending-upload') {
      handleSubmit(values);
      return;
    }

    if (!file) {
      notifications.show({
        color: "red",
        title: "Gambar diperlukan",
        message: "Silakan pilih gambar terlebih dahulu",
      });
      return;
    }

    setUploading(true);
    try {
      const uploadedUrl = await uploadFileToGoogleDrive(file);
      
      const finalValues = {
        ...values,
        imageUrl: uploadedUrl,
      };
      
      await handleSubmit(finalValues);
      
      setFile(null);
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Upload gagal",
        message: (error as Error).message,
      });
    } finally {
      setUploading(false);
    }
  });

  return (
    <Box pos="relative">
      <LoadingOverlay visible={isLoading || uploading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
      <form onSubmit={onSubmit}>
        <Stack>
          <Box>
            <Text size="sm" fw={500} mb={5}>
              Image <span style={{ color: 'red' }}>*</span>
            </Text>
            {preview ? (
              <Box pos="relative">
                <AspectRatio ratio={16 / 9} mb="md">
                  <Image
                    src={preview}
                    alt="Preview"
                    fit="cover"
                    radius="md"
                  />
                </AspectRatio>
                <MainButton
                  type="button"
                  variant="outline"
                  color="red"
                  size="xs"
                  onClick={handleRemove}
                  leftSection={<IconX size={16} />}
                >
                  Hapus Gambar
                </MainButton>
              </Box>
            ) : (
              <Dropzone
                openRef={openRef}
                onDrop={handleDrop}
                onReject={handleReject}
                maxSize={MAX_FILE_SIZE}
                accept={IMAGE_MIME_TYPE}
                disabled={uploading || isLoading}
              >
                <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
                  <Dropzone.Accept>
                    <IconUpload size={52} stroke={1.5} />
                  </Dropzone.Accept>
                  <Dropzone.Reject>
                    <IconX size={52} stroke={1.5} />
                  </Dropzone.Reject>
                  <Dropzone.Idle>
                    <IconPhoto size={52} stroke={1.5} />
                  </Dropzone.Idle>

                  <div>
                    <Text size="xl" inline>
                      Drag images here or click to select files
                    </Text>
                    <Text size="sm" c="dimmed" inline mt={7}>
                      Attach image file, maksimal 10MB
                    </Text>
                  </div>
                </Group>
              </Dropzone>
            )}
            {form.errors.imageUrl && (
              <Text size="xs" c="red" mt={5}>
                {form.errors.imageUrl}
              </Text>
            )}
          </Box>

          <MainInput
            label="Title"
            placeholder="Masukkan title event"
            withAsterisk
            radius="xl"
            {...form.getInputProps("title")}
          />

          <Textarea
            label="Description"
            placeholder="Masukkan description event"
            withAsterisk
            radius="md"
            minRows={4}
            {...form.getInputProps("description")}
          />

          <DateTimePicker 
            label="Date" 
            placeholder="Pilih tanggal dan waktu event" 
            withAsterisk
            radius="xl"
            {...form.getInputProps("date")}
          />

          <MainInput
            label="Meeting Link"
            placeholder="Masukkan meeting link (opsional)"
            radius="xl"
            {...form.getInputProps("meetingLink")}
          />

          <MainInput
            label="Location"
            placeholder="Masukkan lokasi event (opsional)"
            radius="xl"
            {...form.getInputProps("location")}
          />

          <Group justify="space-between" mt="md" preventGrowOverflow={false} wrap="nowrap">
            <MainButton
              type="button"
              variant="outline"
              onClick={handleReset}
              miw={100}
              disabled={isLoading || uploading}
            >
              Cancel
            </MainButton>
            <MainButton
              type="submit"
              loading={isLoading || uploading}
              fullWidth
            >
              {forEdit ? "Save" : "Add Event"}
            </MainButton>
          </Group>
        </Stack>
      </form>
    </Box>
  );
};

export default EventForm;

