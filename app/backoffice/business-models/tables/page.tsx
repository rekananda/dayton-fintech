/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState, Suspense } from "react";
import { Stack, Group, Button, TextInput, ActionIcon, Badge, Paper, Text, Modal, NumberInput, Table, Textarea } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useRouter, useSearchParams } from "next/navigation";
import Icon from "@/components/Atoms/Icon";
import MainButton from "@/components/Atoms/Button/MainButton";
import MainInput from "@/components/Atoms/FormInput/MainInput";
import { useForm } from "@mantine/form";
import { IconPlus, IconTrash, IconEdit, IconCheck, IconX } from "@tabler/icons-react";
import { LoadingOverlay } from "@mantine/core";

type TableColumn = {
  id?: number;
  key: string;
  label: string;
  order: number;
  _tempId?: string;
};

type TableRow = {
  id?: number;
  order: number;
  cells: Array<{
    columnKey: string;
    value: string;
  }>;
};

type TableData = {
  id?: number;
  name: string;
  order: number;
  businessModelId: number;
  columns: TableColumn[];
  rows: TableRow[];
};

type BusinessModelInfo = {
  id: number;
  title: string;
};

const BusinessModelTablesPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const businessModelId = searchParams.get('businessModelId');
  
  const [loading, setLoading] = useState(false);
  const [businessModel, setBusinessModel] = useState<BusinessModelInfo | null>(null);
  const [tables, setTables] = useState<TableData[]>([]);
  const [selectedTable, setSelectedTable] = useState<TableData | null>(null);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isEditingCell, setIsEditingCell] = useState<{rowIndex: number; columnKey: string} | null>(null);
  const [cellEditValue, setCellEditValue] = useState("");
  const [columnErrors, setColumnErrors] = useState<Record<string, string>>({});

  const tableForm = useForm<{ name: string; order: number }>({
    initialValues: {
      name: "",
      order: 1,
    },
    validate: {
      name: (value) => (!value ? "Table name is required" : null),
      order: (value) => (typeof value !== "number" || value < 1 ? "Order must be at least 1" : null),
    },
  });

  useEffect(() => {
    if (!businessModelId) {
      notifications.show({
        color: "red",
        title: "Error",
        message: "Business Model ID tidak ditemukan",
      });
      router.push("/backoffice/business-models");
      return;
    }

    loadBusinessModel();
    loadTables();
  }, [businessModelId]);

  const loadBusinessModel = async () => {
    try {
      const response = await fetch(`/api/business-models`);
      if (!response.ok) throw new Error("Failed to fetch business models");
      const result = await response.json();
      const model = result.data?.find((m: BusinessModelInfo) => m.id === parseInt(businessModelId || "0"));
      if (model) {
        setBusinessModel({ id: model.id, title: model.title });
      }
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Error",
        message: (error as Error).message,
      });
    }
  };

  const loadTables = async () => {
    if (!businessModelId) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/business-models/tables?businessModelId=${businessModelId}`);
      if (!response.ok) throw new Error("Failed to fetch tables");
      const result = await response.json();
      
      const transformedTables = result.data.map((table: any) => ({
        id: table.id,
        name: table.name,
        order: table.order,
        businessModelId: parseInt(businessModelId || "0"),
        columns: table.columns.map((col: any) => ({
          id: col.id,
          key: col.key,
          label: col.label,
          order: col.order,
        })),
        rows: table.rows.map((row: any) => ({
          id: row.id,
          order: row.order,
          cells: table.columns.map((col: any) => {
            const cell = row.cells.find((c: any) => c.columnId === col.id);
            return {
              columnKey: col.key,
              value: cell?.value || "",
            };
          }),
        })),
      }));
      
      setTables(transformedTables);
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Error",
        message: (error as Error).message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTable = () => {
    setIsEditMode(false);
    setSelectedTable({
      name: "",
      order: tables.length + 1,
      businessModelId: parseInt(businessModelId || "0"),
      columns: [],
      rows: [],
    });
    tableForm.setValues({
      name: "",
      order: tables.length + 1,
    });
    setIsTableModalOpen(true);
  };

  const handleEditTable = async (table: TableData) => {
    if (!table.id) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/business-models/tables?businessModelId=${businessModelId}`);
      if (!response.ok) throw new Error("Failed to fetch table details");
      const result = await response.json();
      const fullTable = result.data.find((t: any) => t.id === table.id);
      
      if (fullTable) {
        const transformedTable: TableData = {
          id: fullTable.id,
          name: fullTable.name,
          order: fullTable.order,
          businessModelId: parseInt(businessModelId || "0"),
          columns: fullTable.columns.map((col: any) => ({
            id: col.id,
            key: col.key,
            label: col.label,
            order: col.order,
          })),
          rows: fullTable.rows.map((row: any) => ({
            id: row.id,
            order: row.order,
            cells: fullTable.columns.map((col: any) => {
              const cell = row.cells.find((c: any) => c.columnId === col.id);
              return {
                columnKey: col.key,
                value: cell?.value || "",
              };
            }),
          })),
        };
        
        setIsEditMode(true);
        setSelectedTable(transformedTable);
        tableForm.setValues({
          name: transformedTable.name,
          order: transformedTable.order,
        });
        setIsTableModalOpen(true);
      }
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Error",
        message: (error as Error).message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTable = async (values: { name: string; order: number }) => {
    if (!selectedTable) return;

    // Validate column keys and set errors
    const errors: Record<string, string> = {};
    const columnKeys = selectedTable.columns.map((col) => col.key);
    
    // Check for duplicates
    selectedTable.columns.forEach((col) => {
      const occurrences = columnKeys.filter((key) => key === col.key).length;
      if (occurrences > 1) {
        errors[col.key] = "Duplicate key";
      }
    });

    // Check for empty keys
    selectedTable.columns.forEach((col) => {
      if (!col.key || col.key.trim() === "") {
        errors[col.key || ''] = "Key cannot be empty";
      }
    });

    // If there are errors, set them and prevent save
    if (Object.keys(errors).length > 0) {
      setColumnErrors(errors);
      notifications.show({
        color: "red",
        title: "Validation Error",
        message: "Please fix column key errors before saving.",
      });
      return;
    }

    // Clear all errors before saving
    setColumnErrors({});

    setLoading(true);
    try {
      const payload = {
        ...selectedTable,
        name: values.name,
        order: values.order,
      };

      const response = await fetch(`/api/business-models/tables`, {
        method: isEditMode ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save table");
      }

      notifications.show({
        color: "green",
        title: "Success",
        message: `Table ${isEditMode ? "updated" : "created"} successfully`,
      });

      setIsTableModalOpen(false);
      loadTables();
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Error",
        message: (error as Error).message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTable = async (tableId: number) => {
    if (!confirm("Are you sure you want to delete this table?")) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/business-models/tables`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: [tableId] }),
      });

      if (!response.ok) throw new Error("Failed to delete table");

      notifications.show({
        color: "green",
        title: "Success",
        message: "Table deleted successfully",
      });

      if (selectedTable?.id === tableId) {
        setSelectedTable(null);
      }
      loadTables();
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Error",
        message: (error as Error).message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddColumn = () => {
    if (!selectedTable) return;

    const newKey = `column_${Date.now()}`;
    const tempId = `temp_${Date.now()}`;
    
    const newColumn: TableColumn = {
      key: newKey,
      label: `Column ${selectedTable.columns.length + 1}`,
      order: selectedTable.columns.length + 1,
      _tempId: tempId,
    };

    setSelectedTable({
      ...selectedTable,
      columns: [...selectedTable.columns, newColumn],
      rows: selectedTable.rows.map((row) => ({
        ...row,
        cells: [...row.cells, { columnKey: newKey, value: "" }],
      })),
    });

    // Clear error for this new column
    setColumnErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[newKey];
      return newErrors;
    });
  };

  const handleUpdateColumn = (columnKey: string, field: 'key' | 'label', value: string) => {
    if (!selectedTable) return;

    if (field === 'key') {
      const oldKey = columnKey;
      const newKey = value.replace(/\s/g, '');
      
      // Clear previous error for old key
      setColumnErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[oldKey];
        return newErrors;
      });

      if (!newKey) {
        setColumnErrors((prev) => ({
          ...prev,
          [oldKey]: "Column key cannot be empty",
        }));
        return;
      }

      if (newKey === oldKey) {
        // Update the column key even if same (to trigger re-render and clear any error)
        setSelectedTable((prev) => ({
          ...prev!,
          columns: prev!.columns.map((col) =>
            col.key === oldKey ? { ...col, key: newKey } : col
          ),
        }));
        return;
      }

      // Check if new key already exists (excluding the current column)
      const keyExists = selectedTable.columns.some(
        (col) => col.key === newKey && col.key !== oldKey
      );
      
      if (keyExists) {
        setColumnErrors((prev) => ({
          ...prev,
          [oldKey]: `Key "${newKey}" already exists`,
        }));
        return;
      }

      // Clear error if key is valid
      setColumnErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[oldKey];
        return newErrors;
      });

      setSelectedTable((prev) => ({
        ...prev!,
        columns: prev!.columns.map((col) =>
          col.key === oldKey ? { ...col, key: newKey } : col
        ),
        rows: prev!.rows.map((row) => ({
          ...row,
          cells: row.cells.map((cell) =>
            cell.columnKey === oldKey ? { ...cell, columnKey: newKey } : cell
          ),
        })),
      }));
    } else {
      setSelectedTable((prev) => ({
        ...prev!,
        columns: prev!.columns.map((col) =>
          col.key === columnKey ? { ...col, [field]: value } : col
        ),
      }));
    }
  };

  const handleDeleteColumn = (columnKey: string) => {
    if (!selectedTable) return;

    setSelectedTable({
      ...selectedTable,
      columns: selectedTable.columns.filter((col) => col.key !== columnKey),
      rows: selectedTable.rows.map((row) => ({
        ...row,
        cells: row.cells.filter((cell) => cell.columnKey !== columnKey),
      })),
    });

    // Clear error for deleted column
    setColumnErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[columnKey];
      return newErrors;
    });
  };

  const handleAddRow = () => {
    if (!selectedTable) return;

    const newRow: TableRow = {
      order: selectedTable.rows.length + 1,
      cells: selectedTable.columns.map((col) => ({
        columnKey: col.key,
        value: "",
      })),
    };

    setSelectedTable({
      ...selectedTable,
      rows: [...selectedTable.rows, newRow],
    });
  };

  const handleDeleteRow = (rowIndex: number) => {
    if (!selectedTable) return;

    setSelectedTable({
      ...selectedTable,
      rows: selectedTable.rows.filter((_, idx) => idx !== rowIndex),
    });
  };

  const handleStartEditCell = (rowIndex: number, columnKey: string, currentValue: string) => {
    setIsEditingCell({ rowIndex, columnKey });
    setCellEditValue(currentValue);
  };

  const handleSaveCell = () => {
    if (!selectedTable || !isEditingCell) return;

    const { rowIndex, columnKey } = isEditingCell;
    setSelectedTable({
      ...selectedTable,
      rows: selectedTable.rows.map((row, idx) =>
        idx === rowIndex
          ? {
              ...row,
              cells: row.cells.map((cell) =>
                cell.columnKey === columnKey
                  ? { ...cell, value: cellEditValue }
                  : cell
              ),
            }
          : row
      ),
    });

    setIsEditingCell(null);
    setCellEditValue("");
  };

  const handleCancelEditCell = () => {
    setIsEditingCell(null);
    setCellEditValue("");
  };

  return (
    <Stack gap="md" p="md">
      <Group justify="space-between">
        <Group>
          <ActionIcon variant="subtle" onClick={() => router.push("/backoffice/business-models")}>
            <Icon name="IconArrowLeft" size={20} />
          </ActionIcon>
          <div>
            <Text size="xl" fw={600}>
              Manage Tables - {businessModel?.title || "Loading..."}
            </Text>
            <Text size="sm" c="dimmed">
              Business Model ID: {businessModelId}
            </Text>
          </div>
        </Group>
        <MainButton
          leftSection={<IconPlus size={18} />}
          onClick={handleCreateTable}
        >
          Add Table
        </MainButton>
      </Group>

      {tables.length === 0 && !loading ? (
        <Paper p="xl" withBorder>
          <Text ta="center" c="dimmed">
            {`No tables found. Click "Add Table" to create one.`}
          </Text>
        </Paper>
      ) : (
        <Stack gap="md">
          {tables.map((table) => (
            <Paper key={table.id} p="md" withBorder>
              <Group justify="space-between" mb="md">
                <Group>
                  <Badge variant="light" color="blue">
                    Order: {table.order}
                  </Badge>
                  <Text fw={600}>{table.name}</Text>
                </Group>
                <Group gap="xs">
                  <ActionIcon
                    variant="light"
                    color="blue"
                    onClick={() => handleEditTable(table)}
                  >
                    <IconEdit size={18} />
                  </ActionIcon>
                  <ActionIcon
                    variant="light"
                    color="red"
                    onClick={() => table.id && handleDeleteTable(table.id)}
                  >
                    <IconTrash size={18} />
                  </ActionIcon>
                </Group>
              </Group>
              
              {table.columns.length > 0 ? (
                  <Table>
                    <Table.Thead>
                      <Table.Tr bg="var(--mantine-color-gray-1)">
                        {table.columns.map((col) => (
                          <Table.Th key={col.key}>
                            {col.label}
                          </Table.Th>
                        ))}
                        <Table.Th>Actions</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {table.rows.map((row, rowIndex) => (
                        <Table.Tr key={rowIndex}>
                          {table.columns.map((col) => {
                            const cell = row.cells.find((c) => c.columnKey === col.key);
                            
                            return (
                              <Table.Td key={col.key}>
                                <Text size="sm" style={{ whiteSpace: 'pre-line' }}>{cell?.value || "-"}</Text>
                              </Table.Td>
                            );
                          })}
                          <Table.Td>
                            <ActionIcon
                              variant="subtle"
                              color="red"
                              onClick={() => handleDeleteRow(rowIndex)}
                            >
                              <IconTrash size={16} />
                            </ActionIcon>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
              ) : (
                <Text c="dimmed" size="sm">
                  No columns or rows. Edit table to add columns and rows.
                </Text>
              )}
            </Paper>
          ))}
        </Stack>
      )}

      <Modal
        opened={isTableModalOpen}
        onClose={() => {
          setIsTableModalOpen(false);
          setSelectedTable(null);
          setColumnErrors({});
        }}
        title={isEditMode ? "Edit Table" : "Create Table"}
        size="70dvw"
      >
        <form onSubmit={tableForm.onSubmit(handleSaveTable)}>
          <Stack gap="md">
            <MainInput
              label="Table Name"
              placeholder="e.g., Profit Sharing (Mingguan)"
              withAsterisk
              {...tableForm.getInputProps("name")}
            />
            <NumberInput
              label="Order"
              min={1}
              withAsterisk
              radius="xl"
              {...tableForm.getInputProps("order")}
            />

            {selectedTable && (
              <>
                <Group justify="space-between" mt="md">
                  <Text fw={600}>Columns</Text>
                  <Button
                    size="xs"
                    leftSection={<IconPlus size={16} />}
                    onClick={handleAddColumn}
                    radius="xl"
                  >
                    Add Column
                  </Button>
                </Group>

                <Stack gap="xs">
                  {selectedTable.columns.map((col, idx) => {
                    const stableKey = col._tempId || col.id || `col-${idx}`;
                    return (
                      <Group key={stableKey} gap="xs">
                        <TextInput
                          placeholder="Column key"
                          value={col.key}
                          onChange={(e) => {
                            const newValue = e.target.value.replace(/\s/g, '');
                            handleUpdateColumn(col.key, "key", newValue);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === ' ') {
                              e.preventDefault();
                            }
                          }}
                          error={columnErrors[col.key]}
                          radius="xl"
                          style={{ flex: 1 }}
                          size="xs"
                        />
                        <TextInput
                          placeholder="Column label"
                          value={col.label}
                          onChange={(e) => handleUpdateColumn(col.key, "label", e.target.value)}
                          style={{ flex: 1 }}
                          size="xs"
                          radius="xl"
                        />
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          onClick={() => handleDeleteColumn(col.key)}
                          radius="xl"
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Group>
                    );
                  })}
                </Stack>

                <Group justify="space-between" mt="md">
                  <Text fw={600}>Rows</Text>
                  <Button
                    size="xs"
                    leftSection={<IconPlus size={16} />}
                    onClick={handleAddRow}
                    disabled={selectedTable.columns.length === 0}
                    radius="xl"
                  >
                    Add Row
                  </Button>
                </Group>

                {selectedTable.columns.length > 0 && selectedTable.rows.length > 0 && (
                  <div style={{ overflowX: "auto" }}>
                    <Table style={{ fontSize: "12px" }}>
                      <Table.Thead>
                        <Table.Tr bg="var(--mantine-color-gray-1)">
                          {selectedTable.columns.map((col) => (
                            <Table.Th key={col.key} style={{ padding: "8px" }}>
                              {col.label}
                            </Table.Th>
                          ))}
                          <Table.Th style={{ padding: "8px" }}>Actions</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {selectedTable.rows.map((row, rowIndex) => (
                          <Table.Tr key={rowIndex}>
                            {selectedTable.columns.map((col) => {
                              const cell = row.cells.find((c) => c.columnKey === col.key);
                              const isEditing = isEditingCell?.rowIndex === rowIndex && isEditingCell?.columnKey === col.key;
                              
                              return (
                                <Table.Td key={col.key} style={{ padding: "4px" }}>
                                  {isEditing ? (
                                    <Group gap={4}>
                                      <Textarea
                                        value={cellEditValue}
                                        onChange={(e) => setCellEditValue(e.target.value)}
                                        size="xs"
                                        style={{ flex: 1 }}
                                        autoFocus
                                        radius="lg"
                                        minRows={1}
                                        maxRows={4}
                                        autosize
                                        resize="vertical"
                                      />
                                      <ActionIcon
                                        variant="subtle"
                                        color="green"
                                        size="xs"
                                        onClick={handleSaveCell}
                                      >
                                        <IconCheck size={14} />
                                      </ActionIcon>
                                      <ActionIcon
                                        variant="subtle"
                                        color="red"
                                        size="xs"
                                        onClick={handleCancelEditCell}
                                      >
                                        <IconX size={14} />
                                      </ActionIcon>
                                    </Group>
                                  ) : (
                                    <div
                                      onClick={() => handleStartEditCell(rowIndex, col.key, cell?.value || "")}
                                      style={{
                                        cursor: "pointer",
                                        padding: "2px 4px",
                                        minHeight: "20px",
                                      }}
                                    >
                                      {cell?.value || <Text c="dimmed" size="xs">Click</Text>}
                                    </div>
                                  )}
                                </Table.Td>
                              );
                            })}
                            <Table.Td style={{ padding: "4px" }}>
                              <ActionIcon
                                variant="subtle"
                                color="red"
                                size="xs"
                                onClick={() => handleDeleteRow(rowIndex)}
                              >
                                <IconTrash size={14} />
                              </ActionIcon>
                            </Table.Td>
                          </Table.Tr>
                        ))}
                      </Table.Tbody>
                    </Table>
                  </div>
                )}
              </>
            )}

            <Group justify="flex-end" mt="md">
              <Button
                variant="outline"
                onClick={() => {
                  setIsTableModalOpen(false);
                  setSelectedTable(null);
                }}
              >
                Cancel
              </Button>
              <MainButton type="submit" loading={loading}>
                {isEditMode ? "Save" : "Create"}
              </MainButton>
            </Group>
          </Stack>
        </form>
      </Modal>

      <LoadingOverlay visible={loading} zIndex={1000} />
    </Stack>
  );
};

const BusinessModelTablesPage = () => {
  return (
    <Suspense fallback={
      <Stack gap="md" p="md">
        <LoadingOverlay visible={true} zIndex={1000} />
      </Stack>
    }>
      <BusinessModelTablesPageContent />
    </Suspense>
  );
};

export default BusinessModelTablesPage;

