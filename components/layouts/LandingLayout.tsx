'use client';

import { AppShell, Container, Box, Group, Stack, useMantineColorScheme } from '@mantine/core';
import { LandingLayoutI } from './type';
import AppFooter from './AppFooter';
import './landingpage.style.css';
import useViewport from '@/hooks/useViewport';
import NavbarLandingPage from '../Molecules/Menus/NavbarLandingPage';
import ColorSchemeToggle from '../Atoms/Button/ColorSchemeToggle';
import MenuLandingPage from '../Molecules/Menus/MenuLandingPage';
import MainLogo from '../Atoms/Logo';
import MainText from '../Atoms/MainText';
import { useLocalStorage } from '@mantine/hooks';
import { useEffect } from 'react';
import { MantineColorScheme } from '@mantine/core';

export function LandingLayout({ children }: LandingLayoutI) {
  const { isDesktop } = useViewport();
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const [isLandingPageOpened, setIsLandingPageOpened] = useLocalStorage<boolean>({
    key: 'landing-page-opened',
    defaultValue: true,
  });
  const [latestColorScheme] = useLocalStorage<MantineColorScheme>({
    key: 'latest-color-scheme-landing-page',
    defaultValue: 'dark',
  });
  
  useEffect(() => {
    setIsLandingPageOpened(true);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsLandingPageOpened(false);
      } else {
        setIsLandingPageOpened(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [setIsLandingPageOpened]);

  useEffect(() => {
    if (latestColorScheme !== colorScheme && isLandingPageOpened) {
      setColorScheme(latestColorScheme);
    }
  }, [latestColorScheme, isLandingPageOpened,colorScheme, setColorScheme]);

  return (
    <AppShell
      header={{ height: 90, offset: false }}
      padding={0}
    >
      <AppShell.Header className='glassmorphism'>
        <Container size="1440px" h="100%" px={100}>
          <Group h="100%" justify="space-between">
            <Group gap="sm">
              <Group>
                <MainLogo size={50} />
                <Stack gap={2}>
                  <MainText variant="body-bold" size='20px'>Dayton Fintech</MainText>
                  <MainText variant="body" size='14px'>AAUSD Trend Strategy</MainText>
                </Stack>
              </Group>
            </Group>
            <Group gap={41}>
              {isDesktop && (<NavbarLandingPage />)}
              <ColorSchemeToggle/>
              {!isDesktop && (<MenuLandingPage />)}
            </Group>
          </Group>
        </Container>
      </AppShell.Header>

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

