import { NavLinkProps } from "@mantine/core";
import { AnchorHTMLAttributes } from "react";
import { IconNameT } from "../../Icon/type";

export type NavbarButtonT = NavLinkProps & AnchorHTMLAttributes<HTMLAnchorElement> & {
  icon?: IconNameT;
  label?: string;
  hideLabel?: boolean;
}

export type NavbarButtonItemT = {
  icon?: IconNameT;
  label?: string;
  href?: string;
  subs?: NavbarButtonItemT[];
}

export type NavbarButtonSubItemT = {
  icon?: IconNameT;
  label?: string;
  href?: string;
  subLevel: number;
}