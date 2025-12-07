import { loginSchema } from ".";

export type LoginFormDataT = {
  username: string;
  password: string;
};

export const loginValidator = (values: Partial<LoginFormDataT>) => {
  const result = loginSchema.safeParse(values);
  
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

