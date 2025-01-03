import { Timestamp } from "firebase-admin/firestore";
import { collBoxes } from "../config/config";

const checkBoxAlreadyPurchased = async (
  queryStartDate: Date,
  queryEndDate: Date
) => {
  const docs = await collBoxes
    .where("dates.startDate", "<=", queryStartDate)
    .where("dates.endDate", ">=", queryEndDate)
    .get();

  return !docs.empty;
};

const isDateAvailable = async (dateMoment: moment.Moment): Promise<boolean> => {
  const dateTimestamp = Timestamp.fromDate(dateMoment.toDate());
  const docs = await collBoxes
    .where("dates.deliveryDate", "==", dateTimestamp)
    .get();
  return docs.empty;
};

export { checkBoxAlreadyPurchased };
