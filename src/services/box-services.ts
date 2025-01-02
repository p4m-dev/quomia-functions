import { collBoxes } from "../config";
import { mapBoxRewind } from "../mapper/box-mapper";
import { Box, RewindSchema } from "../models/types";
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

export { handleBoxRewind };

// const generateDeliveryDate = async (
//   startDate: string,
//   type: string
// ): Promise<Date> => {
//   const deliveryDate = getDeliveryDate(startDate);
//   const isAvailable = await isDateAvailable(deliveryDate);

//   if (type === "rewind" && isAvailable) {
//     return deliveryDate.toDate();
//   }
//   throw new Error(
//     "Delivery date cannot be generated! Temporal slot not available!"
//   );
// };
