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
  PublicKey,
} from "@solana/web3.js";
import {
  createNft,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import fs from "fs";
import { fromWeb3JsKeypair } from "@metaplex-foundation/umi-web3js-adapters";
import { Box } from "../models/types";
import { mapJsonMetadata, mapNFT } from "../mapper/nft-mapper";
import { collNfts } from "../config/config";
import { Nft } from "@metaplex-foundation/js";
import { NFT } from "../models/nft";

const generateWallet = async () => {
  return null;
};

const retrieveAirdrop = async () => {
  try {
    const secret = JSON.parse(fs.readFileSync("wallet.json", "utf8"));
    const keypair = Keypair.fromSecretKey(new Uint8Array(secret));

    // 2. Airdrop su Devnet
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    const airdropSignature = await connection.requestAirdrop(
      keypair.publicKey,
      LAMPORTS_PER_SOL
    );
    await connection.confirmTransaction(airdropSignature);
    console.log("Airdrop completato!: ", keypair.publicKey.toBase58());
  } catch (error) {
    console.error(error);
  }
};

const createNFT = async (box: Box): Promise<NFT | null> => {
  // 1. Load Existing wallet
  const secret = JSON.parse(fs.readFileSync("wallet.json", "utf8"));
  const keypair = Keypair.fromSecretKey(new Uint8Array(secret));

  // 3. Umi adaptation
  const umi = createUmi(clusterApiUrl("devnet"));
  const signer = createSignerFromKeypair(umi, fromWeb3JsKeypair(keypair));
  umi.use(keypairIdentity(signer)).use(mplTokenMetadata()).use(irysUploader());

  try {
    const metadata = mapJsonMetadata(box);

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

    return mapNFT(metadata, box, uri, mintAddress);
  } catch (error) {
    console.error(error);
    return null;
  }
};

const checkNFTExistence = async (startDate: Date, endDate: Date) => {
  const docs = await collNfts
    .where("dates.startDate", "<=", startDate)
    .where("dates.endDate", ">=", endDate)
    .get();

  return !docs.empty;
};

export { createNFT, retrieveAirdrop, checkNFTExistence };
