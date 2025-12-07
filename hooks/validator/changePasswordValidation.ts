import { ChangePasswordDataT } from "@/components/Molecules/Forms/ChangePasswordForm";
import { changePasswordSchema } from ".";

export const changePasswordValidator = (values: Partial<ChangePasswordDataT>) => {
  const result = changePasswordSchema.safeParse(values);
  
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

