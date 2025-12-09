import { registerSchema } from ".";

export type RegisterFormDataT = {
  username: string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export const registerValidator = (values: Partial<RegisterFormDataT>) => {
  const result = registerSchema.safeParse(values);
  
  if (!result.success) {
    const errors: Record<string, string> = {};
    result.error.issues.forEach((issue) => {
      const path = issue.path[0] as string;
      if (path) {
        errors[path] = issue.message;
      }
    });
    return errors;
  }
  
  return {};
};

