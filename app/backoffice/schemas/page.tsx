'use client';

import { useCallback, useEffect, useRef, useState } from "react";
import ControlLayout from "@/components/layouts/ControlLayoutClient";
import { Stack } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import TableCard from "@/components/Molecules/Cards/TableCard";
import { TimelineDataT } from "@/config/types";
import TimelineForm from "@/components/Molecules/Forms/TimelineForm";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setModalCRUD, setData, setLimit, setLoading, setPage, setSearch, setSortStatus, setTotalRecords } from "@/store/dataTimelineSlice";
import GlobalIcon from "@/components/Atoms/Icon/GlobalIcon";
import { Badge } from "@mantine/core";

const BackofficeSchemasPage = () => {
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
  } = useAppSelector((state) => state.timeline);
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

      const response = await fetch(`/api/schemas?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Gagal memuat data timeline");
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

  const handleCreate = useCallback(async (values: Partial<TimelineDataT>) => {
    dispatch(setLoading(true));
    try {
      const response = await fetch("/api/schemas", {
        method: "POST",
        body: JSON.stringify({
          icon: values.icon,
          title: values.title,
          description: values.description,
          color: values.color || "primary",
          order: values.order
        }),
      });
      if (!response.ok) {
        throw new Error("Gagal membuat timeline");
      }
      loadDatas();
      notifications.show({
        color: "green",
        title: "Berhasil membuat timeline",
        message: "Timeline berhasil dibuat",
      });
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Gagal membuat timeline",
        message: (error as Error).message,
      }); 
    } finally {
      dispatch(setLoading(false));
    }
  }, [loadDatas, dispatch]);

  const handleEdit = useCallback(async (values: Partial<TimelineDataT>) => {
    dispatch(setLoading(true));
    try {
      const response = await fetch("/api/schemas", {
        method: "PUT",
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        throw new Error("Gagal mengubah data timeline");
      }
      loadDatas();
      notifications.show({
        color: "green",
        title: "Berhasil mengubah timeline",
        message: "Timeline berhasil diubah",
      });
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Gagal mengubah timeline",
        message: (error as Error).message,
      });
    } finally {
      dispatch(setLoading(false));
    }
  }, [loadDatas, dispatch]);

  const handleDelete = useCallback(async (values: Partial<TimelineDataT>[]) => {
    dispatch(setLoading(true));
    try {
      const response = await fetch("/api/schemas", {
        method: "DELETE",
        body: JSON.stringify({ids: values.map((value) => value.id)}),
      });
      if (!response.ok) {
        throw new Error("Gagal menghapus data timeline");
      }
      loadDatas();
      notifications.show({
        color: "green",
        title: "Berhasil menghapus data timeline",
        message: "Data timeline berhasil dihapus",
      });
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Gagal menghapus data timeline",
        message: (error as Error).message,
      });
    } finally {
      dispatch(setLoading(false));
    }
  }, [loadDatas, dispatch]);

  const preCondDelete = useCallback(async (value: Partial<TimelineDataT>) => {
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
          title="Timeline Management"
          modalLabel="Tambah Timeline"
          openModal={() => dispatch(setModalCRUD(true))}
        />
      </Stack>
    );
  }

  return (
    <Stack>
      <ControlLayout
        title="Timeline Management"
        modalLabel="Tambah Timeline"
        openModal={() => dispatch(setModalCRUD(true))}
      />
      <TableCard<TimelineDataT>
        records={data}
        columns={[
          {
            accessor: "icon",
            title: "Icon",
            sortable: false,
            width: "70px",
            render: (record: TimelineDataT) => {
              return <GlobalIcon name={record.icon} size={28} />;
            },
          },
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
            render: (record: TimelineDataT) => {
              return <span style={{ whiteSpace: 'pre-line' }}>{record.description}</span>;
            },
          },
          {
            accessor: "color",
            title: "Color",
            sortable: false,
            width: "10%",
            render: (record: TimelineDataT) => {
              return <Badge color={record.color}>{record.color}</Badge>;
            },
          },
          {
            accessor: "order",
            title: "Order",
            sortable: true,
            width: "100px",
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
        FormData={TimelineForm}
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

export default BackofficeSchemasPage;

