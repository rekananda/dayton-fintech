'use client';

import { useEffect, useState } from 'react';

const useViewport = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
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

  return { isMobile, isDesktop };
}

export default useViewport;