'use client';

import { ReactNode } from 'react';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import { NavigationProgress } from '@mantine/nprogress';
import { AuthProvider } from '@/config/auth-context';
import { cssVariablesResolver, mainTheme } from '@/config/mantineTheme';
import StoreProvider from '@/store/StoreProvider';

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <StoreProvider>
      <MantineProvider
        theme={mainTheme}
        defaultColorScheme="dark"
        cssVariablesResolver={cssVariablesResolver}
      >
        <ModalsProvider>
          <AuthProvider>
            <Notifications />
            <NavigationProgress />
            {children}
          </AuthProvider>
        </ModalsProvider>
      </MantineProvider>
    </StoreProvider>
  );
}

