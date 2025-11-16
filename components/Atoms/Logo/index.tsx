import { Box, Image } from "@mantine/core";

const MainLogo = ({ size = '100%' }: { size?: string | number }) => {
  return (
    <Box w={size} h={size} style={{ borderRadius: '8px' }} bg="primary" p={4}>
      <Image src="/logo.png" alt="Dayton Fintech" width={size} height={size} />
    </Box>
  );
};

export default MainLogo;