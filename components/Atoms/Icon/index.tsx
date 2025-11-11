'use client';

import { icons } from "@tabler/icons-react";
<<<<<<< HEAD
import { IconT } from "./type";

const Icon = ({ name, ...rest }: IconT) => {
=======

export type PropsIconT = {
  name : keyof typeof icons;
  size?: string | number;
  stroke?: string | number;
  className?: string;
}

const Icon = ({ name, ...rest }: PropsIconT) => {
>>>>>>> origin/stagging
  const IconWrapper = icons[name]

  return (
    <IconWrapper {...rest}/>
  )
}

export default Icon;