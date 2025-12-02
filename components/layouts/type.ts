import { UserT } from "@/config/types";

export interface BackofficeLayoutI {
  children: React.ReactNode;
}

export interface LandingLayoutI {
  children: React.ReactNode;
}

export interface AppHeaderI {
  variant?: 'landing' | 'backoffice';
  user?: UserT;
  mobileOpened?: boolean;
  onMobileToggle?: () => void;
  desktopCollapsed?: boolean;
  onDesktopToggle?: () => void;
  onLogout?: () => void;
}

export type ControlLayoutT = {
  title: string;
  modalLabel?: string;
  openModal?: () => void;
}