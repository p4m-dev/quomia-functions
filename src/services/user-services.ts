import {
  clusterApiUrl,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";
import { collBoxes } from "../config/config";
import { boxConverter } from "../converter/box-converter";
import { BoxResponseDB, BoxResponseWithNFT } from "../models/types";
import { retrieveNFT, retrieveNFTByMintAddress } from "./crypto-services";
import { getLossProfitWithPercentage, loadWallet } from "../utils/crypto-utils";
import { mapUserBalance } from "../mapper/user-mapper";
import { getSolanaPrice } from "../client/coingecko-client";
import { Balance } from "../models/user";

const retrieveBalance = async (): Promise<Balance> => {
  const keypair = await loadWallet();
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  const balance = await connection.getBalance(keypair.publicKey);
  const solBalance = balance / LAMPORTS_PER_SOL;

  const walletAddress = keypair.publicKey.toBase58();
  const publicKey = new PublicKey(walletAddress);

  const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
    publicKey,
    {
      programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
    }
  );

  let totalAmount = 0;
  let totalEstimatedPrice = 0;
  let totalPurchaseValue = 0;

  // Retrieve current SOL price
  const currentPrice = await getSolanaPrice();

  for (const accountInfo of tokenAccounts.value) {
    const parsedInfo = accountInfo.account.data.parsed.info;
    const amount = parsedInfo.tokenAmount.uiAmount;
    const mint = parsedInfo.mint;
    console.log(`Token mint: ${mint} | amount: ${amount}`);

    const nft = await retrieveNFTByMintAddress(mint);

    if (!nft) continue;

    totalEstimatedPrice += nft.quantity;
    totalPurchaseValue += nft.purchaseValue;
    totalAmount += amount;
  }

  const walletBalance = `${solBalance.toFixed(4)} SOL`;
  console.log("walletBalance: ", walletBalance);

  const nftsAmount = `${totalAmount} NFTs`;
  console.log("nftsAmount: ", nftsAmount);

  const estimatedValue = `${totalEstimatedPrice.toFixed(4)} SOL`;
  console.log("estimatedValue: ", estimatedValue);

  console.log("totalPurchaseValue: ", totalPurchaseValue);

  const priceBalance = currentPrice * totalEstimatedPrice;
  const priceBalanceStr = `${priceBalance.toFixed(4)} €`;
  console.log("priceBalance: ", priceBalance);

  const { percentage, lossProfit } = getLossProfitWithPercentage(
    totalPurchaseValue,
    priceBalance
  );
  console.log("percentage: ", percentage);

  return mapUserBalance(
    walletBalance,
    priceBalanceStr,
    nftsAmount,
    estimatedValue,
    percentage,
    lossProfit
  );
};

const retrieveBoxesByUsernameAndBoxType = async (
  username: string | undefined,
  boxType: string | undefined
) => {
  let boxSnapshot;
  const boxes: BoxResponseWithNFT[] = [];

  if (boxType) {
    boxSnapshot = await collBoxes
      .where("user.sender", "==", username)
      .where("info.type", "==", boxType)
      .withConverter(boxConverter)
      .get();
  } else {
    boxSnapshot = await collBoxes
      .where("user.sender", "==", username)
      .withConverter(boxConverter)
      .get();
  }

  for (const doc of boxSnapshot.docs) {
    const box = doc.data() as BoxResponseDB;
    const boxId = doc.id;

    const nft = await retrieveNFT(boxId);

    if (nft !== null) {
      boxes.push({
        ...box,
        nft: nft,
      });
    }
  }

  return boxes;
};

export { retrieveBalance, retrieveBoxesByUsernameAndBoxType };
