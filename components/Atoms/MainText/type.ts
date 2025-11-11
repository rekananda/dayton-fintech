import { TextProps } from "@mantine/core";

export type MainTextT = TextProps & {
  variant?: 'heading1' | 'heading2' | 'heading3' | 'heading4' | 'heading5' | 'body' | 'body-semibold' | 'body-bold';
  children?: React.ReactNode;
}