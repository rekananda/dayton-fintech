'use client';

import { Container, Title, Text, Button, Card, Group, Stack, Badge, SimpleGrid } from '@mantine/core';
import { IconCreditCard, IconShield, IconChartLine, IconWallet, IconClock, IconDeviceMobile } from '@tabler/icons-react';
import { LandingLayout } from '@/components/layouts/LandingLayout';

export default function LandingPage() {
  const features = [
    {
      icon: IconCreditCard,
      title: 'Transaksi Mudah',
      description: 'Lakukan transaksi keuangan dengan cepat dan mudah kapan saja, dimana saja.'
    },
    {
      icon: IconShield,
      title: 'Keamanan Terjamin',
      description: 'Sistem keamanan berlapis untuk melindungi data dan transaksi Anda.'
    },
    {
      icon: IconChartLine,
      title: 'Investasi Cerdas',
      description: 'Platform investasi yang mudah dipahami untuk masa depan finansial yang lebih baik.'
    },
    {
      icon: IconWallet,
      title: 'Dompet Digital',
      description: 'Kelola semua keuangan Anda dalam satu aplikasi yang terintegrasi.'
    },
    {
      icon: IconClock,
      title: 'Proses Cepat',
      description: 'Verifikasi dan persetujuan transaksi dalam hitungan menit.'
    },
    {
      icon: IconDeviceMobile,
      title: 'Mobile Friendly',
      description: 'Akses dari berbagai perangkat dengan pengalaman yang optimal.'
    },
  ];

  return (
    <LandingLayout>
      <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">

      {/* Hero Section */}
      <section className="py-20">
        <Container size="lg">
          <Stack gap="xl" align="center" className="text-center">
            <Badge size="xl" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }}>
              Platform Fintech Terpercaya
            </Badge>
            
            <Title order={1} className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white max-w-4xl">
              Solusi Keuangan Digital untuk{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Masa Depan Anda
              </span>
            </Title>
            
            <Text size="xl" c="dimmed" className="max-w-2xl">
              Platform fintech modern yang memudahkan transaksi keuangan, investasi, 
              dan pengelolaan aset digital Anda dengan aman dan efisien.
            </Text>
            
            <Group gap="md" className="mt-4">
              <Button 
                size="xl" 
                variant="gradient" 
                gradient={{ from: 'blue', to: 'cyan' }}
                className="shadow-lg hover:shadow-xl transition-shadow"
              >
                Mulai Sekarang
              </Button>
              <Button 
                size="xl" 
                variant="outline" 
                color="blue"
              >
                Pelajari Lebih Lanjut
              </Button>
            </Group>
          </Stack>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <Container size="xl">
          <Stack gap="xl" align="center" className="mb-12">
            <Title order={2} className="text-4xl font-bold text-center text-gray-900 dark:text-white">
              Mengapa Memilih Dayton Fintech?
            </Title>
            <Text size="lg" c="dimmed" className="text-center max-w-2xl">
              Kami menyediakan layanan fintech terlengkap dengan teknologi terdepan
            </Text>
          </Stack>
          
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
            {features.map((feature, index) => (
              <Card 
                key={index}
                shadow="sm" 
                padding="xl" 
                radius="md" 
                withBorder
                className="hover:shadow-lg transition-shadow cursor-pointer"
              >
                <Stack gap="md">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <feature.icon size={24} color="white" />
                  </div>
                  <Title order={4} className="text-gray-900 dark:text-white">
                    {feature.title}
                  </Title>
                  <Text size="sm" c="dimmed">
                    {feature.description}
                  </Text>
                </Stack>
              </Card>
            ))}
          </SimpleGrid>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <Container size="lg">
          <Card shadow="xl" padding="xl" radius="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600">
            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl">
              <Stack gap="xs" align="center" className="text-white">
                <Text size="3rem" fw={700}>100K+</Text>
                <Text size="lg">Pengguna Aktif</Text>
              </Stack>
              <Stack gap="xs" align="center" className="text-white">
                <Text size="3rem" fw={700}>500M+</Text>
                <Text size="lg">Transaksi Diproses</Text>
              </Stack>
              <Stack gap="xs" align="center" className="text-white">
                <Text size="3rem" fw={700}>99.9%</Text>
                <Text size="lg">Uptime System</Text>
              </Stack>
            </SimpleGrid>
          </Card>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <Container size="lg">
          <Card shadow="md" padding="xl" radius="lg" withBorder>
            <Stack gap="lg" align="center" className="text-center">
              <Title order={2} className="text-3xl font-bold text-gray-900 dark:text-white">
                Siap Memulai Perjalanan Finansial Anda?
              </Title>
              <Text size="lg" c="dimmed" className="max-w-2xl">
                Bergabunglah dengan ribuan pengguna yang telah mempercayai 
                Dayton Fintech untuk kebutuhan keuangan digital mereka.
              </Text>
              <Button 
                size="xl" 
                variant="gradient" 
                gradient={{ from: 'blue', to: 'cyan' }}
                className="shadow-lg"
              >
                Daftar Gratis Sekarang
              </Button>
            </Stack>
          </Card>
        </Container>
      </section>

      </div>
    </LandingLayout>
  );
}
