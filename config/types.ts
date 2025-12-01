import { IconNameT } from "@/components/Atoms/Icon/type";
import { TableT } from "@/components/Atoms/Table/type";
import { MantineColor } from "@mantine/core";

export type UserT = {
  email: string;
  username: string;
  name?: string;
  role: string;
}

export interface AuthContextType {
  user: UserT | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  isLoading: boolean;
}

export type ConfigDataT = {
  id: number;
  key: string;
  value: string;
  description: string;
}

export type MenuDataT = {
  id: number;
  label: string;
  href: string;
  order: number;
};

export type TimelineDataT = {
  id: number;
  icon: IconNameT;
  title: string;
  description: string;
  color?: MantineColor;
  order: number;
};

export type DynamicTableDataT = Record<string, string | number> & {
  id: number;
  order: number;
  [key: string]: string | number;
};

export type BussinessModelDataT = {
  id: number;
  title: string;
  description: string;
  tags: string[];
  order: number;
  tables?: TableT<DynamicTableDataT>[];
  tnc?: string;
};

export type EventDataT = {
  id: number;
  imageUrl: string;
  meetingLink?: string;
  location?: string;
  date: string;
  title: string;
  description: string;
};

export type LegalDataT = {
  id: number;
  title: string;
  description: string;
  order: number;
};

export type QnADataT = {
  id: number;
  question: string;
  answer: string;
  order: number;
};

export type TableProfitSharingDataT = {
  id: number;
  profit: string;
  calculation: string;
  order: number;
};

export type TableReferralDataT = {
  id: number;
  level: string;
  commission: string;
  order: number;
};