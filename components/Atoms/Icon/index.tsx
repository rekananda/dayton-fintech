'use client';

import { icons } from "@tabler/icons-react";
import { IconT } from "./type";

const Icon = ({ name, ...rest }: IconT) => {
  const IconWrapper = icons[name]

  return (
    <IconWrapper stroke={1.8} {...rest} />
  )
}

export default Icon;