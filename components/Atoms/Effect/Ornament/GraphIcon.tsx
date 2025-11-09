import { memo } from 'react';
import type { SVGProps } from 'react';

type GraphIconProps = {
  size?: number;
  color?: string;
} & SVGProps<SVGSVGElement>;

const GraphIcon = ({ size = 52, color = 'currentColor', ...props }: GraphIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 52 52"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-hidden={props['aria-label'] ? undefined : true}
    {...props}
  >
    <path
      d="M17.0371 29.0695L17.0371 12.7778L23.426 12.7778L23.426 29.0695L20.2316 26.0881L17.0371 29.0695ZM27.6853 32.264L27.6853 4.25928L34.0742 4.25928V25.8751L27.6853 32.264ZM6.38892 39.6113L6.38892 21.2964H12.7778L12.7778 33.2223L6.38892 39.6113ZM6.38892 44.8289L20.1251 31.0927L27.6853 37.5881L39.6112 25.6621L36.2038 25.6621V21.4029L46.852 21.4029V32.051H42.5927V28.6436L27.8982 43.3381L20.338 36.8427L12.3519 44.8289H6.38892Z"
      fill={color}
    />
  </svg>
);

export default memo(GraphIcon);

