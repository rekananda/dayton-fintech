'use client';

import MainText from "@/components/Atoms/MainText";
import useViewport from "@/hooks/useViewport";
import { Badge, Box, Group, Stack } from "@mantine/core";
import './style.css';
import { RippleBackgroundT, RippleCardT } from "./type";
import AnimatedText from "@/components/Atoms/AnimatedText";

const RippleCard = ({ 
  title, 
  description, 
  tags=[], 
  children, 
  ripple=[], 
  rippleProps={ type: 'circle', bluredline: 24 } 
}: RippleCardT) => {
  const { isMobile } = useViewport();

  return (
    <Box className={`ripple-card-container`}>
      <Stack className="ripple-card-content" p={isMobile ? 20 : 40} h='100%'>
        {tags.length > 0 && <AnimatedText delay={0.2} animationType="fadeUp">
          <Group>
            {tags.map((tag) => (
              <Badge key={tag} className='light-badge' color='primary.7'>{tag}</Badge>
            ))}
          </Group>
        </AnimatedText>}
        {title && <AnimatedText delay={0.25} animationType="fadeUp">
          <MainText variant="heading5" fw="600" fz={isMobile ? 24 : 28}>{title}</MainText>
        </AnimatedText>}
        {description && <AnimatedText delay={0.3} animationType="fadeUp">
          <MainText variant="body" fz={isMobile ? 14 : 16} style={{ whiteSpace: 'pre-line' }}>{description}</MainText>
        </AnimatedText>}
        {children && <AnimatedText delay={0.35} animationType="fadeUp">
          <Stack>
            {children}
          </Stack>
        </AnimatedText>}
      </Stack>
      <RippleBackground position={ripple} bluredline={isMobile ? 12 : 20} {...rippleProps} />
    </Box>
  );
};

export const RippleBackground = ({ 
  position, 
  type = 'diamond', 
  color = 'primary', 
  rippleSize = [], 
  bluredline = 24 
}: RippleBackgroundT) => {
  const { isMobile } = useViewport();
  const defaultRippleSize = isMobile ? 250 : 350;

  if (rippleSize.length === 0) {
    rippleSize = position.map(() => defaultRippleSize);
  }

  return (
    <Box className="ripple-background">
      {position.map((pos, index) => (
        <Box 
          key={index} 
          className={`ripple-inner inner-${pos} shape-${type}`}
          bg={color} 
          h={rippleSize[index]} 
          w={rippleSize[index]}
        />
      ))}
      <Group className="blur-line-group" gap={0} grow>
        {Array.from({ length: bluredline }).map((_, index) => (
          <Box key={index} className="blur-line"/>
        ))}
      </Group>
    </Box>
  );
};

export default RippleCard;