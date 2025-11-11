import { useViewportSize } from "@mantine/hooks";

const useViewport = () => {
  const { width } = useViewportSize();
  const isMobile = width < 768;
  const isDesktop = width >= 1200;
  return { isMobile, isDesktop };
}

export default useViewport;