import { DataTableProps, DataTableColumn, DataTableSortStatus } from "mantine-datatable";
import { ReactNode } from "react";
import { BaseFormPropsT } from "../../Forms/type";

export type TableSearchPropsT<T> = {
  searchValue?: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  sortValue?: DataTableSortStatus<T>;
  onSortChange?: (value: DataTableSortStatus<T>) => void;
};

export type TablePaginationPropsT = {
  page: number;
  limit: number;
  totalRecords: number;
  recordsPerPageOptions?: number[];
  onLimitChange: (value: number) => void;
  onPageChange: (value: number) => void;
};

export type TableCardT<T> = DataTableProps<T> & {
  search?: TableSearchPropsT<T>;
  pagination: TablePaginationPropsT;
  FormData: (props: BaseFormPropsT<T>) => ReactNode;
  isLoading?: boolean;
  canBulkAction?: boolean;
  onCreate?: (value: Partial<T>) => void;
  onEdit?: (value: Partial<T>) => void;
  onDelete?: (value: Partial<T>) => void;
  isModalOpen?: boolean;
  setIsModal?: (value: boolean) => void;
}& (
  | { canBulkAction: true, onDeleteAll: (data: Partial<T>[]) => void }
  | { canBulkAction?: false, onDeleteAll?: (data: Partial<T>[]) => void}
);

