import { Group } from "@mantine/core";
import { DataMenus } from "@/variables/dummyData";

const NavbarLandingPage = () => {
  return (
    <Group gap={41}>
      {DataMenus.map((item, key) => (
        <span
          key={key}
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