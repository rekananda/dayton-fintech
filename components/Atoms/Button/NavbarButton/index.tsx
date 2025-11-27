import { NavLink } from "@mantine/core";
import { NavbarButtonT } from "./type";
import * as materialIcons from '@mui/icons-material';
import { icons } from '@tabler/icons-react';
import Icon from "../../Icon";
import './style.css';

const NavbarButton = ({icon, label, hideLabel, ...rest}: NavbarButtonT) => {
  const renderIcon = (icon: keyof typeof materialIcons | keyof typeof icons) => {
    if (icon in icons) {
      return <Icon name={icon as keyof typeof icons} size={28} />;
    }
    if (icon in materialIcons) {
      const IconComponent = materialIcons[icon as keyof typeof materialIcons];
      return <IconComponent style={{ fontSize: 28 }} />;
    }
  };

  return (
    <NavLink
      {...rest}
      className={`navbar-button ${rest.className}`}
      label={hideLabel ? null : label}
      leftSection={icon ? renderIcon(icon) : null}
    />
  );
}

export default NavbarButton;