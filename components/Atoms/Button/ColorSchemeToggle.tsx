'use client';

import { useEffect, useState } from "react";
import { Tooltip, useMantineColorScheme, useComputedColorScheme, Button, Group, Text } from "@mantine/core";
import Icon from "../Icon";
import useViewport from "@/hooks/useViewport";
import { useLocalStorage } from "@mantine/hooks";
import { MantineColorScheme } from "@mantine/core";

const ColorSchemeToggle = () => {
  const { colorScheme, setColorScheme} = useMantineColorScheme();
  const { isMobile } = useViewport();
  const computedColorScheme = useComputedColorScheme('dark', { getInitialValueInEffect: true });
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setLatestColorScheme] = useLocalStorage<MantineColorScheme>({
    key: 'latest-color-scheme-landing-page',
    defaultValue: colorScheme,
  });

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 100);  
  }, []);

  const toggleColorScheme = () => {
    setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');
    setLatestColorScheme(colorScheme === 'dark' ? 'light' : 'dark');
  };

  const isDark = mounted ? computedColorScheme === 'dark' : true;

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