'use client';

import { AppShell, Group, Text, Badge, Container, Button, Avatar, Menu, Burger, ActionIcon, Tooltip, useMantineColorScheme } from '@mantine/core';
import { IconChevronLeft, IconChevronRight, IconUser, IconSettings, IconLogout, IconSun, IconMoon } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

interface AppHeaderProps {
  variant?: 'landing' | 'backoffice';
  user?: {
    name: string;
    email: string;
  };
  mobileOpened?: boolean;
  onMobileToggle?: () => void;
  desktopCollapsed?: boolean;
  onDesktopToggle?: () => void;
  onLogout?: () => void;
}

export function AppHeader({
  variant = 'landing',
  user,
  mobileOpened = false,
  onMobileToggle,
  desktopCollapsed = false,
  onDesktopToggle,
  onLogout,
}: AppHeaderProps) {
  const router = useRouter();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <AppShell.Header>
      <Container size="xl" h="100%">
        <Group h="100%" justify="space-between">
          <Group gap="sm">
            {onMobileToggle && variant === 'backoffice' && (
              <Burger opened={mobileOpened} onClick={onMobileToggle} hiddenFrom="sm" size="sm" />
            )}

            {onDesktopToggle && variant === 'backoffice' && (
              <Tooltip 
                label={desktopCollapsed ? "Expand sidebar" : "Collapse sidebar"} 
                position="bottom" 
                withArrow
                visibleFrom="sm"
              >
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  onClick={onDesktopToggle}
                  size="lg"
                  visibleFrom="sm"
                  className="hover:bg-primary-1 dark:hover:bg-primary-9"
                >
                  {desktopCollapsed ? <IconChevronRight size={20} /> : <IconChevronLeft size={20} />}
                </ActionIcon>
              </Tooltip>
            )}
            <div className="w-8 h-8 bg-gradient-to-br from-primary-4 to-primary-6 rounded-lg"></div>
            <Text size="xl" fw={700}>
              {variant === 'landing' ? 'Dayton Fintech' : 'Dayton Backoffice'}
            </Text>
          </Group>
          <Group gap="sm">
            {variant === 'landing' && (
              <Badge size="lg" variant="light" color="primary">
                Terpercaya & Aman
              </Badge>
            )}
            {user && onLogout && (
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <Button variant="subtle" size="sm" leftSection={<Avatar size="sm" color="primary" />}>
                    <Text size="sm" visibleFrom="sm">{user.name}</Text>
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
                    onClick={onLogout}
                  >
                    Logout
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            )}
            <Tooltip label={colorScheme === 'dark' ? 'Light mode' : 'Dark mode'} position="bottom" withArrow>
              <ActionIcon
                variant="subtle"
                color="gray"
                onClick={() => toggleColorScheme()}
                size="lg"
                className="hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {colorScheme === 'dark' ? <IconSun size={20} /> : <IconMoon size={20} />}
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>
      </Container>
    </AppShell.Header>
  );
}

