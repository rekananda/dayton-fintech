'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  AppShell, 
  Text, 
  NavLink,
  Stack,
  Container,
  Tooltip,
  ScrollArea
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { 
  IconDashboard, 
  IconUsers, 
  IconCreditCard, 
  IconChartBar, 
  IconSettings
} from '@tabler/icons-react';
import { useAuth } from '@/lib/auth-context';
import AppHeader from './AppHeader';
<<<<<<< HEAD
import { BackofficeLayoutI } from './type';

export function BackofficeLayout({ children }: BackofficeLayoutI) {
=======

interface BackofficeLayoutProps {
  children: React.ReactNode;
}

export function BackofficeLayout({ children }: BackofficeLayoutProps) {
>>>>>>> origin/stagging
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  
  const [desktopCollapsed, setDesktopCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('navbar_collapsed');
      return saved === 'true';
    }
    return false;
  });
  
  const toggleDesktop = () => {
    const newState = !desktopCollapsed;
    setDesktopCollapsed(newState);
    if (typeof window !== 'undefined') {
      localStorage.setItem('navbar_collapsed', String(newState));
    }
  };
  
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
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

  if (isLoading) {
    return (
      <AppShell padding={0}>
        <AppShell.Main className="flex flex-col min-h-screen">
          <div className="flex-grow flex items-center justify-center">
            <Text>Loading...</Text>
          </div>
          <footer className="bg-gray-900 text-white mt-auto">
            <Container size="xl" py="md">
              <Text size="sm" c="dimmed" ta="center">
                © 2025 Dayton Fintech. All rights reserved.
              </Text>
            </Container>
          </footer>
        </AppShell.Main>
      </AppShell>
    );
  }

  if (!user) {
    return (
      <AppShell padding={0}>
        <AppShell.Main className="flex flex-col min-h-screen">
          <div className="flex-grow flex items-center justify-center">
            <Text>Redirecting to login...</Text>
          </div>
          <footer className="bg-gray-900 text-white mt-auto">
            <Container size="xl" py="md">
              <Text size="sm" c="dimmed" ta="center">
                © 2025 Dayton Fintech. All rights reserved.
              </Text>
            </Container>
          </footer>
        </AppShell.Main>
      </AppShell>
    );
  }

  const navigation = [
    { icon: IconDashboard, label: 'Dashboard', href: '/backoffice' },
    { icon: IconUsers, label: 'Pengguna', href: '/backoffice/users' },
    { icon: IconCreditCard, label: 'Transaksi', href: '/backoffice/transactions' },
    { icon: IconChartBar, label: 'Laporan', href: '/backoffice/reports' },
    { icon: IconSettings, label: 'Pengaturan', href: '/backoffice/settings' },
  ];

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: desktopCollapsed ? 60 : 250,
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened, desktop: desktopCollapsed },
      }}
      padding="md"
    >
      <AppHeader
        variant="backoffice"
        user={user ? { name: user.name, email: user.email } : undefined}
        mobileOpened={mobileOpened}
        onMobileToggle={toggleMobile}
        desktopCollapsed={desktopCollapsed}
        onDesktopToggle={toggleDesktop}
        onLogout={logout}
      />

      <AppShell.Navbar p={desktopCollapsed ? "xs" : "md"}>
        <AppShell.Section grow component={ScrollArea}>
          <Stack gap="xs">
            {navigation.map((item) => (
              <Tooltip
                key={item.href}
                label={desktopCollapsed ? item.label : ''}
                position="right"
                disabled={!desktopCollapsed}
                withArrow
              >
                <div>
                  <NavLink
                    href={item.href}
                    label={desktopCollapsed ? undefined : item.label}
                    leftSection={<item.icon size={20} />}
                    active={pathname === item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      router.push(item.href);
                      if (mobileOpened) toggleMobile();
                    }}
                    className="rounded-md"
                    style={{
                      justifyContent: desktopCollapsed ? 'center' : 'flex-start',
                    }}
                  />
                </div>
              </Tooltip>
            ))}
          </Stack>
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main className="bg-gray-50 dark:bg-gray-900 flex flex-col min-h-[calc(100vh-var(--app-shell-header-height))]">
        <div className="flex-grow">
          {children}
        </div>
        
        <footer className="bg-gray-900 text-white mt-auto">
          <Container size="xl" py="md">
            <Text size="sm" c="dimmed" ta="center">
              © 2025 Dayton Fintech. All rights reserved.
            </Text>
          </Container>
        </footer>
      </AppShell.Main>
    </AppShell>
  );
}

