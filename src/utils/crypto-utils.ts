import {
  createSignerFromKeypair,
  generateSigner,
  keypairIdentity,
  percentAmount,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  createNft,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { fromWeb3JsKeypair } from "@metaplex-foundation/umi-web3js-adapters";
import { Box } from "../models/types";
import { mapJsonMetadata, mapNFT } from "../mapper/nft-mapper";
import { bucket, collNfts } from "../config/config";
import { NFT } from "../models/nft";

const loadWallet = async (): Promise<Keypair> => {
  const file = bucket.file("wallets/wallet.json");
  const [contents] = await file.download();
  const secret = JSON.parse(contents.toString());
  return Keypair.fromSecretKey(new Uint8Array(secret));
};

const maybeAirdrop = async (keypair: Keypair) => {
  try {
    // 2. Airdrop su Devnet
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    const balance = await connection.getBalance(keypair.publicKey);

    const solBalance = balance / LAMPORTS_PER_SOL;
    console.log("Balance: ", solBalance, "SOL");

    if (balance < 0.1 * LAMPORTS_PER_SOL) {
      const airdropSignature = await connection.requestAirdrop(
        keypair.publicKey,
        LAMPORTS_PER_SOL
      );
      await connection.confirmTransaction(airdropSignature);
      console.log("Airdrop completato!: ", keypair.publicKey.toBase58());
    }
  } catch (error) {
    console.error(error);
  }
};

const mintNFT = async (
  box: Box,
  keypair: Keypair,
  boxId: string
): Promise<NFT | null> => {
  // 1. Umi adaptation
  const umi = createUmi(clusterApiUrl("devnet"));
  const signer = createSignerFromKeypair(umi, fromWeb3JsKeypair(keypair));
  umi.use(keypairIdentity(signer)).use(mplTokenMetadata()).use(irysUploader());

  try {
    const initialPrice = getTimeTokenPrice(
      box.dates.startDate,
      box.dates.endDate
    );
    console.log("Computed price: ", initialPrice);

    const metadata = mapJsonMetadata(box, initialPrice);

    // 4. Upload metadata
    const uri = await umi.uploader.uploadJson(metadata);

    console.log("Uri Created: ", uri);

    const mint = generateSigner(umi);

    // 5. Create NFT
    await createNft(umi, {
      mint,
      name: box.info.title,
      symbol: "QUOMIA",
      uri,
      sellerFeeBasisPoints: percentAmount(5),
    }).sendAndConfirm(umi);

    const mintAddress = mint.publicKey.toString();

    console.log("Mint account (NFT): ", mintAddress);

    console.log("NFT creato!");

    return mapNFT(metadata, box, uri, mintAddress, boxId, initialPrice);
  } catch (error) {
    console.error(error);
    return null;
  }
};

const checkNFTExistence = async (startDate: Date, endDate: Date) => {
  const docs = await collNfts
    .where("startDate", "<=", endDate)
    .where("endDate", ">=", startDate)
    .get();

  return !docs.empty;
};

const getTimeTokenPrice = (startDate: Date, endDate: Date): number => {
  const now = new Date();

  const hoursUntilStart =
    (startDate.getTime() - now.getTime()) / (1000 * 60 * 60);

  const durationHours =
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);

  let basePricePerHour: number;

  if (hoursUntilStart < 1) basePricePerHour = 0.05;
  else if (hoursUntilStart < 24) basePricePerHour = 0.03;
  else if (hoursUntilStart < 168) basePricePerHour = 0.015;
  else basePricePerHour = 0.005;

  const totalPrice = basePricePerHour * durationHours;

  return parseFloat(totalPrice.toFixed(4));
};

export {
  mintNFT,
  maybeAirdrop,
  checkNFTExistence,
  loadWallet,
  getTimeTokenPrice,
};
