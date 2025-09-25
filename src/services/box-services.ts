import { collBoxes } from "../config/config";
import { mapBox } from "../mapper/box-mapper";
import {
  Box,
  BoxResponseWithNFT,
  BoxResponseDB,
  BoxSchema,
} from "../models/types";
import { boxConverter } from "../converter/box-converter";
import {
  checkTimeSlotAvailability,
  retrieveNFT,
  saveNFT,
} from "./crypto-services";
import { mapNFTFromDB } from "../mapper/nft-mapper";

const handleBox = async (boxSchema: BoxSchema) => {
  const box: Box = mapBox(boxSchema);
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
const retrieveBoxes = async (): Promise<BoxResponseWithNFT[]> => {
  try {
    const boxes: BoxResponseWithNFT[] = [];

    const snapshot = await collBoxes
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

export { handleBox, retrieveBoxes };
