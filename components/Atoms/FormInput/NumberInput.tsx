'use client';

import { NumberInput as MantineNumberInput, NumberInputProps } from "@mantine/core";
import { InputHTMLAttributes, useId } from "react";
import classes from "./style.module.css";

type NumberInputT = NumberInputProps & InputHTMLAttributes<HTMLInputElement>;

const NumberInput = ({ id, ...props }: NumberInputT) => {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <MantineNumberInput 
      id={inputId}
      classNames={{ 
        input: classes.input,
        label: classes.label,
      }} 
      {...props} 
      inputWrapperOrder={['label', 'input', 'description', 'error']}
    />
  );
};

export default NumberInput;