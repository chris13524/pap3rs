import { BigInt, Entity } from "@graphprotocol/graph-ts"
import {
  Donation,
  DonationApproval,
  NewAuthor,
  PublishPaper,
} from "../generated/Pap3rs/Pap3rs"
import { Author, Paper, ExampleEntity, PaperAuthor, PaperReference, PaperReview } from "../generated/schema"
import { ipfs } from '@graphprotocol/graph-ts'

export function handleDonation(event: Donation): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = ExampleEntity.load(event.transaction.from.toHex())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!entity) {
    entity = new ExampleEntity(event.transaction.from.toHex())

    // Entity fields can be set using simple assignments
    entity.count = BigInt.fromI32(0)
  }

  // BigInt and BigDecimal math are supported
  entity.count = entity.count + BigInt.fromI32(1)

  // Entity fields can be set based on event parameters
  entity.donor = event.params.donor
  entity.spender = event.params.spender

  // Entities can be written to the store with `.save()`
  entity.save()

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract._name(...)
  // - contract.contentOwners(...)
  // - contract.getDonationBalance(...)
  // - contract.getOwner(...)
  // - contract.listCids(...)
  // - contract.name(...)
  // - contract.tableName(...)
  // - contract.tokenBalances(...)
}

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
