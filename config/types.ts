import { TableT } from "@/components/Atoms/Table/type";
import { MantineColor } from "@mantine/core";
import * as materialIcons from '@mui/icons-material';
import { icons } from '@tabler/icons-react';

export type UserT = {
  email: string;
  username: string;
  name?: string;
  role: string;
}

export interface AuthContextType {
  user: UserT | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; message: string }>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  isLoading: boolean;
}

export type MenuDataT = {
  id: number;
  label: string;
  href: string;
  order: number;
};

export type TimelineDataT = {
  id: number;
  icon: keyof typeof materialIcons | keyof typeof icons;
  title: string;
  description: string;
  color?: MantineColor;
  order: number;
};

export type BussinessModelDataT = {
  id: number;
  title: string;
  description: string;
  tags: string[];
  order: number;
  tables?: TableT<TableProfitSharingDataT>[] | TableT<TableReferralDataT>[];
  tnc?: string;
};

export type EventDataT = {
  id: number;
  image: string;
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