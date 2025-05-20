import {
  checkNFTExistence,
  loadWallet,
  mintNFT,
  maybeAirdrop,
} from "../utils/crypto-utils";
import { Box } from "../models/types";
import { collNfts } from "../config/config";
import TimeError from "../errors/time-error";
import { NFT } from "../models/nft";
import { nftConverter } from "../converter/nft-converter";

const checkTimeSlotAvailability = async (startDate: Date, endDate: Date) => {
  // Check if temporal slot is free
  const isAlreadyPurchased = await checkNFTExistence(startDate, endDate);
  console.log("startDate: ", startDate, ", endDate: ", endDate);

  if (isAlreadyPurchased) {
    throw new TimeError("Temporal slot already purchased!");
  }
};

const saveNFT = async (box: Box, boxId: string) => {
  const keypair = await loadWallet();

  await maybeAirdrop(keypair);

  const nft = await mintNFT(box, keypair, boxId);

  if (nft !== null) {
    const docRef = await collNfts.add(nft);
    const createdNft = await docRef.get();
    return createdNft;
  }
  return null;
};

const retrieveNFT = async (boxId: string): Promise<NFT | null> => {
  const nfts = await collNfts
    .where("boxId", "==", boxId)
    .withConverter(nftConverter)
    .limit(1)
    .get();

  if (nfts.empty) {
    return null;
  }
  return nfts.docs[0].data() as NFT;
};

export { checkTimeSlotAvailability, saveNFT, retrieveNFT };
