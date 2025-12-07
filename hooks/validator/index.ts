import { z } from "zod";

export const menuSchema = z.object({
  label: z.string().min(1, "Label tidak boleh kosong"),
  order: z.number().min(1, "Order harus lebih dari 0"),
});

export type MenuFormValues = z.infer<typeof menuSchema>;

export const timelineSchema = z.object({
  icon: z.string().min(1, "Icon tidak boleh kosong"),
  title: z.string().min(1, "Title tidak boleh kosong"),
  description: z.string().min(1, "Description tidak boleh kosong"),
  color: z.string().optional(),
  order: z.number().min(1, "Order harus lebih dari 0"),
});

export type TimelineFormValues = z.infer<typeof timelineSchema>;

export const legalSchema = z.object({
  title: z.string().min(1, "Title tidak boleh kosong"),
  description: z.string().min(1, "Description tidak boleh kosong"),
  order: z.number().min(1, "Order harus lebih dari 0"),
});

export type LegalFormValues = z.infer<typeof legalSchema>;

export const qnaSchema = z.object({
  question: z.string().min(1, "Question tidak boleh kosong"),
  answer: z.string().min(1, "Answer tidak boleh kosong"),
  order: z.number().min(1, "Order harus lebih dari 0"),
});

export type QnAFormValues = z.infer<typeof qnaSchema>;

export const configSchema = z.object({
  key: z.string().min(1, "Key tidak boleh kosong"),
  value: z.string().min(1, "Value tidak boleh kosong"),
  description: z.string().min(1, "Description tidak boleh kosong"),
});

export type ConfigFormValues = z.infer<typeof configSchema>;

export const eventSchema = z.object({
  imageUrl: z.string().min(1, "Image URL tidak boleh kosong"),
  meetingLink: z.string().url("Meeting link harus berupa URL yang valid").optional().or(z.literal("")),
  location: z.string().optional(),
  date: z.string().min(1, "Date tidak boleh kosong"),
  title: z.string().min(1, "Title tidak boleh kosong"),
  description: z.string().min(1, "Description tidak boleh kosong"),
});

export type EventFormValues = z.infer<typeof eventSchema>;

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, "Password lama harus diisi"),
  newPassword: z.string().min(8, "Password baru minimal 8 karakter"),
  confirmPassword: z.string().min(1, "Konfirmasi password harus diisi"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Password tidak sama",
  path: ["confirmPassword"]
});

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export const registerSchema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter"),
  name: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
  confirmPassword: z.string().min(1, "Konfirmasi password harus diisi"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak sama",
  path: ["confirmPassword"]
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter"),
  password: z.string().min(3, "Password minimal 3 karakter"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const profileSchema = z.object({
  email: z.string().email("Email tidak valid"),
  username: z.string().min(3, "Username minimal 3 karakter"),
  name: z.string().min(3, "Nama minimal 3 karakter"),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
