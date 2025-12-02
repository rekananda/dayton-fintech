import { AppShellNavbarProps } from "@mantine/core";

export type NavbarBackofficeT = AppShellNavbarProps & {
  children?: React.ReactNode;
  opened: boolean;
  toggle: () => void;
}