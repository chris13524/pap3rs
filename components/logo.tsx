import { NextPage } from "next";
import Image from "next/image";

const Logo: NextPage = () => {
  return <Image src="logo.png" width={165} height={61} alt="Pap3rs" />;
};

export default Logo;
