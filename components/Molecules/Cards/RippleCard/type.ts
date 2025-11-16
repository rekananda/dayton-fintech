import { RippleShapeT } from "@/components/Atoms/Effect/RippleEffect/type";
import { MantineColor } from "@mantine/core";

export type RipplePositionT = 'top-right' | 'bottom-left' | 'top-left' | 'bottom-right';

export type RippleCardT = {
  title?: string;
  description?: string;
  tags?: string[];
  children?: React.ReactNode;
  ripple?: RipplePositionT[];
  rippleProps?: Omit<RippleBackgroundT, 'position'>;
};

export type RippleBackgroundT = {
  position: RipplePositionT[];
  type?: RippleShapeT;
  color?: MantineColor;
  rippleSize?: number[];
  bluredline?: number
};