import useViewport from "@/hooks/useViewport";
import { Container, Group, Stack } from "@mantine/core";
import MainText from "../Atoms/MainText";
import NavbarLandingPage from "../Molecules/Menus/NavbarLandingPage";

const AppFooter = () => {
  const { isMobile } = useViewport();

  return (
    <footer>
    <Container size="1440px" h="100%" px={isMobile ? 20 : 100} py={24}>
      <Group h="100%" justify="space-between">
        <Stack>
          <MainText variant="body" fz={14}>
            © 2025 Dayton Fintech. Seluruh hak cipta dilindungi.<br />
            Kontak: hello@daytonfintech.com
          </MainText>
        </Stack>
        <NavbarLandingPage />
      </Group>
    </Container>
    </footer>
  )
}

export default AppFooter;