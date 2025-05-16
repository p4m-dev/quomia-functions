import { collBoxes, collTimers } from "../config/config";
import { boxConverter } from "../converter/box-converter";
import { Timer } from "../models/timer";
import { BoxResponseDB, BoxResponseWithNFT } from "../models/types";
import { retrieveNFT } from "./crypto-services";

const retrieveTimers = async () => {
  const timers: Timer[] = [];

  const snapshot = await collTimers.orderBy("createdAt", "desc").get();

  snapshot.forEach((doc) => {
    timers.push({ ...(doc.data() as Timer) });
  });

  return timers;
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

export { retrieveTimers, retrieveBoxesByUsernameAndBoxType };
