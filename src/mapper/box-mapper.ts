import { FieldValue } from "firebase-admin/firestore";
import { generateAccessCode } from "../utils/box-utils";
import { parseDate } from "../utils/date-utils";
import {
  Box,
  FutureSchema,
  RewindSchema,
  SocialSchema,
  FileSchema,
  Content,
  FileType,
} from "../models/types";

const mapContent = (fileSchema: FileSchema, message?: string): Content => {
  if (fileSchema) {
    return {
      message,
      fileType: fileSchema.fileType,
      downloadUrl: fileSchema.downloadUrl,
      imageBlurhash: fileSchema.imageBlurhash,
      videoThumbnailUrl: fileSchema.videoThumbnailUrl,
    };
  }
  return {
    message,
    fileType: FileType.TEXT,
  };
};

const mapBoxRewind = (rewindSchema: RewindSchema): Box => {
  return {
    info: {
      title: rewindSchema.title,
      type: rewindSchema.type,
      category: rewindSchema.category,
      isAnonymous: rewindSchema.isAnonymous ?? false,
      accessCode: generateAccessCode(),
    },
    content: mapContent(rewindSchema.file, rewindSchema.message),
    dates: {
      startDate: parseDate(rewindSchema.dates.range.start),
      endDate: parseDate(rewindSchema.dates.range.end),
      futureDates: rewindSchema.dates.future.map((date) => parseDate(date)),
    },
    user: {
      sender: rewindSchema.sender,
      receiver: rewindSchema.receiver ?? "",
      location: "Sciacca, Italia",
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
    content: mapContent(futureSchema.file, futureSchema.message),
    dates: {
      startDate: parseDate(futureSchema.dates.range.start),
      endDate: parseDate(futureSchema.dates.range.end),
      deliveryDate: parseDate(futureSchema.dates.deliveryDate),
    },
    user: {
      sender: futureSchema.sender,
      receiver: futureSchema.receiver ?? "",
      location: "Sciacca, Italia",
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
      likes: 0,
      comments: {
        totalOfComments: 0,
        timerComments: [],
      },
    },
    content: mapContent(socialSchema.file, socialSchema.message),
    dates: {
      startDate: parseDate(socialSchema.dates.range.start),
      endDate: parseDate(socialSchema.dates.range.end),
    },
    user: {
      sender: socialSchema.sender,
      location: "Sciacca, Italia",
    },
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };
};

export { mapBoxRewind, mapBoxFuture, mapBoxSocial };
