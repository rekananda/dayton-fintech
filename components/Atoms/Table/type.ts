export type TableColumnT<T> = {
  key: keyof T;
  label: string;
};

export type TableT<T extends Record<string, unknown>> = {
  columns: TableColumnT<T>[];
  datas: T[];
};