'use client';

import { useCallback, useEffect, useRef, useState } from "react";
import ControlLayout from "@/components/layouts/ControlLayoutClient";
import { Stack } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import TableCard from "@/components/Molecules/Cards/TableCard";
import { MenuDataT } from "@/config/types";
import MenuForm from "@/components/Molecules/Forms/MenuForm";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setModalCRUD, setData, setLimit, setLoading, setPage, setSearch, setSortStatus, setTotalRecords } from "@/store/dataMenuSlice";

const BackofficeMenusPage = () => {
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
  } = useAppSelector((state) => state.menu);
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

      const response = await fetch(`/api/menus?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Gagal memuat data menu");
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

  // const handleCreate = useCallback(async (values: Partial<MenuDataT>) => {
  //   try {
  //     const response = await fetch("/api/menus", {
  //       method: "POST",
  //       body: JSON.stringify({label: values.label, order: values.order}),
  //     });
  //     if (!response.ok) {
  //       throw new Error("Gagal membuat menu");
  //     }
  //     loadDatas();
  //     notifications.show({
  //       color: "green",
  //       title: "Berhasil membuat menu",
  //       message: "Menu berhasil dibuat",
  //     });
  //   } catch (error) {
  //     notifications.show({
  //       color: "red",
  //       title: "Gagal membuat menu",
  //       message: (error as Error).message,
  //     });
  //   }
  // }, [loadDatas]);

  const handleEdit = useCallback(async (values: Partial<MenuDataT>) => {
    dispatch(setLoading(true));
    try {
      const response = await fetch("/api/menus", {
        method: "PUT",
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        throw new Error("Gagal mengubah data menu");
      }
      loadDatas();
      notifications.show({
        color: "green",
        title: "Berhasil membuat menu",
        message: "Menu berhasil dibuat",
      });
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Gagal membuat menu",
        message: (error as Error).message,
      });
    } finally {
      dispatch(setLoading(false));
    }
  }, [loadDatas, dispatch]);

  // const preCondDelete = useCallback(async (value: Partial<MenuDataT>) => {
  //   handleDelete([value]);
  // }, []);

  // const handleDelete = useCallback(async (values: Partial<MenuDataT>[]) => {
  //   try {
  //     const response = await fetch("/api/menus", {
  //       method: "DELETE",
  //       body: JSON.stringify({ids: values.map((value) => value.id)}),
  //     });
  //     if (!response.ok) {
  //       throw new Error("Gagal menghapus data menu");
  //     }
  //     loadDatas();
  //     notifications.show({
  //       color: "green",
  //       title: "Berhasil menghapus data menu",
  //       message: "Data menu berhasil dihapus",
  //     });
  //   } catch (error) {
  //     notifications.show({
  //       color: "red",
  //       title: "Gagal menghapus data menu",
  //       message: (error as Error).message,
  //     });
  //   }
  // }, [loadDatas]);

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
          title="Menu Management"
          // modalLabel="Tambah Menu"
          // openModal={() => dispatch(setModalCRUD(true))}
        />
      </Stack>
    );
  }

  return (
    <Stack>
      <ControlLayout
        title="Menu Management"
        // modalLabel="Tambah Menu"
        // openModal={() => dispatch(setModalCRUD(true))}
      />
      <TableCard<MenuDataT>
        records={data}
        columns={[
          {
            accessor: "label",
            title: "Label",
            sortable: true,
          },
          {
            accessor: "order",
            title: "Order",
            sortable: true,
            width: "20%",
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
        FormData={MenuForm}
        // onCreate={handleCreate}
        onEdit={handleEdit}
        // onDelete={preCondDelete}
        // onDeleteAll={handleDelete}
        // canBulkAction={true}
        sortStatus={sortStatus}
        onSortStatusChange={(value) => dispatch(setSortStatus(value))}
        isModalOpen={modalCRUD}
        setIsModal={(value) => dispatch(setModalCRUD(value))}
      />
    </Stack>
  );
};

export default BackofficeMenusPage;