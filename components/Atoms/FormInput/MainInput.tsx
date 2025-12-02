import { TextInput, TextInputProps } from "@mantine/core";
import { InputHTMLAttributes } from "react";
import classes from "./style.module.css";

type MainInputT = TextInputProps & InputHTMLAttributes<HTMLInputElement>;

const MainInput = ({ ...props }: MainInputT) => {
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