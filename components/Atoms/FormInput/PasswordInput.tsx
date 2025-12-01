import { PasswordInput as MantinePasswordInput, PasswordInputProps } from "@mantine/core";
import { InputHTMLAttributes } from "react";
import classes from "./style.module.css";

type InputPasswordT = PasswordInputProps & InputHTMLAttributes<HTMLInputElement>;

const PasswordInput = ({ ...props }: InputPasswordT) => {
  return (
    <MantinePasswordInput 
      classNames={{ 
        input: classes.input,
        label: classes.label,
      }} 
      {...props} 
      inputWrapperOrder={['label', 'input', 'description', 'error']}
    />
  );
};

export default PasswordInput;