'use client';

import { useEffect, useState } from "react";
import { Tooltip, useMantineColorScheme, useComputedColorScheme, Button, Group, Text } from "@mantine/core";
import Icon from "../Icon";
import { useViewportSize } from "@mantine/hooks";

const ColorSchemeToggle = () => {
  const { toggleColorScheme } = useMantineColorScheme();
  const { width } = useViewportSize();
  const computedColorScheme = useComputedColorScheme('dark', { getInitialValueInEffect: true });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 100);
  }, []);

  const isDark = mounted ? computedColorScheme === 'dark' : true;
  const isMobile = width < 768;

  return (
    <Tooltip label={isDark ? 'Light mode' : 'Dark mode'} position="bottom" withArrow>
      <Button variant={isMobile ? "transparent":"outline"} radius="xl" onClick={() => toggleColorScheme()} color="dark" size="lg" px={isMobile ? 0 : 26}>
        <Group gap={isMobile ? 0 : 8}>
          <Icon name={isDark ? 'IconMoon' : 'IconSun'} size={20} /> 
          <Text hidden={isMobile}>{isDark ? 'Dark' : 'Light'}</Text>
        </Group>
      </Button>
    </Tooltip>
  );
}

export default ColorSchemeToggle;