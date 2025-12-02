import { QnADataT } from "@/config/types";
import { qnaSchema } from ".";

export const qnaValidator = (values: Partial<QnADataT>) => {
  const result = qnaSchema.safeParse(values);
  
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

