import { Text, TextProps } from "@mantine/core"

type PropsMainTextT = TextProps & {
  variant?: 'heading1' | 'heading2' | 'heading3' | 'heading4' | 'body' | 'body-semibold' | 'body-bold';
  children?: React.ReactNode;
}

const MainText = ({ variant, children, ...rest }: PropsMainTextT) => {
  const setupProps : TextProps = {
    size: variant === 'heading1' ? '80px' : variant === 'heading2' ? '48px' : variant === 'heading3' ? '40px' : variant === 'heading4' ? '32px' : '1rem',
    lh: '1.2',
    fw: variant === 'body' ? '300' : variant === 'body-bold' ? '700' : '600',
    ...rest
  }
  return (
    <Text {...variant ? setupProps : rest}>{children}</Text>
  )
}

export default MainText;