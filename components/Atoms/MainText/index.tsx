import { Text, TextProps } from "@mantine/core"
<<<<<<< HEAD
import { MainTextT } from "./type";

const MainText = ({ variant, children, ...rest }: MainTextT) => {
  const setupProps : TextProps = {
    size: variant === 'heading1' ? '80px' : variant === 'heading2' ? '48px' : variant === 'heading3' ? '40px' : variant === 'heading4' ? '32px' : variant === 'heading5' ? '28px' : '1rem',
=======

type PropsMainTextT = TextProps & {
  variant?: 'heading1' | 'heading2' | 'heading3' | 'heading4' | 'body' | 'body-semibold' | 'body-bold';
  children?: React.ReactNode;
}

const MainText = ({ variant, children, ...rest }: PropsMainTextT) => {
  const setupProps : TextProps = {
    size: variant === 'heading1' ? '80px' : variant === 'heading2' ? '48px' : variant === 'heading3' ? '40px' : variant === 'heading4' ? '32px' : '1rem',
>>>>>>> origin/stagging
    lh: '1.2',
    fw: variant === 'body' ? '300' : variant === 'body-bold' ? '700' : '600',
    ...rest
  }
  return (
    <Text {...variant ? setupProps : rest}>{children}</Text>
  )
}

export default MainText;