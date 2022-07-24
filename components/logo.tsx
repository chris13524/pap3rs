import { Title } from "@mantine/core";
import { NextPage } from "next";
import Image from "next/image";

const Logo: NextPage = () => {
  return <Image src="/logo.png" width={165} height={61} />;
};

export default Logo;
