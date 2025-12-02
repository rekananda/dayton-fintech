'use client';

import { useCallback, useEffect, useRef, useState } from "react";
import ControlLayout from "@/components/layouts/ControlLayoutClient";
import { Stack, Badge, Group, Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import TableCard from "@/components/Molecules/Cards/TableCard";
import { BusinessModelDataT } from "@/store/dataBusinessModelSlice";
import BusinessModelForm from "@/components/Molecules/Forms/BusinessModelForm";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setModalCRUD, setData, setLimit, setLoading, setPage, setSearch, setSortStatus, setTotalRecords } from "@/store/dataBusinessModelSlice";
import { useRouter } from "next/navigation";
import { IconTable } from "@tabler/icons-react";

const BackofficeBusinessModelsPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const prevSearchRef = useRef<string>("");
  const skipLoadRef = useRef<boolean>(false);
  const router = useRouter();
  
  const { 
    modalCRUD,
    limit, 
    page, 
    loading, 
    data, 
    totalRecords,
    search, 
    sortStatus, 
  } = useAppSelector((state) => state.businessModel);
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

      const response = await fetch(`/api/business-models?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Gagal memuat data business model");
      }
      const result = await response.json();
      
      dispatch(setData(result.data || []));
      dispatch(setTotalRecords(result.total || 0));
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

  const handleCreate = useCallback(async (values: Partial<BusinessModelDataT>) => {
    dispatch(setLoading(true));
    try {
      const response = await fetch("/api/business-models", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: values.title,
          description: values.description,
          tags: values.tags || [],
          order: values.order,
          tnc: values.tnc || null,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal membuat business model");
      }
      dispatch(setModalCRUD(false));
      loadDatas();
      notifications.show({
        color: "green",
        title: "Berhasil membuat business model",
        message: "Business model berhasil dibuat",
      });
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Gagal membuat business model",
        message: (error as Error).message,
      }); 
    } finally {
      dispatch(setLoading(false));
    }
  }, [loadDatas, dispatch]);

  const handleEdit = useCallback(async (values: Partial<BusinessModelDataT>) => {
    dispatch(setLoading(true));
    try {
      const response = await fetch("/api/business-models", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal mengubah data business model");
      }
      dispatch(setModalCRUD(false));
      loadDatas();
      notifications.show({
        color: "green",
        title: "Berhasil mengubah business model",
        message: "Business model berhasil diubah",
      });
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Gagal mengubah business model",
        message: (error as Error).message,
      });
    } finally {
      dispatch(setLoading(false));
    }
  }, [loadDatas, dispatch]);

  const handleDelete = useCallback(async (values: Partial<BusinessModelDataT>[]) => {
    dispatch(setLoading(true));
    try {
      const response = await fetch("/api/business-models", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ids: values.map((value) => value.id)}),
      });
      if (!response.ok) {
        throw new Error("Gagal menghapus data business model");
      }
      loadDatas();
      notifications.show({
        color: "green",
        title: "Berhasil menghapus data business model",
        message: "Data business model berhasil dihapus",
      });
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Gagal menghapus data business model",
        message: (error as Error).message,
      });
    } finally {
      dispatch(setLoading(false));
    }
  }, [loadDatas, dispatch]);

  const preCondDelete = useCallback(async (value: Partial<BusinessModelDataT>) => {
    handleDelete([value]);
  }, [handleDelete]);

  const handleManageTables = (businessModelId: number) => {
    router.push(`/backoffice/business-models/tables?businessModelId=${businessModelId}`);
  };

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
          title="Business Model Management"
          modalLabel="Tambah Business Model"
          openModal={() => dispatch(setModalCRUD(true))}
        />
      </Stack>
    );
  }

  return (
    <Stack>
      <ControlLayout
        title="Business Model Management"
        modalLabel="Tambah Business Model"
        openModal={() => dispatch(setModalCRUD(true))}
      />
      <TableCard<BusinessModelDataT>
        records={data}
        columns={[
          {
            accessor: "title",
            title: "Title",
            sortable: true,
            width: "25%",
          },
          {
            accessor: "description",
            title: "Description",
            sortable: false,
            width: "30%",
            render: (record: BusinessModelDataT) => {
              return (
                <div style={{ 
                  overflow: "hidden", 
                  textOverflow: "ellipsis", 
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical"
                }}>
                  {record.description}
                </div>
              );
            },
          },
          {
            accessor: "tags",
            title: "Tags",
            sortable: false,
            width: "15%",
            render: (record: BusinessModelDataT) => {
              return (
                <Group gap={4}>
                  {record.tags?.map((tag, idx) => (
                    <Badge key={idx} variant="light" color="blue">
                      {tag}
                    </Badge>
                  ))}
                </Group>
              );
            },
          },
          {
            accessor: "tnc",
            title: "Terms & Conditions",
            sortable: false,
            width: "30%",
            render: (record: BusinessModelDataT) => {
              return (
                <div style={{ 
                  overflow: "hidden", 
                  textOverflow: "ellipsis", 
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical"
                }}>
                  {record.tnc || "-"}
    </div>
              );
            },
          },
          {
            accessor: "order",
            title: "Order",
            sortable: true,
            width: "10%",
          },
          {
            accessor: "manageTables",
            title: "Manage Tables",
            sortable: false,
            width: "15%",
            render: (record: BusinessModelDataT) => {
              return (
                <Button
                  variant="light"
                  size="xs"
                  leftSection={<IconTable size={16} />}
                  onClick={() => handleManageTables(record.id)}
                >
                  Manage Tables
                </Button>
              );
            },
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
        FormData={BusinessModelForm}
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

export default BackofficeBusinessModelsPage;
