import { EventDataT } from "@/config/types";
import { eventSchema } from ".";

export const eventValidator = (values: Partial<EventDataT>) => {
  const result = eventSchema.safeParse(values);
  
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

