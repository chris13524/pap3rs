import { NextPage } from "next";
import { useRouter } from "next/router";

const Paper: NextPage = () => {
  const router = useRouter();
  const { cid } = router.query;

  const filename = "Towards%20a%20Decentralized%20Process%20for%20Scientific%20Publication%20and%20Peer%20Review.pdf";
  const src = `https://${cid}.ipfs.dweb.link/${filename}`;

  return (
    <iframe src={src} style={{
      display: "block",
      width: "100%",
      height: "100%",
      border: 0,
    }} />
  );
};

export default Paper;
