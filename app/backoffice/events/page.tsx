'use client';

import { useCallback, useEffect, useRef, useState, Suspense } from "react";
import ControlLayout from "@/components/layouts/ControlLayoutClient";
import { Stack, Image, AspectRatio, Anchor, Button, Group, LoadingOverlay } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import TableCard from "@/components/Molecules/Cards/TableCard";
import { EventDataT } from "@/config/types";
import EventForm from "@/components/Molecules/Forms/EventForm";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setModalCRUD, setData, setLimit, setLoading, setPage, setSearch, setSortStatus, setTotalRecords } from "@/store/dataEventSlice";
import { useSearchParams } from "next/navigation";
import Icon from "@/components/Atoms/Icon";

const BackofficeEventsPageContent = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [googleDriveConnected, setGoogleDriveConnected] = useState(false);
  const prevSearchRef = useRef<string>("");
  const skipLoadRef = useRef<boolean>(false);
  const searchParams = useSearchParams();
  
  const { 
    modalCRUD,
    limit, 
    page, 
    loading, 
    data, 
    totalRecords,
    search, 
    sortStatus, 
  } = useAppSelector((state) => state.event);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const checkGoogleDriveStatus = async () => {
      try {
        const response = await fetch('/api/upload/gdrive/status');
        if (response.ok) {
          const data = await response.json();
          setGoogleDriveConnected(data.connected || false);
        }
      } catch (error) {
        console.error('Failed to check Google Drive status:', error);
        setGoogleDriveConnected(false);
      }
    };

    if (isMounted) {
      checkGoogleDriveStatus();
    }
  }, [isMounted]);

  useEffect(() => {
    if (isMounted) {
      const connected = searchParams.get('google_drive_connected');
      const error = searchParams.get('error');
      
      if (connected === 'true') {
        notifications.show({
          color: "green",
          title: "Google Drive terhubung",
          message: "Google Drive berhasil dihubungkan. Anda sekarang bisa upload image.",
        });
        setGoogleDriveConnected(true);
        window.history.replaceState({}, '', window.location.pathname);
      } else if (error) {
        notifications.show({
          color: "red",
          title: "Gagal menghubungkan Google Drive",
          message: decodeURIComponent(error),
        });
        setGoogleDriveConnected(false);
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, [isMounted, searchParams]);

  const handleAuthorizeGoogleDrive = async () => {
    try {
      const response = await fetch('/api/upload/gdrive/auth');
      if (!response.ok) {
        throw new Error('Gagal mendapatkan auth URL');
      }
      const data = await response.json();
      if (data.authUrl) {
        window.location.href = data.authUrl;
      }
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Gagal",
        message: (error as Error).message,
      });
    }
  };

  const loadDatas = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search: search || "",
        sortColumn: sortStatus.columnAccessor || "date",
        sortDirection: sortStatus.direction || "desc",
      });

      const response = await fetch(`/api/events?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Gagal memuat data event");
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

  const handleCreate = useCallback(async (values: Partial<EventDataT>) => {
    dispatch(setLoading(true));
    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: values.imageUrl,
          meetingLink: values.meetingLink || "",
          location: values.location || "",
          date: values.date,
          title: values.title,
          description: values.description,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal membuat event");
      }
      dispatch(setModalCRUD(false));
      loadDatas();
      notifications.show({
        color: "green",
        title: "Berhasil membuat event",
        message: "Event berhasil dibuat",
      });
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Gagal membuat event",
        message: (error as Error).message,
      }); 
    } finally {
      dispatch(setLoading(false));
    }
  }, [loadDatas, dispatch]);

  const handleEdit = useCallback(async (values: Partial<EventDataT>) => {
    dispatch(setLoading(true));
    try {
      const response = await fetch("/api/events", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal mengubah data event");
      }
      dispatch(setModalCRUD(false));
      loadDatas();
      notifications.show({
        color: "green",
        title: "Berhasil mengubah event",
        message: "Event berhasil diubah",
      });
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Gagal mengubah event",
        message: (error as Error).message,
      });
    } finally {
      dispatch(setLoading(false));
    }
  }, [loadDatas, dispatch]);

  const handleDelete = useCallback(async (values: Partial<EventDataT>[]) => {
    dispatch(setLoading(true));
    try {
      const response = await fetch("/api/events", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ids: values.map((value) => value.id)}),
      });
      if (!response.ok) {
        throw new Error("Gagal menghapus data event");
      }
      loadDatas();
      notifications.show({
        color: "green",
        title: "Berhasil menghapus data event",
        message: "Data event berhasil dihapus",
      });
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Gagal menghapus data event",
        message: (error as Error).message,
      });
    } finally {
      dispatch(setLoading(false));
    }
  }, [loadDatas, dispatch]);

  const preCondDelete = useCallback(async (value: Partial<EventDataT>) => {
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
          title="Event Management"
          modalLabel="Tambah Event"
          openModal={() => dispatch(setModalCRUD(true))}
        />
      </Stack>
    );
  }

  return (
    <Stack>
      <ControlLayout
        title="Event Management"
        modalLabel="Tambah Event"
        openModal={() => dispatch(setModalCRUD(true))}
      />
      {!googleDriveConnected && (
        <Group justify="flex-end">
          <Button
            variant="light"
            color="blue"
            leftSection={<Icon name="IconCloud" />}
            onClick={handleAuthorizeGoogleDrive}
          >
            Hubungkan Google Drive
          </Button>
        </Group>
      )}
      <TableCard<EventDataT>
        records={data}
        columns={[
          {
            accessor: "imageUrl",
            title: "Image",
            sortable: false,
            width: "150px",
            render: (record: EventDataT) => {
              return (
                <AspectRatio ratio={16 / 9} w={120}>
                  <Image
                    src={record.imageUrl}
                    alt={record.title}
                    fit="cover"
                    radius="md"
                  />
                </AspectRatio>
              );
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
            width: "30%",
            render: (record: EventDataT) => {
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
            accessor: "date",
            title: "Date",
            sortable: true,
            width: "15%",
            render: (record: EventDataT) => {
              return new Date(record.date).toLocaleString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });
            },
          },
          {
            accessor: "location",
            title: "Location",
            sortable: false,
            width: "15%",
            render: (record: EventDataT) => {
              return record.location || "-";
            },
          },
          {
            accessor: "meetingLink",
            title: "Meeting Link",
            sortable: false,
            width: "15%",
            render: (record: EventDataT) => {
              return record.meetingLink ? (
                <Anchor href={record.meetingLink} target="_blank" rel="noopener noreferrer">
                  Buka Link
                </Anchor>
              ) : (
                "-"
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
        FormData={EventForm}
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

const BackofficeEventsPage = () => {
  return (
    <Suspense fallback={
      <Stack gap="md" p="md">
        <LoadingOverlay visible={true} zIndex={1000} />
      </Stack>
    }>
      <BackofficeEventsPageContent />
    </Suspense>
  );
};

export default BackofficeEventsPage;
