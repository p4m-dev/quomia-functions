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

const checkFutureDate = async (date: Date) => {
  const snapshot = await collBoxes
    .where("type", "==", "rewind")
    .where("dates.futureDates", "array-contains", date)
    .get();

  return !snapshot.empty;
};

export { checkBoxAlreadyPurchased, checkFutureDate };
