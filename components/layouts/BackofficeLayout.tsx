'use client';

import { useDisclosure, useDocumentTitle, useLocalStorage } from '@mantine/hooks';
import { BackofficeLayoutI } from './type';
import { AppShell, Burger, Group } from '@mantine/core';
import { useEffect, useMemo } from 'react';
import { useAuth } from '@/config/auth-context';
import { usePathname } from 'next/navigation';
import NavbarBackoffice from '../Molecules/Menus/NavbarBackoffice';
import MainLogo from '../Atoms/Logo';
import useViewport from '@/hooks/useViewport';
import { useAppSelector } from '@/store/hooks';
import dynamic from 'next/dynamic';

const UserDropdownClient = dynamic(() => import('../Molecules/Menus/UserDropdown'), {
  ssr: false,
});

export function BackofficeLayout({ children }: BackofficeLayoutI) {
  const { user, isLoading } = useAuth();
  const { isMobile } = useViewport();
  const pathname = usePathname();
  const { titlePage } = useAppSelector((state) => state.backoffice);

  useDocumentTitle(titlePage);

  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, setDesktopOpened] = useLocalStorage<boolean>({
    key: 'backoffice-desktop-sidebar-opened',
    defaultValue: true,
  });

  const toggleDesktop = () => {
    setDesktopOpened(!desktopOpened);
  };
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
      navbar={{ width: !desktopOpened ? 120 : 300, breakpoint: 'sm', collapsed: { mobile: !mobileOpened } }}
      padding={layoutPadding}
    >
      <AppShell.Header>
        <Group h="100%" px={layoutPadding} justify="space-between">
          <Group>
            <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
          </Group>
          <UserDropdownClient />
        </Group>
      </AppShell.Header>
      <NavbarBackoffice 
        px={layoutPadding} 
        py={0}
        opened={desktopOpened||isMobile} toggle={toggleDesktop}
      >
        <Group h="var(--app-shell-header-height)" justify={!desktopOpened && !isMobile ? "center" : "space-between"}>
          <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
          <MainLogo size={32} />
        </Group>
      </NavbarBackoffice>
      <AppShell.Main bg="gray.0">
        {children}
      </AppShell.Main>
    </AppShell>
  );
}

