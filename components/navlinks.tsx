import { Group, Button } from "@mantine/core";
import { NextLink } from "@mantine/next";
import { ReactNode } from "react";
import { CloudUpload, Search, Tool } from "tabler-icons-react";

type Link = {
  href: string,
  label: string,
  icon: ReactNode,
};

const NavLink = ({ href, label, icon }: Link) => {
  return <Button
    variant="subtle"
    leftIcon={icon}
    component={NextLink} href={href}
    sx={(theme) => ({
      padding: theme.spacing.xs,
      borderRadius: theme.radius.sm,
      color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
      "&:hover": {
        backgroundColor:
          theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
      },
    })}>
    {label}
  </Button>;
};

const links: Link[] = [
  { href: "/", label: "Discover", icon: <Search /> },
  { href: "/publish", label: "Publish", icon: <CloudUpload /> },
  // { href: "/tableland", label: "Tableland", icon: <Tool /> }
];

const NavLinks = ({ }) => {
  return <Group>{links.map(link => <NavLink {...link} key={link.label} />)}</Group>;
};

export default NavLinks;
