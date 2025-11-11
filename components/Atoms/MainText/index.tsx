import { Text, TextProps } from "@mantine/core"
import { MainTextT } from "./type";

const MainText = ({ variant, children, ...rest }: MainTextT) => {
  const setupProps : TextProps = {
    size: variant === 'heading1' ? '80px' : variant === 'heading2' ? '48px' : variant === 'heading3' ? '40px' : variant === 'heading4' ? '32px' : variant === 'heading5' ? '28px' : '1rem',
    lh: '1.2',
    fw: variant === 'body' ? '300' : variant === 'body-bold' ? '700' : '600',
    ...rest
  }
  return (
    <Text {...variant ? setupProps : rest}>{children}</Text>
  )
}

export default MainText;