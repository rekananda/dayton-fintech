'use client';

import { Group, Stack, Badge, Box, Button } from '@mantine/core';
import { LandingLayout } from '@/components/layouts/LandingLayout';
import MainText from '@/components/Atoms/MainText';
import './landingpage.css';
import { useViewportSize } from '@mantine/hooks';
import RippleEffect from '@/components/Atoms/Effect/RippleEffect';
import Ornament from '@/components/Atoms/Effect/Ornament';

export default function LandingPage() {
  const { width } = useViewportSize();
  const isMobile = width < 768;

  return (
    <LandingLayout>
      <Stack pt={isMobile ? 130 : 90}>
        <Box  className={`home-section ${isMobile ? 'home-section-mobile' : ''}`} pt={80}>
          <RippleEffect className="home-section-ripple-l" position='left' size={isMobile ? 250 : 350}/>
          <RippleEffect className="home-section-ripple-r" position='center' size={isMobile ? 300 : 380}/>

          <Ornament className='home-ornament ornament-1' size={isMobile ? 30 : 45} type='candle' angle={-15}/>
          <Ornament className='home-ornament ornament-2' size={isMobile ? 30 : 45} type='coin' angle={15}/>
          <Ornament className='home-ornament ornament-3' size={isMobile ? 30 : 45} type='graph' angle={15}/>
          <Ornament className='home-ornament ornament-4' size={isMobile ? 30 : 45} type='waterfall' angle={-15}/>

          <Stack gap={0}>
            <Stack id="home" className='home-section-content' align='center' gap={isMobile ? 28 : 40}>
              <Badge variant="outline" className='main-badge'>Gold • XAUUSD • H1 • Tren</Badge>
              <MainText className='home-main-text' variant={isMobile ? 'heading3' : 'heading1'} maw={isMobile ? 320 : 990} ta='center'>Trading Emas Otomatis, Aman dan Terukur</MainText>
              <MainText variant='body' maw={isMobile ? 320 : 650} ta='center' fz={20}>
                Pendekatan trend-following yang disiplin dengan target adaptif mengikuti volatilitas, pengendalian eksposur, serta jeda otomatis saat rilis data berdampak tinggi.
              </MainText>
              <Group maw={isMobile ? 400 : 650} justify='center'>
                <Badge variant="outline" className='main-badge2'>Profit Sharing <b>25%</b></Badge>
                <Badge variant="outline" className='main-badge2'>Referral hingga <b>10%</b></Badge>
                <Badge variant="outline" className='main-badge2'><b>Broker MT4 • H1</b></Badge>
              </Group>
            </Stack>
            <Group id="daftar" className='home-section-content' pt={isMobile ? 32 : 80} pb={isMobile ? 182 : 80} justify='center'>
              <Button size="xl" color='primary' radius='xl'>
                Daftar via WhatsApp
              </Button>
            </Group>
          </Stack>
        </Box>

      </Stack>
      {/* <Ornament className='home-ornament' type='graph' angle={0}/>
      <Ornament className='home-ornament' type='waterfall' angle={0}/>
      <Ornament className='home-ornament' type='coin' angle={0}/> */}
      
      {/* <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">

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

      </div> */}
    </LandingLayout>
  );
}
