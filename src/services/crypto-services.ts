import { checkNFTExistence, createNFT } from "../utils/crypto-utils";
import TimeError from "../errors/time-error";
import { Box } from "../models/types";
import { collNfts } from "../config/config";

const checkTimeSlotAvailability = async (startDate: Date, endDate: Date) => {
  // Check if temporal slot is free
  const isAlreadyPurchased = await checkNFTExistence(startDate, endDate);
  console.log("startDate: ", startDate, ", endDate: ", endDate);

  if (isAlreadyPurchased) {
    throw new TimeError("Temporal slot already purchased!");
  }
};

const saveNFT = async (box: Box) => {
  const nft = await createNFT(box);

  if (nft !== null) {
    const docRef = await collNfts.add(nft);
    const createdBox = await docRef.get();
    return createdBox;
  }
  return null;
};

export { checkTimeSlotAvailability, saveNFT };
