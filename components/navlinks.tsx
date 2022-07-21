import { UnstyledButton, Text } from "@mantine/core";
import { NextLink } from "@mantine/next";

type Link = {
    href: string,
    label: string,
};

const NavLink = ({ href, label }: Link) => {
  return <UnstyledButton component={NextLink} href={href} sx={(theme) => ({
    display: "block",
    width: "100%",
    padding: theme.spacing.xs,
    borderRadius: theme.radius.sm,
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
    "&:hover": {
      backgroundColor:
                theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
    },
  })}>
    <Text>{label}</Text>
  </UnstyledButton>;
};

const links: Link[] = [
  { href: "/", label: "Home" },
  { href: "/upload", label: "Upload paper" },
  { href: "/donate", label: "Donate" },
];

const NavLinks = ({ }) => {
  return <>{links.map(link => <NavLink {...link} key={link.label} />)}</>;
};

export default NavLinks;
