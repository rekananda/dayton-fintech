'use client';

import { useCallback, useEffect, useRef, useState } from "react";
import ControlLayout from "@/components/layouts/ControlLayoutClient";
import { Stack, Badge, Group } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import TableCard from "@/components/Molecules/Cards/TableCard";
import { ConfigDataT } from "@/config/types";
import ConfigForm from "@/components/Molecules/Forms/ConfigForm";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setModalCRUD, setData, setLimit, setLoading, setPage, setSearch, setSortStatus, setTotalRecords } from "@/store/dataConfigSlice";
import mainConfig from "@/config";

const BackofficeConfigsPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const prevSearchRef = useRef<string>("");
  const skipLoadRef = useRef<boolean>(false);
  const { canAddNewConfig } = mainConfig;
  
  const { 
    modalCRUD,
    limit, 
    page, 
    loading, 
    data, 
    totalRecords,
    search, 
    sortStatus, 
  } = useAppSelector((state) => state.config);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const loadDatas = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search: search || "",
        sortColumn: sortStatus.columnAccessor || "key",
        sortDirection: sortStatus.direction || "asc",
      });

      const response = await fetch(`/api/configs?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Gagal memuat data config");
      }
      const result = await response.json();
      
      if (Array.isArray(result)) {
        dispatch(setData(result));
        dispatch(setTotalRecords(result.length));
      } else {
        dispatch(setData(result.data || []));
        dispatch(setTotalRecords(result.total || 0));
      }
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Gagal memuat data",
        message: (error as Error).message,
      });
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, page, limit, search, sortStatus]);

  const handleCreate = useCallback(async (values: Partial<ConfigDataT>) => {
    try {
      const response = await fetch("/api/configs", {
        method: "POST",
        body: JSON.stringify({
          key: values.key,
          value: values.value,
          description: values.description
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal membuat config");
      }
      loadDatas();
      notifications.show({
        color: "green",
        title: "Berhasil membuat config",
        message: "Config berhasil dibuat",
      });
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Gagal membuat config",
        message: (error as Error).message,
      });
    }
  }, [loadDatas]);

  const handleEdit = useCallback(async (values: Partial<ConfigDataT>) => {
    try {
      const response = await fetch("/api/configs", {
        method: "PUT",
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal mengubah data config");
      }
      loadDatas();
      notifications.show({
        color: "green",
        title: "Berhasil mengubah config",
        message: "Config berhasil diubah",
      });
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Gagal mengubah config",
        message: (error as Error).message,
      });
    }
  }, [loadDatas]);

  const handleDelete = useCallback(async (values: Partial<ConfigDataT>[]) => {
    try {
      const response = await fetch("/api/configs", {
        method: "DELETE",
        body: JSON.stringify({ids: values.map((value) => value.id)}),
      });
      if (!response.ok) {
        throw new Error("Gagal menghapus data config");
      }
      loadDatas();
      notifications.show({
        color: "green",
        title: "Berhasil menghapus data config",
        message: "Data config berhasil dihapus",
      });
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Gagal menghapus data config",
        message: (error as Error).message,
      });
    }
  }, [loadDatas]);

  const preCondDelete = useCallback(async (value: Partial<ConfigDataT>) => {
    handleDelete([value]);
  }, [handleDelete]);

  useEffect(() => {
    if (isMounted && search !== prevSearchRef.current) {
      prevSearchRef.current = search;
      skipLoadRef.current = true;
      loadDatas();
    }
  }, [search, isMounted, dispatch, loadDatas]);

  useEffect(() => {
    if (isMounted && !skipLoadRef.current) {
      loadDatas();
    }
    skipLoadRef.current = false;
  }, [loadDatas, isMounted]);

  if (!isMounted) {
    return (
      <Stack>
        <ControlLayout
          title="Config Management"
          modalLabel={canAddNewConfig ? "Tambah Config" : undefined}
          openModal={canAddNewConfig ? () => dispatch(setModalCRUD(true)) : () => {}}
        />
      </Stack>
    );
  }

  return (
    <Stack>
      <ControlLayout
        title="Config Management"
        modalLabel={canAddNewConfig ? "Tambah Config" : undefined}
        openModal={canAddNewConfig ? () => dispatch(setModalCRUD(true)) : () => {}}
      />
      <TableCard<ConfigDataT>
        records={data}
        columns={[
          {
            accessor: "key",
            title: "Key",
            sortable: true,
            width: "20%",
          },
          {
            accessor: "value",
            title: "Value",
            sortable: false,
            render: (record: ConfigDataT) => {
              const value = record.value;
              if (!value) return null;
              
              try {
                const parsed = JSON.parse(value);
                if (Array.isArray(parsed)) {
                  return (
                    <Group gap="xs">
                      {parsed.map((item: string, index: number) => (
                        <Badge key={index} variant="outline" className='main-badge2'>
                          <span dangerouslySetInnerHTML={{ __html: item }} />
                        </Badge>
                      ))}
                    </Group>
                  );
                }
              } catch {
                // Not a valid JSON, treat as string
              }
              
              return <span style={{ whiteSpace: 'pre-line' }}>{value}</span>;
            },
          },
          {
            accessor: "description",
            title: "Description",
            sortable: false,
            width: "30%",
          },
        ]}
        isLoading={loading}
        pagination={{
          limit: limit,
          page: page,
          onLimitChange: (value) => dispatch(setLimit(value)),
          onPageChange: (value) => dispatch(setPage(value)),
          totalRecords: totalRecords,
        }}
        search={{
          searchValue: search,
          onSearchChange: (value) => dispatch(setSearch(value)),
        }}
        FormData={ConfigForm}
        onCreate={canAddNewConfig ? handleCreate : undefined}
        onEdit={handleEdit}
        onDelete={canAddNewConfig ? preCondDelete : undefined}
        // onDeleteAll={canAddNewConfig ? handleDelete : undefined}
        // canBulkAction={canAddNewConfig ? true : false}
        sortStatus={sortStatus}
        onSortStatusChange={(value) => dispatch(setSortStatus(value))}
        isModalOpen={modalCRUD}
        setIsModal={(value) => dispatch(setModalCRUD(value))}
      />
    </Stack>
  );
};

export default BackofficeConfigsPage;
