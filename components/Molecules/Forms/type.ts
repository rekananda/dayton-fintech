export type BaseFormPropsT<T> = {
  handleSubmit: (values: Partial<T>) => Promise<void>;
  handleCancel?: () => void;
  isLoading?: boolean;
} & (
  | { forEdit: true; defaultValues: Partial<T> }
  | { forEdit?: false; defaultValues?: Partial<T> }
);
