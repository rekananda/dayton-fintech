
import { IconNameT } from '@/components/Atoms/Icon/type';
import { BoxProps, MantineColor } from '@mantine/core';

export type TimelineCardT = Omit<BoxProps, 'className' | 'style'> & {
  icon?: IconNameT;
  title: string;
  description: string;
  numberedIcon?: number;
  color?: MantineColor;
  withIndicator?: boolean;
};