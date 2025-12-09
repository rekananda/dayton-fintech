'use client';

import { Group } from "@mantine/core";
import { useAppSelector } from "@/store/hooks";

const NavbarLandingPage = () => {
  const menus = useAppSelector((state) => state.landing.menus);

  return (
    <Group gap={41}>
      {menus.map((item) => (
        <span
          key={item.id}
          className="cursor-pointer text-body text-[14px] hover:text-primary-6"
          onClick={() => {
            const target = document.getElementById(item.href);
            if (target) {
              target.focus();
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}
          tabIndex={0}
          role="button"
        >
          {item.label}
        </span>
      ))}
    </Group>
  );
}

export default NavbarLandingPage;