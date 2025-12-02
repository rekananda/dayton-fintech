import { TextProps } from "@mantine/core";
import { HTMLAttributes } from "react";

export type MainTextT = TextProps & HTMLAttributes<HTMLSpanElement> & {
  variant?: 'heading1' | 'heading2' | 'heading3' | 'heading4' | 'heading5' | 'body' | 'body-semibold' | 'body-bold';
  children?: React.ReactNode;
}