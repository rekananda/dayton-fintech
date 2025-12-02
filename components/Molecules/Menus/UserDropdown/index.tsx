'use client';

import Icon from "@/components/Atoms/Icon";
import MainText from "@/components/Atoms/MainText";
import { useAuth } from "@/config/auth-context";
import { Avatar, Group, Menu, Skeleton } from "@mantine/core";
import { useState } from "react";

const UserDropdown = () => {
  const { user, logout } = useAuth();
  const [size] = useState({
    avatar: 32,
    textAvatar: 14,
    textMenu: 12,
    textMenuIcon: 18,
  });

  const getInitial = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };
  
  return (
    <Menu position="bottom-end">
      <Menu.Target>
        <Group gap={10} maw={150} justify="center">
          {!user ? 
          <Skeleton height={size.avatar} circle w={size.avatar}/>: 
          <Avatar color="primary" radius="xl" size={size.avatar}>{getInitial(user.name || "")}</Avatar>
          }
          {user ? (
            <MainText 
              variant="body-semibold" 
              visibleFrom="sm" 
              fz={size.textAvatar} 
              truncate="end" 
              lineClamp={1}
            >
              Hi, {user.name}!
            </MainText>):
            <Skeleton height={size.textAvatar + 2} width={100} visibleFrom="sm"/>
          }
        </Group>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item fz={size.textMenu} leftSection={<Icon name="IconUser" size={size.textMenuIcon} />}>
          Profile
        </Menu.Item>
        <Menu.Item fz={size.textMenu} leftSection={<Icon name="IconLock" size={size.textMenuIcon} />}>
          Change Password
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item 
          c="red" 
          fz={size.textMenu} 
          leftSection={<Icon name="IconLogout" size={size.textMenuIcon} />} 
          onClick={logout}
        >
          Log out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default UserDropdown;
