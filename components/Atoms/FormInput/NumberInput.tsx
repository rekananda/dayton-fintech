import { NumberInput as MantineNumberInput, NumberInputProps } from "@mantine/core";
import { InputHTMLAttributes } from "react";
import classes from "./style.module.css";

type NumberInputT = NumberInputProps & InputHTMLAttributes<HTMLInputElement>;

const NumberInput = ({ ...props }: NumberInputT) => {
  return (
    <MantineNumberInput 
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