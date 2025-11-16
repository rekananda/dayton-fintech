import { BoxProps, MantineColor } from "@mantine/core";

export type RippleShapeT = 'circle' | 'diamond';
export type RippleEffectT = BoxProps & {
  color?: MantineColor;
  size?: number;
  position?: 'center' | 'left' | 'right';
  shape?: RippleShapeT;
};