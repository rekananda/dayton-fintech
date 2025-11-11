'use client';

import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { Box, BoxProps, MantineColor } from "@mantine/core";
import { CandlestickChartOutlined, PaidOutlined, WaterfallChartOutlined } from '@mui/icons-material';
import GraphIcon from '@/components/Atoms/Icon/GraphIcon';
import './style.css';

type PropsOrnamentT = BoxProps & {
  type?: 'candle' | 'coin' | 'graph' | 'waterfall';
  angle?: number;
  radius?: number;
  size?: number;
  color?: MantineColor;
  withShadow?: boolean;
}

type IconRenderer = (options: { size: number }) => React.ReactNode;

const iconRenderers: Record<NonNullable<PropsOrnamentT['type']>, IconRenderer> = {
  candle: ({ size }) => <CandlestickChartOutlined style={{ fontSize: size }} />,
  coin: ({ size }) => <PaidOutlined style={{ fontSize: size }} />,
  graph: ({ size }) => <GraphIcon size={size} aria-label="graph ornament icon" />,
  waterfall: ({ size }) => <WaterfallChartOutlined style={{ fontSize: size }} />,
};

const Ornament = ({ type = 'candle', angle = 0, radius = 8, size = 45, color = 'primary', withShadow = true, ...rest }: PropsOrnamentT) => {
  const [isVisible, setIsVisible] = useState(false);
  const renderIcon = iconRenderers[type] ?? iconRenderers.candle;
  const colorArray = color.split('.');

  useEffect(() => {
    const timer = window.requestAnimationFrame(() => setIsVisible(true));
    return () => window.cancelAnimationFrame(timer);
  }, []);

  const containerStyle = useMemo(() => {
    const colorVar = colorArray.length === 1
      ? `var(--mantine-color-${colorArray[0]}-6)`
      : `var(--mantine-color-${colorArray.join('-')})`;

    return {
      '--ornament-rotation': `${angle}deg`,
      '--ornament-color': colorVar,
    } as CSSProperties;
  }, [angle, colorArray]);

  return (
    <Box {...rest}>
      <Box
        className={`ornament-main-container${isVisible ? ' is-visible' : ''}`}
        style={containerStyle}
      >
        <Box
          className="ornament-main"
          style={{ borderRadius: radius }}
        >
          {renderIcon({ size })}
        </Box>
        {withShadow && <Box className="ornament-main-shadow" w={size / 1.5} h={size / 6} />}
      </Box>
    </Box>
  )
}

export default Ornament;