'use client';

import { Box, Image } from "@mantine/core";

const MainLogo = ({ size = '100%' }: { size?: string | number }) => {
  return (
    <Box className="mainImage" w={size} h={size}>
      <Image src="/logo.png" alt="Dayton Fintech" fit="contain" />
    </Box>
  );
};

export default MainLogo;