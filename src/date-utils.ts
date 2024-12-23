import moment, { Moment } from "moment";

const DATE_FORMAT: string = "DD/MM/YYYY HH:mm";

const parseDate = (dateStr: string) => {
    return moment(dateStr, DATE_FORMAT).toDate();
};

const getDeliveryDate = (startDate: string): Moment => {
    const startMoment = moment(startDate, DATE_FORMAT);
    const currentYear = moment().year();
    return startMoment.year(currentYear);
}

export {
    parseDate,
    getDeliveryDate
}