'use client';

import { ReactNode, forwardRef, useCallback } from 'react';
import { Box, BoxProps } from '@mantine/core';
import useScrollAnimation from '@/hooks/useScrollAnimation';
import './style.css';

interface AnimatedTextProps extends BoxProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  animationType?: 'fadeUp' | 'fadeIn' | 'fadeDown';
}

const AnimatedText = forwardRef<HTMLDivElement, AnimatedTextProps>(
  ({ children, delay = 0, duration = 0.8, animationType = 'fadeUp', className = '', style, ...props }, ref) => {
    const { ref: animationRef, isVisible } = useScrollAnimation({
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
      triggerOnce: true,
    });

    const combinedRef = useCallback((node: HTMLDivElement | null) => {
      animationRef(node);
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref && 'current' in ref) {
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }
    }, [animationRef, ref]);

    return (
      <Box
        ref={combinedRef}
        className={`animated-text animated-text-${animationType} ${isVisible ? 'is-visible' : ''} ${className}`}
        style={{
          ...style,
          '--animation-delay': `${delay}s`,
          '--animation-duration': `${duration}s`,
        } as React.CSSProperties}
        {...props}
      >
        {children}
      </Box>
    );
  }
);

AnimatedText.displayName = 'AnimatedText';

export default AnimatedText;

