'use client';

import { AppShell, Group, Text, Container, Button, Avatar, Menu, Burger, ActionIcon, Tooltip, Stack } from '@mantine/core';
import { IconChevronLeft, IconChevronRight, IconUser, IconSettings, IconLogout} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import MainText from '@/components/Atoms/MainText';
import ColorSchemeToggle from '@/components/Atoms/Button/ColorSchemeToggle';
import NavbarLandingPage from '@/components/Molecules/Menus/NavbarLandingPage';
import MenuLandingPage from '@/components/Molecules/Menus/MenuLandingPage';
import useViewport from '@/hooks/useViewport';
import { AppHeaderI } from './type';
import MainLogo from '../Atoms/Logo';

const AppHeader = ({
  variant = 'landing',
  user,
  mobileOpened = false,
  onMobileToggle,
  desktopCollapsed = false,
  onDesktopToggle,
  onLogout, 
}: AppHeaderI ) => {
  const router = useRouter();
  const { isMobile, isDesktop } = useViewport();

  return (
    <AppShell.Header className='glassmorphism'>
      <Container size={variant === 'backoffice' ? "100%" : "1440px"} h="100%" px={isMobile || variant === 'backoffice' ? 20 : 100}>
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
            <Group>
              <MainLogo size={50} />
              <Stack gap={2}>
                <MainText variant="body-bold" size='20px'>
                  Dayton Fintech
                </MainText>
                <MainText variant="body" size='14px'>
                  {variant === 'landing' ? 'AAUSD Trend Strategy' : 'Backoffice'}
                </MainText>
              </Stack>
            </Group>
          </Group>
          <Group gap={41}>
            {variant === 'landing' && isDesktop && (
              <NavbarLandingPage />
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
            {variant !== 'backoffice' && <ColorSchemeToggle/>}
            {variant === 'landing' && !isDesktop && (
              <MenuLandingPage />
            )}
          </Group>
        </Group>
      </Container>
    </AppShell.Header>
  );
}

export default AppHeader;
