'use client';

import { TextInput, TextInputProps } from "@mantine/core";
import { InputHTMLAttributes, useId, useMemo } from "react";
import classes from "./style.module.css";

type MainInputT = TextInputProps & InputHTMLAttributes<HTMLInputElement>;

const MainInput = ({ id, label, name, ...props }: MainInputT) => {
  const generatedId = useId();
  // Use deterministic ID based on label or name for consistency
  const deterministicId = useMemo(() => {
    if (id) return id;
    if (label && typeof label === 'string') {
      return `input-${label.toLowerCase().replace(/\s+/g, '-')}`;
    }
    if (name) {
      return `input-${name}`;
    }
    return generatedId;
  }, [id, label, name, generatedId]);

  return (
    <TextInput 
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

export default MainInput;