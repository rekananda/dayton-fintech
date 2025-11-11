import { RippleShapeT } from "@/components/Atoms/Effect/RippleEffect";
import MainText from "@/components/Atoms/MainText";
import useViewport from "@/hooks/useViewport";
import { Badge, Box, BoxProps, Group, MantineColor, Stack } from "@mantine/core";
import './style.css';

type RipplePositionT = 'top-right' | 'bottom-left' | 'top-left' | 'bottom-right';
export type RippleCardT = BoxProps & {
  title: string;
  description?: string;
  tags?: string[];
  children?: React.ReactNode;
  ripple?: RipplePositionT[];
};

type RippleBackgroundT = {
  position: RipplePositionT[];
  type?: RippleShapeT;
  color?: MantineColor;
  rippleSize?: number[];
  bluredline?: number
};

export const RippleBackground = ({ position, type = 'diamond', color = 'primary', rippleSize = [], bluredline = 24 }: RippleBackgroundT) => {
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

const RippleCard = ({ title, description, tags=[], children, ripple=[], ...rest }: RippleCardT) => {
  const { isMobile } = useViewport();

  return (
    <Box {...rest} className={`ripple-card-container ${rest.className}`}>
      <Stack className="ripple-card-content" p={isMobile ? 20 : 40}>
        {tags.length > 0 && <Group>
          {tags.map((tag) => (
            <Badge key={tag} className='light-badge' color='primary.7'>{tag}</Badge>
          ))}
        </Group>}
        <MainText variant="heading5" fw="600" fz={isMobile ? 24 : 28}>{title}</MainText>
        {description && <MainText variant="body" fz={isMobile ? 14 : 16}>{description}</MainText>}
        {children && <Box p={16}>
          {children}
        </Box>}
      </Stack>
      <RippleBackground position={ripple} type="circle" bluredline={isMobile ? 12 : 20}/>
    </Box>
  );
};

export default RippleCard;