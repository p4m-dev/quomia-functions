import { FirestoreDataConverter } from "firebase-admin/firestore";
import { BoxDB, BoxResponseDB } from "../models/types";
import { formatDBDate } from "../utils/date-utils";

export const boxConverter: FirestoreDataConverter<BoxDB> = {
  toFirestore(box: BoxDB) {
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
    } as BoxResponseDB;
    console.log(box);
    return box;
  },
};
