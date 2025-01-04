import { FieldValue } from "firebase-admin/firestore";
import { generateAccessCode } from "../utils/box-utils";
import { parseDate } from "../utils/date-utils";
import {
  Box,
  FutureSchema,
  RewindSchema,
  SocialSchema,
  BoxResponse,
} from "../models/types";

const mapBoxRewind = (rewindSchema: RewindSchema): Box => {
  return {
    info: {
      title: rewindSchema.title,
      type: rewindSchema.type,
      category: rewindSchema.category,
      isAnonymous: rewindSchema.isAnonymous ?? false,
      accessCode: generateAccessCode(),
    },
    content: {
      message: rewindSchema.message ?? "",
      filePath: rewindSchema.filePath ?? "",
    },
    dates: {
      startDate: parseDate(rewindSchema.dates.range.start),
      endDate: parseDate(rewindSchema.dates.range.end),
      futureDates: rewindSchema.dates.future.map((date) => parseDate(date)),
    },
    user: {
      sender: rewindSchema.sender,
      receiver: rewindSchema.receiver ?? "",
    },
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };
};

const mapBoxFuture = (futureSchema: FutureSchema): Box => {
  return {
    info: {
      title: futureSchema.title,
      type: futureSchema.type,
      category: futureSchema.category,
      isAnonymous: futureSchema.isAnonymous ?? false,
      accessCode: generateAccessCode(),
    },
    content: {
      message: futureSchema.message ?? "",
      filePath: futureSchema.filePath ?? "",
    },
    dates: {
      startDate: parseDate(futureSchema.dates.range.start),
      endDate: parseDate(futureSchema.dates.range.end),
      deliveryDate: parseDate(futureSchema.dates.deliveryDate),
    },
    user: {
      sender: futureSchema.sender,
      receiver: futureSchema.receiver ?? "",
    },
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };
};

const mapBoxSocial = (socialSchema: SocialSchema): Box => {
  return {
    info: {
      title: socialSchema.title,
      type: socialSchema.type,
      category: socialSchema.category,
      isAnonymous: socialSchema.isAnonymous ?? false,
      accessCode: generateAccessCode(),
    },
    content: {
      message: socialSchema.message ?? "",
      filePath: socialSchema.filePath ?? "",
    },
    dates: {
      startDate: parseDate(socialSchema.dates.range.start),
      endDate: parseDate(socialSchema.dates.range.end),
    },
    user: {
      sender: socialSchema.sender,
    },
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };
};

const mapBoxFromDB = (box: Box): BoxResponse => {
  return {
    info: {
      title: box.info.title,
      type: box.info.type,
      category: box.info.category,
      isAnonymous: box.info.isAnonymous,
      accessCode: box.info.accessCode,
    },
    content: {
      message: box.content.message,
      filePath: box.content.filePath,
    },
    dates: {
      startDate: box.dates.startDate,
      endDate: box.dates.endDate,
      deliveryDate: box.dates.deliveryDate,
      futureDates: box.dates.futureDates,
    },
    user: {
      sender: box.user.sender,
      receiver: box.user.receiver,
    },
  };
};

export { mapBoxRewind, mapBoxFuture, mapBoxSocial, mapBoxFromDB };
