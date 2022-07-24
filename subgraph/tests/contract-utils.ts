import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import { Donation, DonationApproval } from "../generated/Contract/Contract"

export function createDonationEvent(
  donor: Address,
  spender: Address,
  value: BigInt
): Donation {
  let donationEvent = changetype<Donation>(newMockEvent())

  donationEvent.parameters = new Array()

  donationEvent.parameters.push(
    new ethereum.EventParam("donor", ethereum.Value.fromAddress(donor))
  )
  donationEvent.parameters.push(
    new ethereum.EventParam("spender", ethereum.Value.fromAddress(spender))
  )
  donationEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  )

  return donationEvent
}

export function createDonationApprovalEvent(
  owner: Address,
  spender: Address,
  value: BigInt
): DonationApproval {
  let donationApprovalEvent = changetype<DonationApproval>(newMockEvent())

  donationApprovalEvent.parameters = new Array()

  donationApprovalEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  donationApprovalEvent.parameters.push(
    new ethereum.EventParam("spender", ethereum.Value.fromAddress(spender))
  )
  donationApprovalEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  )

  return donationApprovalEvent
}
