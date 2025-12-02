import { LegalDataT } from "@/config/types";
import { legalSchema } from ".";

export const legalValidator = (values: Partial<LegalDataT>) => {
  const result = legalSchema.safeParse(values);
  
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

