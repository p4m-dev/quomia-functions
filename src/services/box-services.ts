import { Timestamp } from "firebase-admin/firestore";
import { collBoxes } from "../config";
import { getDeliveryDate } from "../date-utils";

const checkBoxAlreadyPurchased = async (queryStartDate: Date, queryEndDate: Date) => {
    const docs = await collBoxes
        .where("dates.startDate", "<=", queryStartDate)
        .where("dates.endDate", ">=", queryEndDate)
        .get();

    return !docs.empty;
}

const isDateAvailable = async (dateMoment: moment.Moment): Promise<boolean> => {
    const dateTimestamp = Timestamp.fromDate(dateMoment.toDate());
    const docs = await collBoxes.where("dates.deliveryDate", "==", dateTimestamp).get();
    return docs.empty;
}

const generateDeliveryDate = async (startDate: string, type: string): Promise<Date> => {
    const deliveryDate = getDeliveryDate(startDate);
    const isAvailable = await isDateAvailable(deliveryDate);

    if (type === 'rewind' && isAvailable) {
        return deliveryDate.toDate();
    }
    throw new Error('Delivery date cannot be generated! Temporal slot not available!');
};

export {
    checkBoxAlreadyPurchased,
    generateDeliveryDate
}