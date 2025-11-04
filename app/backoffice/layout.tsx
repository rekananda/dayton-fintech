'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  AppShell, 
  Group, 
  Text, 
  Button,
  NavLink,
  Avatar,
  Menu,
  Burger,
  Stack
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { 
  IconDashboard, 
  IconUsers, 
  IconCreditCard, 
  IconChartBar, 
  IconSettings,
  IconLogout,
  IconUser
} from '@tabler/icons-react';
import { useAuth } from '@/lib/auth-context';

export default function BackofficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [opened, { toggle }] = useDisclosure();
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if user is authenticated
    if (!isLoading && !user && pathname !== '/backoffice/login') {
      router.push('/backoffice/login');
    }
  }, [user, isLoading, pathname, router]);

  // Don't render layout for public pages (login and register)
  const publicPages = ['/backoffice/login', '/backoffice/register'];
  if (publicPages.includes(pathname)) {
    return <>{children}</>;
  }

  // Show loading or redirect
  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Text>Loading...</Text>
      </div>
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
        width: 250,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg"></div>
            <Text size="lg" fw={700}>
              Dayton Backoffice
            </Text>
          </Group>

          <Menu shadow="md" width={200}>
            <Menu.Target>
              <Button variant="subtle" size="sm" leftSection={<Avatar size="sm" color="blue" />}>
                {user.name}
              </Button>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>Account</Menu.Label>
              <Menu.Item 
                leftSection={<IconUser size={16} />}
                onClick={() => router.push('/backoffice/change-password')}
              >
                Ubah Password
              </Menu.Item>
              <Menu.Item leftSection={<IconSettings size={16} />}>
                Settings
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item 
                color="red" 
                leftSection={<IconLogout size={16} />}
                onClick={logout}
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Stack gap="xs">
          {navigation.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              leftSection={<item.icon size={20} />}
              active={pathname === item.href}
              onClick={(e) => {
                e.preventDefault();
                router.push(item.href);
                if (opened) toggle();
              }}
              className="rounded-md"
            />
          ))}
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main className="bg-gray-50 dark:bg-gray-900">
        {children}
      </AppShell.Main>
    </AppShell>
  );
}

