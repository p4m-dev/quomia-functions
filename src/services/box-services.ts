import { collBoxes } from "../config/config";
import { mapBoxFuture, mapBoxRewind, mapBoxSocial } from "../mapper/box-mapper";
import {
  Box,
  BoxResponse,
  FutureSchema,
  RewindSchema,
  SocialSchema,
} from "../models/types";
import { checkFutureDate } from "../helper/box-helper";
import { boxConverter } from "../converter/box-converter";
import TimeError from "../errors/time-error";
import { checkTimeSlotAvailability, saveNFT } from "./crypto-services";

const handleBoxRewind = async (rewindSchema: RewindSchema) => {
  const box: Box = mapBoxRewind(rewindSchema);

  // Check if temporal slot is free
  checkTimeSlotAvailability(box.dates.startDate, box.dates.endDate);

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

  saveNFT(box);

  return createdBox;
};

const handleBoxFuture = async (futureSchema: FutureSchema) => {
  const box: Box = mapBoxFuture(futureSchema);

  checkTimeSlotAvailability(box.dates.startDate, box.dates.endDate);

  const docRef = await collBoxes.add(box);
  const createdBox = await docRef.get();

  return createdBox;
};

const handleBoxSocial = async (socialSchema: SocialSchema) => {
  const box: Box = mapBoxSocial(socialSchema);

  checkTimeSlotAvailability(box.dates.startDate, box.dates.endDate);

  const docRef = await collBoxes.add(box);
  const createdBox = await docRef.get();

  saveNFT(box);

  return createdBox;
};

// TODO: add pagination
const retrieveSocialBoxes = async (): Promise<BoxResponse[]> => {
  try {
    const boxes: BoxResponse[] = [];

    const snapshot = await collBoxes
      .where("info.type", "==", "social")
      .orderBy("createdAt", "desc")
      .withConverter(boxConverter)
      .get();

    snapshot.forEach((doc) => {
      const box = { ...(doc.data() as BoxResponse) };
      boxes.push(box);
    });

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
