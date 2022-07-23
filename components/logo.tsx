import { Title } from "@mantine/core";
import { NextPage } from "next";
import Image from "next/image";

const Logo: NextPage = () => {
  return <Image src="/favicon.ico" width={60} height={60} />;
};

export default Logo;
