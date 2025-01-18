import { collBoxes } from "../config/config";
import { mapBoxFuture, mapBoxRewind, mapBoxSocial } from "../mapper/box-mapper";
import {
  Box,
  FileHelper,
  BoxResponse,
  FutureSchema,
  RewindSchema,
  SocialSchema,
} from "../models/types";
import {
  checkBoxAlreadyPurchased,
  checkFutureDate,
} from "../helper/box-helper";
import { saveAndRetrieveFileUrl } from "../helper/storage-helper";
import { boxConverter } from "../helper/box-converter";
import { mapFileHelper } from "../mapper/file-mapper";

const handleBoxRewind = async (rewindSchema: RewindSchema) => {
  try {
    const box: Box = mapBoxRewind(rewindSchema);

    // Check if temporal slot is free
    const isAlreadyPurchased = await checkBoxAlreadyPurchased(
      box.dates.startDate,
      box.dates.endDate
    );

    if (isAlreadyPurchased) {
      throw new Error("Temporal slot already purchased!");
    }

    // Only if file has been selected in input!
    if (rewindSchema.file) {
      const fileHelper: FileHelper = mapFileHelper(rewindSchema.file);

      await saveAndRetrieveFileUrl(fileHelper, box.user.sender);
    }

    const futureDates = box.dates.futureDates;

    if (futureDates) {
      futureDates.forEach(async (date) => {
        const isDateAlreadyTaken = await checkFutureDate(date);

        if (isDateAlreadyTaken) {
          throw new Error(`Future date ${date} not available!`);
        }
      });
    }

    const docRef = await collBoxes.add(box);
    const createdBox = await docRef.get();

    return createdBox;
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message);
  }
};

const handleBoxFuture = async (futureSchema: FutureSchema) => {
  try {
    const box: Box = mapBoxFuture(futureSchema);

    const isAlreadyPurchased = await checkBoxAlreadyPurchased(
      box.dates.startDate,
      box.dates.endDate
    );

    if (isAlreadyPurchased) {
      throw new Error("Temporal slot already purchased!");
    }

    const docRef = await collBoxes.add(box);
    const createdBox = await docRef.get();

    return createdBox;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const handleBoxSocial = async (socialSchema: SocialSchema) => {
  try {
    const box: Box = mapBoxSocial(socialSchema);

    const isAlreadyPurchased = await checkBoxAlreadyPurchased(
      box.dates.startDate,
      box.dates.endDate
    );

    if (isAlreadyPurchased) {
      throw new Error("Temporal slot already purchased!");
    }

    const docRef = await collBoxes.add(box);
    const createdBox = await docRef.get();

    return createdBox;
  } catch (error) {
    console.error(error);
    return null;
  }
};

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
