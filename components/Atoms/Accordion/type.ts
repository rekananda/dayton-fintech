import React from "react";
import { AccordionProps } from "@mantine/core";

export type AccordionItemT = {
  value: string;
  title: string;
  content: React.ReactNode;
};

export type AccordionT = Omit<AccordionProps, "children"> & {
  items?: AccordionItemT[];
};