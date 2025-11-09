'use client';

import { icons } from "@tabler/icons-react";

export type PropsIconT = {
  name : keyof typeof icons;
  size?: string | number;
  stroke?: string | number;
  className?: string;
}

const Icon = ({ name, ...rest }: PropsIconT) => {
  const IconWrapper = icons[name]

  return (
    <IconWrapper {...rest}/>
  )
}

export default Icon;