'use client';

import { AppShell, Container, Stack, Group, Text, Box } from '@mantine/core';
import AppHeader from './AppHeader';
import { useHeadroom } from '@mantine/hooks';
import { LandingLayoutI } from './type';
import AppFooter from './AppFooter';

export function LandingLayout({ children }: LandingLayoutI) {
  const pinned = useHeadroom({ fixedAt: 180 });

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
          </Container>
        </Box>
        <AppFooter />
      </AppShell.Main>
    </AppShell>
  );
}

