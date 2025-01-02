import { FieldValue } from "firebase-admin/firestore";
import { generateAccessCode } from "../box-utils";
import { parseDate } from "../date-utils";
import { Box, FutureSchema, RewindSchema, SocialSchema } from "../models/types";

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
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    },
    user: {
      sender: rewindSchema.sender,
      receiver: rewindSchema.receiver ?? "",
    },
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
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    },
    user: {
      sender: futureSchema.sender,
      receiver: futureSchema.receiver ?? "",
    },
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
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    },
    user: {
      sender: socialSchema.sender,
    },
  };
};

export { mapBoxRewind, mapBoxFuture, mapBoxSocial };
