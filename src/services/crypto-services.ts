import {
  checkNFTExistence,
  loadWallet,
  mintNFT,
  retrieveAirdrop,
} from "../utils/crypto-utils";
import { Box } from "../models/types";
import { collNfts } from "../config/config";
import TimeError from "../errors/time-error";

const checkTimeSlotAvailability = async (startDate: Date, endDate: Date) => {
  // Check if temporal slot is free
  const isAlreadyPurchased = await checkNFTExistence(startDate, endDate);
  console.log("startDate: ", startDate, ", endDate: ", endDate);

  if (isAlreadyPurchased) {
    throw new TimeError("Temporal slot already purchased!");
  }
};

const saveNFT = async (box: Box) => {
  const keypair = await loadWallet();

  await retrieveAirdrop(keypair);

  const nft = await mintNFT(box, keypair);

  if (nft !== null) {
    const docRef = await collNfts.add(nft);
    const createdNft = await docRef.get();
    return createdNft;
  }
  return null;
};

export { checkTimeSlotAvailability, saveNFT };
