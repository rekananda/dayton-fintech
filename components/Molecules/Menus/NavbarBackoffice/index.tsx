'use client';

import { AppShell, ScrollArea, Stack } from "@mantine/core";
import { NavbarBackofficeT } from "./type";
import NavbarButton from "@/components/Atoms/Button/NavbarButton"
import { usePathname } from "next/navigation";
import { backofficeMenuSubItems } from "@/variables/dummyData";

const  NavbarBackoffice = ({children, opened, toggle, ...rest}: NavbarBackofficeT) => {
  const pathname = usePathname();
  return (
    <AppShell.Navbar {...rest}>
      <AppShell.Section>{children}</AppShell.Section>
      <AppShell.Section grow component={ScrollArea} py="md">
        <Stack gap={4}>
          {backofficeMenuSubItems.map((item, index) => (
            <NavbarButton 
              key={index} 
              icon={item.icon} 
              label={item.label} 
              href={item.href} 
              hideLabel={!opened}
              className={item.href === pathname || (index===0 && pathname === "/backoffice") ? "active" : ""}
              ml={!opened? 0 : item.subLevel * 24}
            />
          ))}
        </Stack>
      </AppShell.Section>
      <AppShell.Section pb="md">
        <NavbarButton 
          visibleFrom="sm"
          icon={opened ? "IconLayoutSidebarLeftCollapse" : "IconLayoutSidebarRightCollapse"} 
          label="Collapse Sidebar" 
          hideLabel={!opened} 
          onClick={toggle} 
        />
      </AppShell.Section>
    </AppShell.Navbar>
  );
}

export default NavbarBackoffice;