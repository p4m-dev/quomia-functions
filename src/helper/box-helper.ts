import { collBoxes } from "../config/config";

const checkFutureDate = async (date: Date) => {
  const snapshot = await collBoxes
    .where("type", "==", "rewind")
    .where("dates.futureDates", "array-contains", date)
    .get();

  return !snapshot.empty;
};

export { checkFutureDate };
