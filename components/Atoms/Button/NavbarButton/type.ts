import { NavLinkProps } from "@mantine/core";
import * as materialIcons from '@mui/icons-material';
import { icons } from "@tabler/icons-react";
import { AnchorHTMLAttributes } from "react";

export type NavbarButtonT = NavLinkProps & AnchorHTMLAttributes<HTMLAnchorElement> & {
  icon?: keyof typeof materialIcons | keyof typeof icons;
  label?: string;
  hideLabel?: boolean;
}

export type NavbarButtonItemT = {
  icon?: keyof typeof materialIcons | keyof typeof icons;
  label?: string;
  href?: string;
  subs?: NavbarButtonItemT[];
}

export type NavbarButtonSubItemT = {
  icon?: keyof typeof materialIcons | keyof typeof icons;
  label?: string;
  href?: string;
  subLevel: number;
}