import { retrieveJson } from "./ipfs";
import { queryTable } from "../utils/tableland";

const tableName: string = 'paper_80001_551';

export type Paper = {
  authors: string[],
  title: string,
  description: string,
  content: string,
  contentFileName: string,
  references: string[],
};

export type PaperWithId = Paper & { id: string };

export const allPapers = [
  "bafybeia2mm2clf3wnkwqlakjyhichnakuwn2fn2c4ycktxzmxa3qjanqou",
  "bafybeidugsonwrnlr5wfrmi5r7beqkhx6pphegu5kgn4eeqwrdf7e3mw6y",
  "bafybeib7d2fya6d2fjhsq7mbzaeksnw7jkhlzbmk3s6zskmced6xuies7a",
];

export async function getPapers(cids: string[]): Promise<PaperWithId[]> {
  console.log(`getPapers: ${cids}`);
  const papersFromTableland = await queryTable(`SELECT * from ${tableName};`);
  const papers = [];
  for (const paperFromTableland of papersFromTableland) {
    console.log(paperFromTableland.cid);
    console.log(await retrieveJson<PaperWithId>(paperFromTableland.cid));
    const paper = Object.assign(await retrieveJson<PaperWithId>(paperFromTableland.cid), { id: paperFromTableland.cid });
    papers.push(paper);
  }
  return papers;
}
