'use client';

import { useAppSelector } from "@/store/hooks";
import { Burger, Menu } from "@mantine/core";
import { useState } from "react";

const MenuLandingPage = () => {
  const [opened, setOpened] = useState(false);
  const menus = useAppSelector((state) => state.landing.menus);

  return (
    <Menu shadow="md" width={200} position="bottom-end" opened={opened} onChange={setOpened}>
      <Menu.Target>
        <Burger opened={opened} onClick={() => setOpened(!opened)}/>
      </Menu.Target>

      <Menu.Dropdown>
        {menus.map((item, key) => (
          <div key={key}>
            <Menu.Item key={key} onClick={() => {
              const target = document.getElementById(item.href);
              if (target) {
                target.focus();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}>
              {item.label}
            </Menu.Item>
          </div>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}

export default MenuLandingPage;