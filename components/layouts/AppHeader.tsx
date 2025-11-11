'use client';

<<<<<<< HEAD
import { AppShell, Group, Text, Container, Button, Avatar, Menu, Burger, ActionIcon, Tooltip, Stack } from '@mantine/core';
import { IconChevronLeft, IconChevronRight, IconUser, IconSettings, IconLogout} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/Atoms/Icon';
import MainText from '@/components/Atoms/MainText';
import ColorSchemeToggle from '@/components/Atoms/Button/ColorSchemeToggle';
import NavbarLandingPage from '@/components/Molecules/Menus/NavbarLandingPage';
import MenuLandingPage from '@/components/Molecules/Menus/MenuLandingPage';
import useViewport from '@/hooks/useViewport';
import { AppHeaderI } from './type';

=======
import { AppShell, Group, Text, Container, Button, Avatar, Menu, Burger, ActionIcon, Tooltip, Stack, Box } from '@mantine/core';
import { IconChevronLeft, IconChevronRight, IconUser, IconSettings, IconLogout} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import Icon from '../Atoms/Icon';
import MainText from '../Atoms/MainText';
import ColorSchemeToggle from '../Atoms/Button/ColorSchemeToggle';
import { useViewportSize } from '@mantine/hooks';
import LandingPageNavbar from '../Molecules/Menus/LandingPageNavbar';
import LandingPageMenu from '../Molecules/Menus/LandingPageMenu';

interface AppHeaderPropsI {
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

>>>>>>> origin/stagging
const AppHeader = ({
  variant = 'landing',
  user,
  mobileOpened = false,
  onMobileToggle,
  desktopCollapsed = false,
  onDesktopToggle,
<<<<<<< HEAD
  onLogout, 
}: AppHeaderI ) => {
  const router = useRouter();
  const { isMobile, isDesktop } = useViewport();
=======
  onLogout,
}: AppHeaderPropsI ) => {
  const router = useRouter();
  const { width } = useViewportSize();
  const isMobile = width < 768;
  const isDesktop = width >= 1200;
>>>>>>> origin/stagging

  return (
    <AppShell.Header className='glassmorphism'>
      <Container size="1440px" h="100%" px={isMobile ? 20 : 100}>
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
              <Icon className='w-8 h-8' name='IconBrandLoom'/>
              <Stack gap={2}>
                <MainText variant="body-bold" size='20px'>
                  {variant === 'landing' ? 'Dayton Fintech' : 'Dayton Backoffice'}
                </MainText>
                <MainText variant="body" size='14px'>
                  AAUSD Trend Strategy
                </MainText>
              </Stack>
            </Group>
          </Group>
          <Group gap={41}>
            {variant === 'landing' && isDesktop && (
<<<<<<< HEAD
              <NavbarLandingPage />
=======
              <LandingPageNavbar/>
>>>>>>> origin/stagging
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
            <ColorSchemeToggle/>
            {variant === 'landing' && !isDesktop && (
<<<<<<< HEAD
              <MenuLandingPage />
=======
              <LandingPageMenu  />
>>>>>>> origin/stagging
            )}
          </Group>
        </Group>
      </Container>
    </AppShell.Header>
  );
}

export default AppHeader;
