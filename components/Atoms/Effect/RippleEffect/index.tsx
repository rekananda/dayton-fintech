'use client';

<<<<<<< HEAD
import { Box, Group } from "@mantine/core";
import './style.css';
import { RippleEffectT } from "./type";

const RippleEffect = ({ color = 'primary', size = 350, position = 'center', shape = 'diamond', ...rest }: RippleEffectT) => {
  const isFull = ['center'].includes(position);
  const outerSize = isFull ? size*2 : size*1.3;
  const rippleCount = isFull ? 13 : 6;
  const widthRipple = isFull ? outerSize/1.3 : outerSize/2;

  return (
    <Box {...rest}>
      <Box className="ripple-effect-main" h={outerSize} w={widthRipple} style={{ '--width-ripple': widthRipple + 'px' }}>
=======
import { Box, BoxProps, Group, MantineColor } from "@mantine/core";
import './index.css';

type RippleEffectPropsT = BoxProps & {
  color?: MantineColor;
  size?: number;
  position?: 'center' | 'left' | 'right';
  shape?: 'circle' | 'diamond';
};

const RippleEffect = ({ color = 'primary', size = 350, position = 'center', shape = 'diamond', ...rest }: RippleEffectPropsT) => {
  const isFull = ['center'].includes(position);
  const outerSize = isFull ? size*2 : size*1.3;
  const rippleCount = isFull ? 13 : 6;;

  return (
    <Box {...rest}>
      <Box className="ripple-effect-main" h={outerSize} w={isFull ? outerSize/1.3 : outerSize/2}>
>>>>>>> origin/stagging
        <Box
          className={[
            "ripple-effect-inner",
            "ripple-effect-inner-" + position,
            "ripple-effect-inner-" + shape,
          ].join(" ")}
          h={size}
          w={size}
          bg={color}
        />
        <Group className="ripple-effect-glass-group" gap={0} grow>
          {Array.from({ length: rippleCount }).map((_, index) => (
            <Box key={index} className="ripple-effect-glass"/>
          ))}
        </Group>
      </Box>
    </Box>
  );
};

export default RippleEffect;