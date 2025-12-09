'use client';

import { Button, ButtonProps } from "@mantine/core";
import { ButtonHTMLAttributes } from "react";
import classes from "./mainbutton.module.css";

type MainButtonProps = ButtonProps & ButtonHTMLAttributes<HTMLButtonElement>;

const MainButton = ({ children, ...props }: MainButtonProps) => {
  return (
    <Button classNames={{ root: classes.button, label: classes.label }} {...props}>
      {children}
    </Button>
  );
};

export default MainButton;