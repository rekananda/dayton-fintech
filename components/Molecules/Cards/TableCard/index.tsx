'use client';

import {
  ActionIcon,
  Card,
  Flex,
  Group,
  NumberInput,
  Select,
  Stack,
  Text,
} from "@mantine/core";
import { DataTable } from "mantine-datatable";
import { TableCardT } from "./type";
import Icon from "@/components/Atoms/Icon";
import { Pagination } from "@mantine/core";
import { useEffect, useState } from "react";
import MainInput from "@/components/Atoms/FormInput/MainInput";
import MainText from "@/components/Atoms/MainText";
import MainButton from "@/components/Atoms/Button/MainButton";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import useViewport from "@/hooks/useViewport";
import "./style.css";
import { Modal } from "@mantine/core";
import GlobalIcon from "@/components/Atoms/Icon/GlobalIcon";

const TableCard = <T,>({
  search,
  pagination,
  canBulkAction,
  isLoading,
  isModalOpen=false,
  FormData,
  onDeleteAll,
  onCreate,
  onEdit,
  onDelete,
  setIsModal,
  ...rest
}: TableCardT<T>) => {
  const {isMobile} = useViewport();
  const totalPages = Math.ceil(pagination.totalRecords / pagination.limit) || 1;
  const [selectedRows, setSelectedRows] = useState<T[]>([]);
  const [keyword, setKeyword] = useState<string>("");
  const [openedModal, setOpenedModal] = useState<boolean>(isModalOpen ?? false);
  const [isModalForEdit, setIsModalForEdit] = useState<boolean>(false);
  const [defaultValues, setDefaultValues] = useState<Partial<T> | undefined>(undefined);

  const noRecordsText: string = keyword && pagination.totalRecords === 0
    ? `Tidak ada data dengan nilai '${keyword}'`
    : "Tidak ada data";

  rest.noRecordsText = noRecordsText;
  rest.fetching = isLoading;
  rest.columns = [
    ...(rest.columns ?? []),
    {
      accessor: "actions",
      title: "Aksi",
      width: 120,
      render: (record) => (
        <Group gap="xs" className="table-card-actions">
          {onEdit && <ActionIcon variant="outline" color="gray" radius="xl" size={24} aria-label="Edit" onClick={() => {handleModalEdit(record);}}>
            <GlobalIcon name="EditOutlined" size={16}/>
          </ActionIcon>}
          {onDelete && <ActionIcon variant="outline" color="gray" radius="xl" size={24} aria-label="Delete" onClick={() => confirmDelete([record], true)}>
            <Icon name="IconTrash" size={"70%"}/>
          </ActionIcon>}
        </Group>
      ),
    }
  ];
  if (canBulkAction) {
    rest.selectedRecords = selectedRows;
    rest.onSelectedRecordsChange = setSelectedRows;
  }

  const clearSearch = () => {
    setKeyword("");
    search?.onSearchChange?.("");
  }

  const confirmDelete = (datas: Partial<T>[], single = false) => {
    const message = !single ? datas.length : "this";
    modals.openConfirmModal({
      title: <MainText variant="heading5" fz={20}>Delete Data</MainText>,
      children: <MainText variant="body" fz={16} mb={32}>Are you sure want to delete {message} data?</MainText>,
      labels: { confirm: "Continue", cancel: "Cancel" },
      confirmProps: { radius: "xl" },
      cancelProps: { radius: "xl" },
      onConfirm: async () => {
        try {
          if (single) {
            await onDelete?.(datas[0]);
          } else {
            await onDeleteAll?.(datas);
          }
          setSelectedRows([]);
        } catch (error) {
          notifications.show({
            color: "red",
            title: "Gagal menghapus",
            message: (error as Error).message,
          });
        }
      },
    });
  }

  const handleCloseModal = () => {
    if (!isModalForEdit) {
      setIsModal?.(false);
    } else {
      setIsModalForEdit(false);
    }
    setOpenedModal(false);
    setDefaultValues(undefined);
  };

  const handleSubmit = async (values: Partial<T>) => {
    try {
      if (isModalForEdit && onEdit) {
        await onEdit(values);
      } else if (!isModalForEdit && onCreate) {
        await onCreate(values);
      } else {
        throw new Error("Tidak ada action untuk menyimpan data");
      }
      
    } catch (error) {
      notifications.show({
        title: "Gagal memproses data",
        message: (error as Error).  message,
        color: "red",
      });
    } finally {
      handleCloseModal();
    }
  };

  const handleModalEdit = (record: Partial<T>) => {
    setIsModalForEdit(true);
    setDefaultValues(record);
    setOpenedModal(true);
  };

  useEffect(() => {
    if (isModalOpen) {
      setIsModalForEdit(false);
      setOpenedModal(true);
      setDefaultValues(undefined);
    } else {
      setOpenedModal(false);
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (!search?.onSearchChange) return;

    const handler = setTimeout(() => {
      search.onSearchChange(keyword);
    }, 200);

    return () => clearTimeout(handler);
  }, [keyword, search]);

  return (
    <Stack gap={36}>
      <Card >
        <Stack gap="md">
          <Group justify="space-between">
            <Flex
              gap="sm"
              align="center"
              w="100%"
              wrap="wrap"
              justify="space-between"
              direction={{ base: "column-reverse", sm: "row" }}
            >
              <Group gap="sm">
                {selectedRows.length>0 && <MainText variant="body">{selectedRows.length} selected</MainText>}
                {selectedRows.length>0 && <MainButton
                  variant="outline"
                  color="red"
                  rightSection={<Icon name="IconTrash" size={16} />}
                  radius="xl"
                  onClick={() => confirmDelete(selectedRows)}
                >
                  Delete
                </MainButton>}
              </Group>

              {search?.onSearchChange && <Group grow={isMobile} w={isMobile ? "100%" : "auto"}>
                <MainInput
                  placeholder={search?.searchPlaceholder || "Search..."}
                  leftSection={<Icon name="IconSearch" size={16} />}
                  radius="xl"
                  value={keyword}
                  onChange={(event) => setKeyword(event.currentTarget.value)}
                  rightSection={
                    keyword ? (
                      <ActionIcon
                        size="sm"
                        variant="subtle"
                        color="gray"
                        aria-label="Clear search"
                        onClick={clearSearch}
                      >
                        <Icon name="IconX" size={14} />
                      </ActionIcon>
                    ) : undefined}
                  rightSectionPointerEvents="all"
                />
              </Group>}
            </Flex>
          </Group>

          <DataTable 
            highlightOnHover
            striped
            idAccessor="id"
            {...rest}
          />
        </Stack>
      </Card>

      <Flex
        justify="space-between"
        align="center"
        gap="sm"
      >
        <Group gap={4}>
          <Text size="sm" c="dimmed">
            Show
          </Text>
          <Select
            data={(pagination.recordsPerPageOptions ?? [5, 10, 20, 50]).map(String)}
            value={pagination.limit.toString()}
            onChange={(value) => {
              pagination.onLimitChange(Number(value));
            }}
            radius="xl"
            w={65}
          />
          <Text size="sm" c="dimmed">
            data
          </Text>
        </Group>

        {totalPages > 1 && <Pagination.Root 
          total={totalPages} 
          value={pagination.page} 
          onChange={pagination.onPageChange}
        >
          <Group gap={5} justify="center">
            {!isMobile && pagination.page > 3 && <Pagination.First />}
            {pagination.page > 1 && <Pagination.Previous />}
            {isMobile ? <NumberInput 
              value={pagination.page}
              onChange={(value) => pagination.onPageChange(Number(value))}
              maw={65}
              min={1}
              max={totalPages}
            /> : <Pagination.Items />}
            {pagination.page < totalPages && <Pagination.Next />}
            {!isMobile && pagination.page < totalPages - 2 && <Pagination.Last />}
          </Group>
        </Pagination.Root>}
      </Flex>
      <Modal
        opened={openedModal}
        onClose={handleCloseModal}
        title={isModalForEdit ? "Edit Menu" : "Tambah Menu"}
        centered
        keepMounted={false}
      >
        {isModalForEdit && defaultValues ? (
          <FormData 
            handleSubmit={handleSubmit}
            handleCancel={handleCloseModal}
            isLoading={isLoading}
            forEdit={true as const}
            defaultValues={defaultValues}
          />
        ) : (
          <FormData 
            handleSubmit={handleSubmit}
            handleCancel={handleCloseModal}
            isLoading={isLoading}
          />
        )}
      </Modal>
    </Stack>
  );
};

export default TableCard;
