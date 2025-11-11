'use client';

import { AppShell, Container, Stack, Group, Text, Box } from '@mantine/core';
import AppHeader from './AppHeader';
<<<<<<< HEAD
import { useHeadroom } from '@mantine/hooks';
import { LandingLayoutI } from './type';
import AppFooter from './AppFooter';
=======
import { useHeadroom, useInViewport } from '@mantine/hooks';
import { useEffect, useMemo, useState } from 'react';
>>>>>>> origin/stagging

export function LandingLayout({ children }: LandingLayoutI) {
  const pinned = useHeadroom({ fixedAt: 180 });

<<<<<<< HEAD
=======
export function LandingLayout({ children }: LandingLayoutProps) {
  const pinned = useHeadroom({ fixedAt: 180 });

>>>>>>> origin/stagging
  return (
    <AppShell
      header={{ height: 90, collapsed: !pinned, offset: false }}
      padding={0}
    >
      <AppHeader variant="landing"/>

      <AppShell.Main className="relative flex flex-col min-h-[100dvh]" pt={0}>
        <Box className="flex-grow">
          <Container size="1440px" className="overflow-hidden" p={0}>
            {children}
<<<<<<< HEAD
=======
          </Container>
        </Box>

        <footer>
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
>>>>>>> origin/stagging
          </Container>
        </Box>
        <AppFooter />
      </AppShell.Main>
    </AppShell>
  );
}

