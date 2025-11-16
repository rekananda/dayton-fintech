'use client';

import { icons } from "@tabler/icons-react";
import { IconT } from "./type";

const Icon = ({ name, ...rest }: IconT) => {
  const IconWrapper = icons[name]

  return (
    <IconWrapper {...rest}/>
  )
}

export default Icon;