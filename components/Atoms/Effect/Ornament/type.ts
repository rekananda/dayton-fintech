import { BoxProps, MantineColor } from "@mantine/core";
import React from "react";

export type OrnamentT = BoxProps & {
  type?: 'candle' | 'coin' | 'graph' | 'waterfall';
  angle?: number;
  radius?: number;
  size?: number;
  color?: MantineColor;
  withShadow?: boolean;
}

export type IconRendererT = (options: { size: number }) => React.ReactNode;