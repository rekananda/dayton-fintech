'use client';

import { NavLink } from "@mantine/core";
import { NavbarButtonT } from "./type";
import './style.css';
import GlobalIcon from "../../Icon/GlobalIcon";

const NavbarButton = ({icon, label, hideLabel, ...rest}: NavbarButtonT) => {

  return (
    <NavLink
      {...rest}
      className={`navbar-button ${rest.className}`}
      label={hideLabel ? null : label}
      leftSection={icon ? <GlobalIcon name={icon} size={28} /> : null}
    />
  );
}

export default NavbarButton;