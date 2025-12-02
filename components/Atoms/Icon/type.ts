import { icons } from "@tabler/icons-react";
import * as materialIcons from '@mui/icons-material';
import { SVGProps } from "react";

export type IconNameT = keyof typeof icons | keyof typeof materialIcons;

export type IconT = {
  name : keyof typeof icons;
  size?: string | number;
  stroke?: string | number;
  className?: string;
}

export type SVGIconT = {
  size?: number;
  color?: string;
} & SVGProps<SVGSVGElement>;

export type GlobalIconT = {
  name : IconNameT;
  size?: string | number;
  className?: string;
}
