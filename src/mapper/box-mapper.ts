import { FieldValue } from "firebase-admin/firestore";
import { generateAccessCode } from "../utils/box-utils";
import { parseDate } from "../utils/date-utils";
import { Box, BoxSchema, FileSchema, Content, FileType } from "../models/types";

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

const mapBox = (boxSchema: BoxSchema): Box => {
  return {
    info: {
      title: boxSchema.title,
      category: boxSchema.category,
      accessCode: generateAccessCode(),
      likes: 0,
      comments: {
        totalOfComments: 0,
        timerComments: [],
      },
    },
    location: {
      longitude: boxSchema.location.longitude,
      latitude: boxSchema.location.latitude,
      street: boxSchema.location.street,
    },
    content: mapContent(boxSchema.file, boxSchema.message),
    dates: {
      startDate: parseDate(boxSchema.dates.range.start),
      endDate: parseDate(boxSchema.dates.range.end),
    },
    user: {
      sender: boxSchema.sender,
      location: "Sciacca, Italia",
    },
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };
};

export { mapBox };
