import { icons } from "@tabler/icons-react";
import * as materialIcons from '@mui/icons-material';
import Icon from ".";
import { GlobalIconT } from "./type";

const GlobalIcon = ({ name, size = 28, className }: GlobalIconT) => {
  if (name in icons) {
    return <Icon name={name as keyof typeof icons} size={size} className={className} />;
  }

  if (name in materialIcons) {
    const IconComponent = materialIcons[name as keyof typeof materialIcons];
    return <IconComponent style={{ fontSize: size }} className={className} />;
  }

  return null;
};

export default GlobalIcon;
