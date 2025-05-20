import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { collBoxes } from "../config/config";
import { boxConverter } from "../converter/box-converter";
import { BoxResponseDB, BoxResponseWithNFT } from "../models/types";
import { retrieveNFT } from "./crypto-services";

const retrieveBalance = async () => {
  const walletAddress = "";
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const publicKey = new PublicKey(walletAddress);

  const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
    publicKey,
    {
      programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
    }
  );

  tokenAccounts.value.forEach((accountInfo) => {
    const parsedInfo = accountInfo.account.data.parsed.info;
    const amount = parsedInfo.tokenAmount.uiAmount;
    const mint = parsedInfo.mint;
    console.log(`Token mint: ${mint} | amount: ${amount}`);
  });
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
