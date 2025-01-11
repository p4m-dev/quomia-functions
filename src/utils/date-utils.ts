import { Timestamp } from "firebase-admin/firestore";
import moment, { Moment } from "moment";

const DATE_FORMAT = "DD/MM/YYYY HH:mm";

const parseDate = (dateStr: string) => {
  return moment(dateStr, DATE_FORMAT).toDate();
};

const parseMomentDate = (dateStr: string) => {
  return moment(dateStr, DATE_FORMAT, true);
};

const getDeliveryDate = (startDate: string): Moment => {
  const startMoment = moment(startDate, DATE_FORMAT);
  const currentDate = moment();
  const currentYear = currentDate.year();
  const futureDate = startMoment.year(currentYear);

  if (futureDate.isBefore(currentDate)) {
    futureDate.year(currentYear + 1);
  }
  return futureDate;
};

const formatDBDate = (timestamp: Timestamp): Date => {
  if (timestamp) {
    const date = timestamp.toDate();
    return moment(date).toDate();
  }
  return moment().toDate();
};

export { parseDate, getDeliveryDate, parseMomentDate, formatDBDate };
