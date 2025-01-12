import { FirestoreDataConverter } from "firebase-admin/firestore";
import { Box, BoxResponse } from "../models/types";
import { formatDBDate } from "../utils/date-utils";

export const boxConverter: FirestoreDataConverter<Box> = {
  toFirestore(box: Box) {
    return {
      ...box,
    };
  },
  fromFirestore(snapshot) {
    const data = snapshot.data();

    const box = {
      ...data,
      dates: {
        startDate: formatDBDate(data.dates.startDate),
        endDate: formatDBDate(data.dates.endDate),
        deliveryDate: formatDBDate(data.dates.deliveryDate),
      },
    } as BoxResponse;
    console.log(box);
    return box;
  },
};
