'use client';

import { DataTable, DataTableColumn } from 'mantine-datatable';
import { TableT } from './type';

const Table = <T extends Record<string, unknown>>({ columns, datas }: TableT<T>) => {
  const validRecords = Array.isArray(datas) ? datas : [];
  
  const mappedColumns: DataTableColumn<T>[] = columns.map((column) => {
    const accessorKey = String(column.key);
    return {
      accessor: accessorKey,
      title: column.label,
    };
  });
  
  return (
    <DataTable
      columns={mappedColumns}
      records={validRecords}
      idAccessor="id"
      backgroundColor="transparent"
    />
  );
};

export default Table;