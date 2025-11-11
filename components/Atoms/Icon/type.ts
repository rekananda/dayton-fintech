import { icons } from "@tabler/icons-react";
import { SVGProps } from "react";

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