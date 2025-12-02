import { ConfigDataT } from "@/config/types";
import { configSchema } from ".";

export const configValidator = (values: Partial<ConfigDataT>) => {
  const result = configSchema.safeParse(values);
  
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

