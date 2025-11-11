import { StackProps } from "@mantine/core";

export type TopicTitleT = StackProps & {
  title: string;
  badge: string;
  align?: 'center' | 'left' | 'right';
}