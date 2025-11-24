import { TextInput, TextInputProps } from "@mantine/core";
import { InputHTMLAttributes } from "react";
import classes from "./style.module.css";

type MainInputProps = TextInputProps & InputHTMLAttributes<HTMLInputElement>;

const MainInput = ({ ...props }: MainInputProps) => {
  return (
    <TextInput 
      classNames={{ 
        input: classes.input,
        label: classes.label,
      }} 
      {...props} 
      inputWrapperOrder={['label', 'input', 'description', 'error']}
    />
  );
};

export default MainInput;