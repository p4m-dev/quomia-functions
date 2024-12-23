import { Timestamp } from "firebase-admin/firestore";
import { collBoxes } from "../config";
import { getDeliveryDate } from "../date-utils";

const checkBoxAlreadyPurchased = async (queryStartDate: Date, queryEndDate: Date) => {
    const docs = await collBoxes
        .where("startDate", "<=", queryStartDate)
        .where("endDate", ">=", queryEndDate)
        .get();

    return !docs.empty;
}

const isDateAvailable = async (dateMoment: moment.Moment): Promise<boolean> => {
    const dateTimestamp = Timestamp.fromDate(dateMoment.toDate());
    const docs = await collBoxes.where("deliveryDate", "==", dateTimestamp).get();
    return docs.empty;
}

const generateDeliveryDate = async (startDate: string, type: string): Promise<Date> => {
    const deliveryDate = getDeliveryDate(startDate);
    const isAvailable = await isDateAvailable(deliveryDate);
    return type === 'rewind' && isAvailable ? deliveryDate.toDate() : new Date();
};

export {
    checkBoxAlreadyPurchased,
    generateDeliveryDate
}