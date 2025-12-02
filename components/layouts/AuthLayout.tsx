import { Box, Grid, Stack } from "@mantine/core";
import useViewport from "@/hooks/useViewport";
import MainLogo from "../Atoms/Logo";
import './authpage.style.css';
import MainText from "../Atoms/MainText";
import RippleEffect from "../Atoms/Effect/RippleEffect";
import MainButton from "../Atoms/Button/MainButton";
import { useRouter } from 'next/navigation';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const { isMobile } = useViewport();
  const router = useRouter();

  return (
    <Grid className={`auth-layout-container ${isMobile ? "layout-mobile" : ""}`} gutter={0}>
      <Grid.Col span={{ base: 12, md: "content" }} mih={isMobile ? "fit-content" : "100dvh"}>
        <Box className="auth-layout-accent-container">
          <Stack className="auth-layout-accent-content" gap={isMobile ? 16 : 24} p={isMobile ? 32 : 48}>
            <MainLogo size={isMobile ? 50 : 60} />
            <MainText variant="heading4" fz={32} ta="center" pt={isMobile ? 16 : 40}>
              Dayton Backoffice
            </MainText>
            <MainText className="accent-description" variant="body" ta="center" fz={16}>
              Secure access to manage pages and content.<br/>
              Keep every element up to date with precision.
            </MainText>
          </Stack>
          <RippleEffect className="auth-layout-ripple ripple-r" position='right' color='primary.8' size={500}/>
        </Box>
      </Grid.Col>
      <Grid.Col className="auth-layout-content-container" span={{ base: 12, md: "auto" }} >
        <Stack w="100%" align="center">
          <Box className="auth-layout-content" bg="white">
            {children}
          </Box>
          <MainButton variant="transparent" onClick={() => router.push('/')} c="dimmed">
          ← Kembali ke Halaman Utama
          </MainButton>
        </Stack>
      </Grid.Col>
    </Grid>
  );
};

export default AuthLayout;