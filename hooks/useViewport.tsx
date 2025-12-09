'use client';

import { useEffect, useState } from 'react';

const useViewport = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    const checkViewport = () => {
      if (typeof window !== 'undefined') {
        const width = window.innerWidth;
        setIsMobile(width < 768);
        setIsDesktop(width >= 1200);
      }
    };

    checkViewport();

    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  return { isMobile: isHydrated ? isMobile : false, isDesktop: isHydrated ? isDesktop : false };
}

export default useViewport;