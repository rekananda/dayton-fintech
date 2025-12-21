'use client';

import { useCallback, useEffect, useRef, useState } from "react";
import ControlLayout from "@/components/layouts/ControlLayoutClient";
import { Stack } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import TableCard from "@/components/Molecules/Cards/TableCard";
import { QnADataT } from "@/config/types";
import QnAForm from "@/components/Molecules/Forms/QnAForm";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setModalCRUD, setData, setLimit, setLoading, setPage, setSearch, setSortStatus, setTotalRecords } from "@/store/dataQnASlice";

const BackofficeFaqsPage = () => {
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
  } = useAppSelector((state) => state.qna);
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

      const response = await fetch(`/api/faqs?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Gagal memuat data Q&A");
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

  const handleCreate = useCallback(async (values: Partial<QnADataT>) => {
    try {
      const response = await fetch("/api/faqs", {
        method: "POST",
        body: JSON.stringify({
          question: values.question,
          answer: values.answer,
          order: values.order
        }),
      });
      if (!response.ok) {
        throw new Error("Gagal membuat Q&A");
      }
      loadDatas();
      notifications.show({
        color: "green",
        title: "Berhasil membuat Q&A",
        message: "Q&A berhasil dibuat",
      });
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Gagal membuat Q&A",
        message: (error as Error).message,
      });
    }
  }, [loadDatas]);

  const handleEdit = useCallback(async (values: Partial<QnADataT>) => {
    try {
      const response = await fetch("/api/faqs", {
        method: "PUT",
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        throw new Error("Gagal mengubah data Q&A");
      }
      loadDatas();
      notifications.show({
        color: "green",
        title: "Berhasil mengubah Q&A",
        message: "Q&A berhasil diubah",
      });
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Gagal mengubah Q&A",
        message: (error as Error).message,
      });
    }
  }, [loadDatas]);

  const handleDelete = useCallback(async (values: Partial<QnADataT>[]) => {
    try {
      const response = await fetch("/api/faqs", {
        method: "DELETE",
        body: JSON.stringify({ids: values.map((value) => value.id)}),
      });
      if (!response.ok) {
        throw new Error("Gagal menghapus data Q&A");
      }
      loadDatas();
      notifications.show({
        color: "green",
        title: "Berhasil menghapus data Q&A",
        message: "Data Q&A berhasil dihapus",
      });
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Gagal menghapus data Q&A",
        message: (error as Error).message,
      });
    }
  }, [loadDatas]);

  const preCondDelete = useCallback(async (value: Partial<QnADataT>) => {
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
          title="Q&A Management"
          modalLabel="Tambah Q&A"
          openModal={() => dispatch(setModalCRUD(true))}
        />
      </Stack>
    );
  }

  return (
    <Stack>
      <ControlLayout
        title="Q&A Management"
        modalLabel="Tambah Q&A"
        openModal={() => dispatch(setModalCRUD(true))}
      />
      <TableCard<QnADataT>
        records={data}
        columns={[
          {
            accessor: "question",
            title: "Question",
            sortable: true,
            render: (record: QnADataT) => {
              return <span style={{ whiteSpace: 'pre-line' }}>{record.question}</span>;
            },
          },
          {
            accessor: "answer",
            title: "Answer",
            sortable: false,
            width: "40%",
            render: (record: QnADataT) => {
              return <span style={{ whiteSpace: 'pre-line' }}>{record.answer}</span>;
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
        FormData={QnAForm}
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

export default BackofficeFaqsPage;
