'use client';

import { Box, Stack } from '@mantine/core';
import MainText from '@/components/Atoms/MainText';
import useViewport from '@/hooks/useViewport';
import { CSSProperties } from '@mui/material/styles';
import { useMemo } from 'react';
import './style.css';
import { TimelineCardT } from './type';
import GlobalIcon from '@/components/Atoms/Icon/GlobalIcon';
import AnimatedText from '@/components/Atoms/AnimatedText';

const TimelineCard = ({ 
  icon, numberedIcon, title, description, color = 'primary', withIndicator = true, ...rest 
}: TimelineCardT) => {
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

  return (
    <Box {...rest} className='timeline-card-container' style={containerStyle}>
      {withIndicator && <Box className='timeline-card-indicator' w={14} h={14}/>}
      <AnimatedText delay={0.2} animationType="fadeUp">
        <Stack 
          className='timeline-card-content glassmorphism' 
          p={isMobile ? 20 : 40} 
          maw={isMobile ? 'unset' : 520}
          h='100%'
        >
          <Box className='timeline-card-icon' c={color}>
            {icon ? <GlobalIcon name={icon} size={28} /> : <MainText miw={28} ta='center' variant='body-semibold'  fz={28} c="primary">{numberedIcon}</MainText>}
          </Box>
          <MainText variant='heading5' fw='600' fz={isMobile ? 24 : 28}>{title}</MainText>
          <MainText variant='body' fz={isMobile ? 12 : 16} style={{ whiteSpace: 'pre-line' }}>{description}</MainText>
        </Stack>
      </AnimatedText>
    </Box>
  );
};

export default TimelineCard;