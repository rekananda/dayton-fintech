'use client';

import { useDisclosure } from '@mantine/hooks';
import { BackofficeLayoutI } from './type';
import { AppShell, Burger, Group, Text } from '@mantine/core';
import UserDropdown from '../Molecules/Menus/UserDropdown';
import { useEffect, useMemo } from 'react';
import { useAuth } from '@/config/auth-context';
import { usePathname } from 'next/navigation';
import NavbarBackoffice from '../Molecules/Menus/NavbarBackoffice';
import MainLogo from '../Atoms/Logo';

export function BackofficeLayout({ children }: BackofficeLayoutI) {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();

  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure();
  const layoutPadding = 32;

  const stablePathname = useMemo(() => pathname || '', [pathname]);

  useEffect(() => {
    const publicPages = ['/backoffice/login', '/backoffice/register'];
    if (!isLoading && !user && stablePathname && !publicPages.includes(stablePathname)) {
      window.location.href = '/backoffice/login';
    }
  }, [user, isLoading, stablePathname]);

  const publicPages = ['/backoffice/login', '/backoffice/register'];
  const isPublicPage = publicPages.includes(pathname);
  
  if (isPublicPage) {
    return <>{children}</>;
  }

  return (
    <AppShell
      layout="alt"
      header={{ height: 75 }}
      navbar={{ width: desktopOpened ? 120 : 300, breakpoint: 'sm', collapsed: { mobile: !mobileOpened } }}
      padding={layoutPadding}
    >
      <AppShell.Header>
        <Group h="100%" px={layoutPadding} justify="space-between">
          <Group>
            <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
          </Group>
          <UserDropdown />
        </Group>
      </AppShell.Header>
      <NavbarBackoffice 
        px={layoutPadding} 
        py={0}
        opened={desktopOpened} toggle={toggleDesktop}
      >
        <Group h="var(--app-shell-header-height)" justify={"space-between"}>
          <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
          <MainLogo size={32} />
        </Group>
      </NavbarBackoffice>
      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}

