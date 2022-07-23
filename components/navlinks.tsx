import { UnstyledButton, Text, Group } from "@mantine/core";
import { NextLink } from "@mantine/next";

type Link = {
  href: string,
  label: string,
};

const NavLink = ({ href, label }: Link) => {
  return <UnstyledButton component={NextLink} href={href} sx={(theme) => ({
    padding: theme.spacing.xs,
    borderRadius: theme.radius.sm,
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
    },
  })}>
    {label}
  </UnstyledButton>;
};

const links: Link[] = [
  { href: "/", label: "Home" },
  { href: "/upload", label: "Upload paper" },
  { href: "/tableland", label: "Tableland utility" }
];

const NavLinks = ({ }) => {
  return <Group>{links.map(link => <NavLink {...link} key={link.label} />)}</Group>;
};

export default NavLinks;
