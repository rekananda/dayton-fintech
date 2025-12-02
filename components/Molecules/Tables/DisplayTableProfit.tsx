'use client';

import { useMemo, useState } from 'react';
import { Box, Group, Stack, Text, TextInput } from '@mantine/core';
import { DataTable, type DataTableColumn } from 'mantine-datatable';
import type { TableProfitSharingDataT } from '@/config/types';

export type DisplayTableProfitProps = {
  title?: string;
  records: TableProfitSharingDataT[];
  pageSize?: number;
  searchable?: boolean;
  className?: string;
  /**
   * Kustomisasi label kolom jika diperlukan
   */
  columnLabels?: Partial<Record<keyof TableProfitSharingDataT, string>>;
  /**
   * Tampilkan kolom `order`
   */
  showOrder?: boolean;
};

const defaultPageSize = 5;

const DisplayTableProfit = (props: DisplayTableProfitProps) => {
  const {
    title,
    records,
    pageSize = defaultPageSize,
    searchable = true,
    className,
    columnLabels,
    showOrder = false,
  } = props;

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSizeState, setPageSizeState] = useState<number>(pageSize);
  const filteredRecords = useMemo(() => {
    if (!search) return records || [];
    const keyword = search.toLowerCase();
    return (records || []).filter((r) => {
      return (
        r.profit.toLowerCase().includes(keyword) ||
        r.calculation.toLowerCase().includes(keyword)
      );
    });
  }, [records, search]);

  const columns: DataTableColumn<TableProfitSharingDataT>[] = useMemo(() => {
    const cols: DataTableColumn<TableProfitSharingDataT>[] = [
      {
        accessor: 'profit',
        title: columnLabels?.profit || 'Profit minggu ini',
      },
      {
        accessor: 'calculation',
        title: columnLabels?.calculation || 'Perhitungan',
      },
    ];

    if (showOrder) {
      cols.unshift({
        accessor: 'order',
        title: columnLabels?.order || 'Urutan',
      });
    }

    return cols;
  }, [columnLabels?.profit, columnLabels?.calculation, columnLabels?.order, showOrder]);

  return (
    <Stack gap={12} className={className}>
      {(title || searchable) && (
        <Group justify="space-between" wrap="nowrap">
          {title && <Text fw={600}>{title}</Text>}
          {searchable && (
            <Box w={220}>
              <TextInput
                value={search}
                onChange={(e) => setSearch(e.currentTarget.value)}
                placeholder="Cari..."
                size="sm"
              />
            </Box>
          )}
        </Group>
      )}

      <DataTable<TableProfitSharingDataT>
        idAccessor="id"
        records={filteredRecords}
        columns={columns}
        withTableBorder
        withColumnBorders={false}
        highlightOnHover
        striped
        page={page}
        onPageChange={setPage}
        totalRecords={filteredRecords.length}
        recordsPerPage={pageSizeState}
        onRecordsPerPageChange={(val) => {
          setPage(1);
          setPageSizeState(val);
        }}
        recordsPerPageOptions={[3, 5, 10, 15, 20]}
        paginationText={({ from, to, totalRecords }) =>
          `${from}–${to} dari ${totalRecords}`
        }
      />
    </Stack>
  );
};

export default DisplayTableProfit;


