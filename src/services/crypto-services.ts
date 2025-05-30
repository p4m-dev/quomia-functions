import {
  checkNFTExistence,
  loadWallet,
  mintNFT,
  maybeAirdrop,
} from "../utils/crypto-utils";
import { Box } from "../models/types";
import { collNfts } from "../config/config";
import TimeError from "../errors/time-error";
import { NFTDB } from "../models/nft";
import { nftConverter } from "../converter/nft-converter";
import { getSolanaPrice } from "../client/coingecko-client";

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

  const currentPrice = await getSolanaPrice();

  const nft = await mintNFT(box, keypair, boxId, currentPrice);

  if (nft !== null) {
    const docRef = await collNfts.add(nft);
    const createdNft = await docRef.get();
    return createdNft;
  }
  return null;
};

const retrieveNFT = async (boxId: string): Promise<NFTDB | null> => {
  const nfts = await collNfts
    .where("boxId", "==", boxId)
    .withConverter(nftConverter)
    .limit(1)
    .get();

  if (nfts.empty) {
    return null;
  }
  return nfts.docs[0].data() as NFTDB;
};

const retrieveNFTByMintAddress = async (mintAddress: string) => {
  const nfts = await collNfts
    .where("mintAddress", "==", mintAddress)
    .withConverter(nftConverter)
    .get();

  if (nfts.empty) {
    return null;
  }
  return nfts.docs[0].data() as NFTDB;
};

export {
  checkTimeSlotAvailability,
  saveNFT,
  retrieveNFT,
  retrieveNFTByMintAddress,
};
