import {
  Donation,
  DonationApproval,
  NewAuthor,
  PublishPaper,
} from "../generated/Pap3rs/Pap3rs"
import { Author, Paper, PaperAuthor, PaperReference, PaperReview } from "../generated/schema"

export function handleDonation(event: Donation): void { }

export function handleDonationApproval(event: DonationApproval): void { }

export function handleNewAuthor(event: NewAuthor): void {
  const author = new Author(event.params.addr.toHex());
  author.name = event.params.name;
  author.address = event.params.addr.toHex();
  author.save();
}

// export function handleNewAuthor(event: NewAuthor): void {
//   const data = ipfs.cat(event.params.cid);
//   const author = new Author(event.params.addr.toHex());
//   author.name = event.params.name;
//   author.address = event.params.addr.toHex();
//   author.save();
// }

export function handlePublishPaper(event: PublishPaper): void {
  const paper = new Paper(event.params.content);
  paper.title = event.params.title;
  paper.description = event.params.description;
  paper.content = event.params.content;
  paper.contentFileName = event.params.contentFileName;
  paper.save();

  for (let i = 0; i < event.params.authors.length; i++) {
    const auth = event.params.authors[i];
    const author = new PaperAuthor(event.params.content.concat(auth.toHex()));
    author.paper = event.params.content;
    author.author = auth.toHex();
    author.save();
  }

  for (let i = 0; i < event.params.references.length; i++) {
    const ref = event.params.references[i];
    const reference = new PaperReference(event.params.content.concat(ref));
    reference.paper = event.params.content;
    reference.reference = ref;
    reference.save();
  }

  for (let i = 0; i < event.params.reviews.length; i++) {
    const rev = event.params.reviews[i];
    const review = new PaperReview(event.params.content.concat(rev));
    review.paper = event.params.content;
    review.review = rev;
    review.save();
  }
}
