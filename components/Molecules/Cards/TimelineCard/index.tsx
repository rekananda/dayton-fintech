import { Box, MantineColor, Stack } from '@mantine/core';
import Icon from '@/components/Atoms/Icon';
import MainText from '@/components/Atoms/MainText';
import useViewport from '@/hooks/useViewport';
import { icons } from '@tabler/icons-react';
import * as materialIcons from '@mui/icons-material';
import { CSSProperties } from '@mui/material/styles';
import { useMemo } from 'react';
import './style.css';

export type PropsTimelineCardT = {
  icon: keyof typeof materialIcons | keyof typeof icons;
  title: string;
  description: string;
  color?: MantineColor;
};

const TimelineCard = ({ icon, title, description, color = 'primary' }: PropsTimelineCardT) => {
  const { isMobile } = useViewport();
  const colorArray = color.split('.');

  const containerStyle = useMemo(() => {
    const colorVar = colorArray.length === 1
      ? `var(--mantine-color-${colorArray[0]}-6)`
      : `var(--mantine-color-${colorArray.join('-')})`;

    return {
      '--timeline-icon-color': colorVar,
    } as CSSProperties;
  }, [colorArray]);

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
    <Box className='timeline-card-container' style={containerStyle}>
      <Box className='timeline-card-indicator' w={14} h={14}/>
      <Stack 
        className='timeline-card-content glassmorphism' 
        p={isMobile ? 20 : 40} 
        maw={isMobile ? 'unset' : 520}
      >
        <Box className='timeline-card-icon' c={color}>
          {renderIcon(icon)}
        </Box>
        <MainText variant='heading5' fw='600' fz={isMobile ? 24 : 28}>{title}</MainText>
        <MainText variant='body' fz={isMobile ? 12 : 16}>{description}</MainText>
      </Stack>
    </Box>
  );
};

export default TimelineCard;