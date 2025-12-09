'use client';

import { PasswordInput as MantinePasswordInput, PasswordInputProps } from "@mantine/core";
import { InputHTMLAttributes, useId, useMemo } from "react";
import classes from "./style.module.css";

type InputPasswordT = PasswordInputProps & InputHTMLAttributes<HTMLInputElement>;

const PasswordInput = ({ id, label, name, ...props }: InputPasswordT) => {
  const generatedId = useId();
  // Use deterministic ID based on label or name for consistency
  const deterministicId = useMemo(() => {
    if (id) return id;
    if (label && typeof label === 'string') {
      return `password-${label.toLowerCase().replace(/\s+/g, '-')}`;
    }
    if (name) {
      return `password-${name}`;
    }
    return generatedId;
  }, [id, label, name, generatedId]);

  return (
    <MantinePasswordInput 
      id={deterministicId}
      label={label}
      name={name}
      classNames={{ 
        input: classes.input,
        label: classes.label,
      }} 
      {...props} 
      inputWrapperOrder={['label', 'input', 'description', 'error']}
      suppressHydrationWarning
    />
  );
};

export default PasswordInput;