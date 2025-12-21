'use client';

import { useCallback, useEffect, useRef, useState } from "react";
import ControlLayout from "@/components/layouts/ControlLayoutClient";
import { Stack } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import TableCard from "@/components/Molecules/Cards/TableCard";
import { LegalDataT } from "@/config/types";
import LegalForm from "@/components/Molecules/Forms/LegalForm";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setModalCRUD, setData, setLimit, setLoading, setPage, setSearch, setSortStatus, setTotalRecords } from "@/store/dataLegalSlice";

const BackofficeLegalsPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const prevSearchRef = useRef<string>("");
  const skipLoadRef = useRef<boolean>(false);
  
  const { 
    modalCRUD,
    limit, 
    page, 
    loading, 
    data, 
    totalRecords,
    search, 
    sortStatus, 
  } = useAppSelector((state) => state.legal);
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
        sortColumn: sortStatus.columnAccessor || "order",
        sortDirection: sortStatus.direction || "asc",
      });

      const response = await fetch(`/api/legals?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Gagal memuat data legal");
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

  const handleCreate = useCallback(async (values: Partial<LegalDataT>) => {
    dispatch(setLoading(true));
    try {
      const response = await fetch("/api/legals", {
        method: "POST",
        body: JSON.stringify({
          title: values.title,
          description: values.description,
          order: values.order
        }),
      });
      if (!response.ok) {
        throw new Error("Gagal membuat legal");
      }
      loadDatas();
      notifications.show({
        color: "green",
        title: "Berhasil membuat legal",
        message: "Legal berhasil dibuat",
      });
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Gagal membuat legal",
        message: (error as Error).message,
      });
    } finally {
      dispatch(setLoading(false));
    }
  }, [loadDatas, dispatch]);

  const handleEdit = useCallback(async (values: Partial<LegalDataT>) => {
    dispatch(setLoading(true));
    try {
      const response = await fetch("/api/legals", {
        method: "PUT",
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        throw new Error("Gagal mengubah data legal");
      }
      loadDatas();
      notifications.show({
        color: "green",
        title: "Berhasil mengubah legal",
        message: "Legal berhasil diubah",
      });
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Gagal mengubah legal",
        message: (error as Error).message,
      });
    } finally {
      dispatch(setLoading(false));
    }
  }, [loadDatas, dispatch]);

  const handleDelete = useCallback(async (values: Partial<LegalDataT>[]) => {
    dispatch(setLoading(true));
    try {
      const response = await fetch("/api/legals", {
        method: "DELETE",
        body: JSON.stringify({ids: values.map((value) => value.id)}),
      });
      if (!response.ok) {
        throw new Error("Gagal menghapus data legal");
      }
      loadDatas();
      notifications.show({
        color: "green",
        title: "Berhasil menghapus data legal",
        message: "Data legal berhasil dihapus",
      });
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Gagal menghapus data legal",
        message: (error as Error).message,
      });
    } finally {
      dispatch(setLoading(false));
    }
  }, [loadDatas, dispatch]);

  const preCondDelete = useCallback(async (value: Partial<LegalDataT>) => {
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
          title="Legal Management"
          modalLabel="Tambah Legal"
          openModal={() => dispatch(setModalCRUD(true))}
        />
      </Stack>
    );
  }

  return (
    <Stack>
      <ControlLayout
        title="Legal Management"
        modalLabel="Tambah Legal"
        openModal={() => dispatch(setModalCRUD(true))}
      />
      <TableCard<LegalDataT>
        records={data}
        columns={[
          {
            accessor: "title",
            title: "Title",
            sortable: true,
            width: "20%",
          },
          {
            accessor: "description",
            title: "Description",
            sortable: false,
            render: (record: LegalDataT) => {
              return <span style={{ whiteSpace: 'pre-line' }}>{record.description}</span>;
            },
          },
          {
            accessor: "order",
            title: "Order",
            sortable: true,
            width: "10%",
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
        FormData={LegalForm}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={preCondDelete}
        onDeleteAll={handleDelete}
        canBulkAction={true}
        sortStatus={sortStatus}
        onSortStatusChange={(value) => dispatch(setSortStatus(value))}
        isModalOpen={modalCRUD}
        setIsModal={(value) => dispatch(setModalCRUD(value))}
      />
    </Stack>
  );
};

export default BackofficeLegalsPage;
