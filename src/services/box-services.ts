import { collBoxes } from "../config/config";
import { mapBoxFuture, mapBoxRewind, mapBoxSocial } from "../mapper/box-mapper";
import { Box, FutureSchema, RewindSchema, SocialSchema } from "../models/types";
import { checkBoxAlreadyPurchased } from "../helper/box-helper";

const handleBoxRewind = async (rewindSchema: RewindSchema) => {
  try {
    const box: Box = mapBoxRewind(rewindSchema);

    const alreadyPurchased = await checkBoxAlreadyPurchased(
      box.dates.startDate,
      box.dates.endDate
    );

    if (alreadyPurchased) {
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

const handleBoxFuture = async (futureSchema: FutureSchema) => {
  try {
    const box: Box = mapBoxFuture(futureSchema);

    const alreadyPurchased = await checkBoxAlreadyPurchased(
      box.dates.startDate,
      box.dates.endDate
    );

    if (alreadyPurchased) {
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

    const alreadyPurchased = await checkBoxAlreadyPurchased(
      box.dates.startDate,
      box.dates.endDate
    );

    if (alreadyPurchased) {
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

const retrieveSocialBoxes = async () => {
  try {
    const boxes: Box[] = [];
    const snapshot = await collBoxes
      .where("info.type", "==", "social")
      .orderBy("createdAt", "desc")
      .get();

    snapshot.forEach((doc) => {
      boxes.push({ ...(doc.data() as Box) });
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
