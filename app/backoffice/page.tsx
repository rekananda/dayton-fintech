'use client';

import { 
  Title, 
  Text, 
  Card, 
  SimpleGrid, 
  Group, 
  Stack,
  Badge,
  Progress,
  Table,
  Avatar,
  ThemeIcon
} from '@mantine/core';
import { 
  IconUsers, 
  IconCreditCard, 
  IconTrendingUp, 
  IconWallet,
  IconArrowUpRight,
  IconArrowDownRight
} from '@tabler/icons-react';

export default function BackofficeDashboard() {
  const stats = [
    {
      title: 'Total Pengguna',
      value: '12,543',
      diff: '+12.5%',
      icon: IconUsers,
      color: 'blue',
      isPositive: true
    },
    {
      title: 'Total Transaksi',
      value: 'Rp 1.2M',
      diff: '+8.2%',
      icon: IconCreditCard,
      color: 'teal',
      isPositive: true
    },
    {
      title: 'Revenue Bulan Ini',
      value: 'Rp 450K',
      diff: '+15.3%',
      icon: IconTrendingUp,
      color: 'green',
      isPositive: true
    },
    {
      title: 'Saldo Tertahan',
      value: 'Rp 89K',
      diff: '-3.1%',
      icon: IconWallet,
      color: 'orange',
      isPositive: false
    },
  ];

  const recentTransactions = [
    { 
      id: 'TRX001', 
      user: 'John Doe', 
      email: 'john@example.com',
      amount: 'Rp 250,000', 
      status: 'Berhasil', 
      type: 'Transfer'
    },
    { 
      id: 'TRX002', 
      user: 'Jane Smith', 
      email: 'jane@example.com',
      amount: 'Rp 150,000', 
      status: 'Pending', 
      type: 'Deposit'
    },
    { 
      id: 'TRX003', 
      user: 'Bob Johnson', 
      email: 'bob@example.com',
      amount: 'Rp 500,000', 
      status: 'Berhasil', 
      type: 'Withdraw'
    },
    { 
      id: 'TRX004', 
      user: 'Alice Brown', 
      email: 'alice@example.com',
      amount: 'Rp 75,000', 
      status: 'Gagal', 
      type: 'Transfer'
    },
    { 
      id: 'TRX005', 
      user: 'Charlie Wilson', 
      email: 'charlie@example.com',
      amount: 'Rp 320,000', 
      status: 'Berhasil', 
      type: 'Deposit'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Berhasil':
        return 'green';
      case 'Pending':
        return 'yellow';
      case 'Gagal':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <Stack gap="lg">
      {/* Page Header */}
      <div>
        <Title order={2} className="text-gray-900 dark:text-white mb-2">
          Dashboard
        </Title>
        <Text c="dimmed" size="sm">
          Selamat datang kembali! Berikut ringkasan aktivitas hari ini.
        </Text>
      </div>

      {/* Stats Grid */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
        {stats.map((stat, index) => (
          <Card key={index} shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="xs">
              <Text size="xs" c="dimmed" fw={600} tt="uppercase">
                {stat.title}
              </Text>
              <ThemeIcon variant="light" color={stat.color} size="lg" radius="md">
                <stat.icon size={20} />
              </ThemeIcon>
            </Group>
            
            <Text size="xl" fw={700} mb="xs">
              {stat.value}
            </Text>
            
            <Group gap="xs">
              <Group gap={4}>
                {stat.isPositive ? (
                  <IconArrowUpRight size={16} color="green" />
                ) : (
                  <IconArrowDownRight size={16} color="red" />
                )}
                <Text 
                  size="sm" 
                  fw={500}
                  c={stat.isPositive ? 'green' : 'red'}
                >
                  {stat.diff}
                </Text>
              </Group>
              <Text size="sm" c="dimmed">
                vs bulan lalu
              </Text>
            </Group>
          </Card>
        ))}
      </SimpleGrid>

      {/* Charts Row */}
      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
        {/* Transaction Volume */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="md">
            <div>
              <Text fw={600} size="lg" mb="xs">
                Volume Transaksi
              </Text>
              <Text size="sm" c="dimmed">
                Perbandingan jenis transaksi bulan ini
              </Text>
            </div>
            
            <Stack gap="sm">
              <div>
                <Group justify="space-between" mb={4}>
                  <Text size="sm">Transfer</Text>
                  <Text size="sm" fw={600}>45%</Text>
                </Group>
                <Progress value={45} color="blue" size="lg" />
              </div>
              
              <div>
                <Group justify="space-between" mb={4}>
                  <Text size="sm">Deposit</Text>
                  <Text size="sm" fw={600}>30%</Text>
                </Group>
                <Progress value={30} color="teal" size="lg" />
              </div>
              
              <div>
                <Group justify="space-between" mb={4}>
                  <Text size="sm">Withdraw</Text>
                  <Text size="sm" fw={600}>25%</Text>
                </Group>
                <Progress value={25} color="orange" size="lg" />
              </div>
            </Stack>
          </Stack>
        </Card>

        {/* User Growth */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="md">
            <div>
              <Text fw={600} size="lg" mb="xs">
                Pertumbuhan Pengguna
              </Text>
              <Text size="sm" c="dimmed">
                Pengguna baru dalam 7 hari terakhir
              </Text>
            </div>
            
            <Stack gap="sm">
              {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].map((day, index) => {
                const value = Math.floor(Math.random() * 100) + 20;
                return (
                  <div key={day}>
                    <Group justify="space-between" mb={4}>
                      <Text size="sm">{day}</Text>
                      <Text size="sm" fw={600}>{value} users</Text>
                    </Group>
                    <Progress value={value} color="green" size="sm" />
                  </div>
                );
              })}
            </Stack>
          </Stack>
        </Card>
      </SimpleGrid>

      {/* Recent Transactions */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="md">
          <Group justify="space-between">
            <div>
              <Text fw={600} size="lg" mb="xs">
                Transaksi Terbaru
              </Text>
              <Text size="sm" c="dimmed">
                5 transaksi terakhir yang masuk ke sistem
              </Text>
            </div>
            <Badge size="lg" variant="light">
              Live
            </Badge>
          </Group>

          <Table highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>ID Transaksi</Table.Th>
                <Table.Th>Pengguna</Table.Th>
                <Table.Th>Jumlah</Table.Th>
                <Table.Th>Tipe</Table.Th>
                <Table.Th>Status</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {recentTransactions.map((transaction) => (
                <Table.Tr key={transaction.id}>
                  <Table.Td>
                    <Text size="sm" fw={500}>
                      {transaction.id}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="sm">
                      <Avatar color="blue" size="sm">
                        {transaction.user.charAt(0)}
                      </Avatar>
                      <div>
                        <Text size="sm" fw={500}>
                          {transaction.user}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {transaction.email}
                        </Text>
                      </div>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" fw={600}>
                      {transaction.amount}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge variant="light" color="blue" size="sm">
                      {transaction.type}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Badge 
                      variant="light" 
                      color={getStatusColor(transaction.status)}
                      size="sm"
                    >
                      {transaction.status}
                    </Badge>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Stack>
      </Card>
    </Stack>
  );
}

