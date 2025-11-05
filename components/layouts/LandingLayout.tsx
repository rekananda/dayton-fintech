'use client';

import { AppShell, Container, Stack, Group, Text } from '@mantine/core';
import { AppHeader } from './AppHeader';

interface LandingLayoutProps {
  children: React.ReactNode;
}

export function LandingLayout({ children }: LandingLayoutProps) {
  return (
    <AppShell
      header={{ height: 60 }}
      padding={0}
    >
      <AppHeader variant="landing"/>

      <AppShell.Main className="flex flex-col min-h-[calc(100vh-var(--app-shell-header-height))]">
        <div className="flex-grow">
          {children}
        </div>
        
        <footer className="bg-gray-900 text-white mt-auto">
          <Container size="xl" py="xl">
            <Group justify="space-between" align="flex-start" mb="xl">
              <Stack gap="sm">
                <Text fw={700} size="lg">Dayton Fintech</Text>
                <Text size="sm" c="dimmed">
                  Platform fintech terpercaya untuk solusi keuangan digital Anda.
                </Text>
              </Stack>
              <Group gap="xl">
                <Stack gap="xs">
                  <Text fw={600}>Produk</Text>
                  <Text size="sm" c="dimmed" className="cursor-pointer hover:text-blue-400">Pembayaran Digital</Text>
                  <Text size="sm" c="dimmed" className="cursor-pointer hover:text-blue-400">Investasi</Text>
                  <Text size="sm" c="dimmed" className="cursor-pointer hover:text-blue-400">Pinjaman</Text>
                </Stack>
                <Stack gap="xs">
                  <Text fw={600}>Perusahaan</Text>
                  <Text size="sm" c="dimmed" className="cursor-pointer hover:text-blue-400">Tentang Kami</Text>
                  <Text size="sm" c="dimmed" className="cursor-pointer hover:text-blue-400">Karir</Text>
                  <Text size="sm" c="dimmed" className="cursor-pointer hover:text-blue-400">Blog</Text>
                </Stack>
                <Stack gap="xs">
                  <Text fw={600}>Bantuan</Text>
                  <Text size="sm" c="dimmed" className="cursor-pointer hover:text-blue-400">Pusat Bantuan</Text>
                  <Text size="sm" c="dimmed" className="cursor-pointer hover:text-blue-400">Kontak</Text>
                  <Text size="sm" c="dimmed" className="cursor-pointer hover:text-blue-400">FAQ</Text>
                </Stack>
              </Group>
            </Group>
            <div className="pt-8 border-t border-gray-700">
              <Text size="sm" c="dimmed" ta="center">
                © 2025 Dayton Fintech. All rights reserved.
              </Text>
            </div>
          </Container>
        </footer>
      </AppShell.Main>
    </AppShell>
  );
}

