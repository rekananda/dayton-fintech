export interface BackofficeLayoutI {
  children: React.ReactNode;
}

export interface LandingLayoutI {
  children: React.ReactNode;
}

export interface AppHeaderI {
  variant?: 'landing' | 'backoffice';
  user?: {
    name: string;
    email: string;
  };
  mobileOpened?: boolean;
  onMobileToggle?: () => void;
  desktopCollapsed?: boolean;
  onDesktopToggle?: () => void;
  onLogout?: () => void;
}