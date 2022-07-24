export type Paper = {
  authors: string[],
  title: string,
  description: string,
  content: string,
  contentFileName: string,
  references: string[],
  reviews: string[],
};

export type PaperWithId = Paper & { id: string };

export const allPapers = [
  "bafybeia2mm2clf3wnkwqlakjyhichnakuwn2fn2c4ycktxzmxa3qjanqou",
  "bafybeidugsonwrnlr5wfrmi5r7beqkhx6pphegu5kgn4eeqwrdf7e3mw6y",
  "bafybeib7d2fya6d2fjhsq7mbzaeksnw7jkhlzbmk3s6zskmced6xuies7a",
];
