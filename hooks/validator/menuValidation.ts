import { MenuDataT } from "@/config/types";
import { menuSchema } from ".";

export const menuValidator = (values: Partial<MenuDataT>) => {
  const result = menuSchema.safeParse(values);
  
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

