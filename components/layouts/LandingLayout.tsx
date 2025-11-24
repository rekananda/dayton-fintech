'use client';

import { AppShell, Container, Box } from '@mantine/core';
import AppHeader from './AppHeader';
import { LandingLayoutI } from './type';
import AppFooter from './AppFooter';
import './landingpage.style.css';

export function LandingLayout({ children }: LandingLayoutI) {

  return (
    <AppShell
      header={{ height: 90, offset: false }}
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

