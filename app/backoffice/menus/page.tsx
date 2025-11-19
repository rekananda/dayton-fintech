'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Group,
  NumberInput,
  Paper,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';

type MenuItem = {
  id: number;
  label: string;
  href: string;
  order: number;
};

export default function BackofficeMenusPage() {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  const [newLabel, setNewLabel] = useState('');
  const [newHref, setNewHref] = useState('');
  const [newOrder, setNewOrder] = useState<number | ''>('');

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [editHref, setEditHref] = useState('');
  const [editOrder, setEditOrder] = useState<number | ''>('');
  const isEditing = useMemo(() => editingId !== null, [editingId]);

  async function loadMenus() {
    setLoading(true);
    try {
      const res = await fetch('/api/menus', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load menus');
      const data = (await res.json()) as MenuItem[];
      setMenus(data);
    } catch (e) {
      notifications.show({ color: 'red', title: 'Error', message: 'Gagal memuat data menus' });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMenus();
  }, []);

  async function handleCreate() {
    if (!newLabel || !newHref || newOrder === '' || Number.isNaN(Number(newOrder))) {
      notifications.show({ color: 'yellow', title: 'Validasi', message: 'Lengkapi semua field' });
      return;
    }
    setCreating(true);
    try {
      const res = await fetch('/api/menus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label: newLabel, href: newHref, order: Number(newOrder) }),
      });
      if (!res.ok) throw new Error('Failed create');
      setNewLabel('');
      setNewHref('');
      setNewOrder('');
      await loadMenus();
      notifications.show({ color: 'green', title: 'Sukses', message: 'Menu dibuat' });
    } catch {
      notifications.show({ color: 'red', title: 'Error', message: 'Gagal membuat menu' });
    } finally {
      setCreating(false);
    }
  }

  function startEdit(item: MenuItem) {
    setEditingId(item.id);
    setEditLabel(item.label);
    setEditHref(item.href);
    setEditOrder(item.order);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditLabel('');
    setEditHref('');
    setEditOrder('');
  }

  async function saveEdit() {
    if (editingId === null) return;
    if (!editLabel || !editHref || editOrder === '' || Number.isNaN(Number(editOrder))) {
      notifications.show({ color: 'yellow', title: 'Validasi', message: 'Lengkapi semua field' });
      return;
    }
    try {
      const res = await fetch(`/api/menus/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label: editLabel, href: editHref, order: Number(editOrder) }),
      });
      if (!res.ok) throw new Error('Failed update');
      await loadMenus();
      notifications.show({ color: 'green', title: 'Sukses', message: 'Perubahan disimpan' });
      cancelEdit();
    } catch {
      notifications.show({ color: 'red', title: 'Error', message: 'Gagal menyimpan perubahan' });
    }
  }

  async function deleteItem(id: number) {
    try {
      const res = await fetch(`/api/menus/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed delete');
      await loadMenus();
      notifications.show({ color: 'green', title: 'Sukses', message: 'Menu dihapus' });
    } catch {
      notifications.show({ color: 'red', title: 'Error', message: 'Gagal menghapus menu' });
    }
  }

  return (
    <Stack gap="lg">
      <Title order={2}>Manage Menus</Title>

      <Paper withBorder p="md" radius="md">
        <Text fw={600} mb="sm">
          Tambah Menu
        </Text>
        <Group align="end" grow>
          <TextInput
            label="Label"
            placeholder="Home"
            value={newLabel}
            onChange={(e) => setNewLabel(e.currentTarget.value)}
          />
          <TextInput
            label="Href"
            placeholder="home"
            value={newHref}
            onChange={(e) => setNewHref(e.currentTarget.value)}
          />
          <NumberInput
            label="Order"
            placeholder="1"
            value={newOrder}
            onChange={setNewOrder}
            min={1}
          />
          <Button onClick={handleCreate} loading={creating}>
            Tambah
          </Button>
        </Group>
      </Paper>

      <Paper withBorder p="md" radius="md">
        <Text fw={600} mb="sm">
          Daftar Menu {loading ? '(memuat...)' : ''}
        </Text>
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ID</Table.Th>
              <Table.Th>Label</Table.Th>
              <Table.Th>Href</Table.Th>
              <Table.Th>Order</Table.Th>
              <Table.Th style={{ width: 220 }}>Aksi</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {menus.map((m) => {
              const isRowEditing = isEditing && editingId === m.id;
              return (
                <Table.Tr key={m.id}>
                  <Table.Td>{m.id}</Table.Td>
                  <Table.Td>
                    {isRowEditing ? (
                      <TextInput value={editLabel} onChange={(e) => setEditLabel(e.currentTarget.value)} />
                    ) : (
                      <Text>{m.label}</Text>
                    )}
                  </Table.Td>
                  <Table.Td>
                    {isRowEditing ? (
                      <TextInput value={editHref} onChange={(e) => setEditHref(e.currentTarget.value)} />
                    ) : (
                      <Text>{m.href}</Text>
                    )}
                  </Table.Td>
                  <Table.Td>
                    {isRowEditing ? (
                      <NumberInput value={editOrder} onChange={setEditOrder} min={1} />
                    ) : (
                      <Text>{m.order}</Text>
                    )}
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs" justify="flex-start">
                      {isRowEditing ? (
                        <>
                          <Button size="xs" onClick={saveEdit}>
                            Simpan
                          </Button>
                          <Button size="xs" variant="light" color="gray" onClick={cancelEdit}>
                            Batal
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button size="xs" variant="light" onClick={() => startEdit(m)}>
                            Edit
                          </Button>
                          <Button size="xs" color="red" variant="light" onClick={() => deleteItem(m.id)}>
                            Hapus
                          </Button>
                        </>
                      )}
                    </Group>
                  </Table.Td>
                </Table.Tr>
              );
            })}
            {menus.length === 0 && !loading && (
              <Table.Tr>
                <Table.Td colSpan={5}>
                  <Text c="dimmed">Belum ada data.</Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Paper>
    </Stack>
  );
}


