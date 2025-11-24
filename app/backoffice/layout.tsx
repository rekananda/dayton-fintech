'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { BackofficeLayout } from '@/components/layouts/BackofficeLayout';

const BACKOFFICE_COLOR_SCHEME_KEY = 'mantine-color-scheme-backoffice';

export default function BackofficeLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const isBackoffice = pathname?.startsWith('/backoffice') ?? false;
    
    if (isBackoffice) {
      const html = document.documentElement;
      
      localStorage.setItem(BACKOFFICE_COLOR_SCHEME_KEY, 'light');
      
      const forceLight = () => {
        html.setAttribute('data-mantine-color-scheme', 'light');
      };
      
      // Set sekali saat mount
      forceLight();
      
      let isActive = true;
      
      const checkAndForce = () => {
        const currentPath = window.location.pathname;
        const stillInBackoffice = currentPath.startsWith('/backoffice');
        
        if (stillInBackoffice && isActive) {
          const currentScheme = html.getAttribute('data-mantine-color-scheme');
          if (currentScheme !== 'light') {
            forceLight();
          }
          rafRef.current = requestAnimationFrame(checkAndForce);
        }
      };
      
      rafRef.current = requestAnimationFrame(checkAndForce);

      return () => {
        isActive = false;
        if (rafRef.current !== null) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
      };
    }
  }, [pathname]);

  return <BackofficeLayout>{children}</BackofficeLayout>;
}

