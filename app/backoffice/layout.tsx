'use client';

import { useEffect } from 'react';
import { BackofficeLayout } from '@/components/layouts/BackofficeLayout';
import { BackofficeLayoutI } from '@/components/layouts/type';
import { useMantineColorScheme } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';

export default function BackofficeLayoutWrapper({children}: BackofficeLayoutI) {
  const { setColorScheme } = useMantineColorScheme();
  const [isLandingPageOpened] = useLocalStorage<boolean>({
    key: 'landing-page-opened',
    defaultValue: false,
  });
  
  useEffect(() => {
    if (!isLandingPageOpened) {
      setColorScheme('light');
    }
  }, [setColorScheme, isLandingPageOpened]);

  return <BackofficeLayout>{children}</BackofficeLayout>;
}

