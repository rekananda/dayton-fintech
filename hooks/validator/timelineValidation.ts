import { TimelineDataT } from "@/config/types";
import { timelineSchema } from ".";

export const timelineValidator = (values: Partial<TimelineDataT>) => {
  const result = timelineSchema.safeParse(values);
  
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

