import { profileSchema } from ".";

export type ProfileDataT = {
  email: string;
  username: string;
  name: string;
};

export const profileValidator = (values: Partial<ProfileDataT>) => {
  const result = profileSchema.safeParse(values);
  
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

