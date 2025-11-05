import { Title, Text, type TitleProps, type TextProps } from '@mantine/core';

// Heading Components
interface HeadingProps extends Omit<TitleProps, 'order'> {
  order?: 1 | 2 | 3 | 4;
}

export function Heading1({ children, className, ...props }: HeadingProps) {
  return (
    <Title order={1} className={`text-heading1 ${className || ''}`} {...props}>
      {children}
    </Title>
  );
}

export function Heading2({ children, className, ...props }: HeadingProps) {
  return (
    <Title order={2} className={`text-heading2 ${className || ''}`} {...props}>
      {children}
    </Title>
  );
}

export function Heading3({ children, className, ...props }: HeadingProps) {
  return (
    <Title order={3} className={`text-heading3 ${className || ''}`} {...props}>
      {children}
    </Title>
  );
}

export function Heading4({ children, className, ...props }: HeadingProps) {
  return (
    <Title order={4} className={`text-heading4 ${className || ''}`} {...props}>
      {children}
    </Title>
  );
}

// Body Components
interface BodyProps extends TextProps {
  variant?: 'regular' | 'semibold' | 'bold';
}

export function Body({ children, variant = 'regular', className, ...props }: BodyProps) {
  const variantClass = 
    variant === 'bold' ? 'text-body-bold' :
    variant === 'semibold' ? 'text-body-semibold' :
    'text-body';

  return (
    <Text className={`${variantClass} ${className || ''}`} {...props}>
      {children}
    </Text>
  );
}

export function BodyBold({ children, className, ...props }: BodyProps) {
  return (
    <Body variant="bold" className={className} {...props}>
      {children}
    </Body>
  );
}

export function BodySemibold({ children, className, ...props }: BodyProps) {
  return (
    <Body variant="semibold" className={className} {...props}>
      {children}
    </Body>
  );
}

