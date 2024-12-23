import moment, { Moment } from "moment";

const DATE_FORMAT: string = "DD/MM/YYYY HH:mm";

const parseDate = (dateStr: string) => {
    return moment(dateStr, DATE_FORMAT).toDate();
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
}

export {
    parseDate,
    getDeliveryDate
}