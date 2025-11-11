
import { BoxProps, MantineColor } from '@mantine/core';
import * as materialIcons from '@mui/icons-material';
import { icons } from '@tabler/icons-react';

export type TimelineCardT = Omit<BoxProps, 'className' | 'style'> & {
  icon?: keyof typeof materialIcons | keyof typeof icons;
  title: string;
  description: string;
  numberedIcon?: number;
  color?: MantineColor;
  withIndicator?: boolean;
};