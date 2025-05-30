import { collBoxes } from "../config/config";
import { mapBoxFuture, mapBoxRewind, mapBoxSocial } from "../mapper/box-mapper";
import {
  Box,
  BoxResponseWithNFT,
  BoxResponseDB,
  FutureSchema,
  RewindSchema,
  SocialSchema,
} from "../models/types";
import { checkFutureDate } from "../helper/box-helper";
import { boxConverter } from "../converter/box-converter";
import TimeError from "../errors/time-error";
import {
  checkTimeSlotAvailability,
  retrieveNFT,
  saveNFT,
} from "./crypto-services";
import { mapNFTFromDB } from "../mapper/nft-mapper";

const handleBoxRewind = async (rewindSchema: RewindSchema) => {
  const box: Box = mapBoxRewind(rewindSchema);

  // Check if temporal slot is free
  await checkTimeSlotAvailability(box.dates.startDate, box.dates.endDate);

  // Check if future dates are free
  const futureDates = box.dates.futureDates;

  if (futureDates) {
    futureDates.forEach(async (date) => {
      const isDateAlreadyTaken = await checkFutureDate(date);

      if (isDateAlreadyTaken) {
        throw new TimeError(`Future date ${date} not available!`);
      }
    });
  }

  const docRef = await collBoxes.add(box);
  const createdBox = await docRef.get();
  const boxId = createdBox.id;

  await saveNFT(box, boxId);

  return createdBox;
};

const handleBoxFuture = async (futureSchema: FutureSchema) => {
  const box: Box = mapBoxFuture(futureSchema);
  return await saveBox(box);
};

const handleBoxSocial = async (socialSchema: SocialSchema) => {
  const box: Box = mapBoxSocial(socialSchema);
  return await saveBox(box);
};

const saveBox = async (box: Box) => {
  await checkTimeSlotAvailability(box.dates.startDate, box.dates.endDate);

  const docRef = await collBoxes.add(box);
  const createdBox = await docRef.get();
  const boxId = createdBox.id;

  await saveNFT(box, boxId);

  return createdBox;
};

// TODO: add pagination
const retrieveSocialBoxes = async (): Promise<BoxResponseWithNFT[]> => {
  try {
    const boxes: BoxResponseWithNFT[] = [];

    const snapshot = await collBoxes
      .where("info.type", "==", "social")
      .orderBy("createdAt", "desc")
      .withConverter(boxConverter)
      .get();

    for (const doc of snapshot.docs) {
      const box = doc.data() as BoxResponseDB;
      const boxId = doc.id;

      const nft = await retrieveNFT(boxId);

      if (nft !== null) {
        boxes.push({
          ...box,
          nft: mapNFTFromDB(nft),
        });
      }
    }

    return boxes;
  } catch (error: any) {
    console.error("Error while retrieving boxes: ", error);
    throw new Error(error.message);
  }
};

export {
  handleBoxRewind,
  handleBoxFuture,
  handleBoxSocial,
  retrieveSocialBoxes,
};
