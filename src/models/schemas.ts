import { z } from "zod";
import { Category, FileType, Type } from "./types";
import { parseMomentDate } from "../utils/date-utils";

export const fileSchema = z
  .object({
    name: z.string(),
    content: z.string().base64(),
    fileType: z.enum([
      FileType.IMAGE,
      FileType.VIDEO,
      FileType.AUDIO,
      FileType.TEXT,
    ]),
  })
  .nullish()
  .transform((val) => val ?? undefined);

const baseBoxSchema = z
  .object({
    sender: z.string().min(1, "Sender is required"),
    title: z.string().min(1, "Title is required"),
    type: z.enum([Type.FUTURE, Type.REWIND, Type.SOCIAL]),
    category: z.enum([Category.INTERACTIVE, Category.TEXT]),
    message: z
      .string()
      .nullish()
      .transform((val) => val ?? undefined),
    file: fileSchema,
    isAnonymous: z
      .boolean()
      .nullish()
      .transform((val) => val ?? undefined),
  })
  .refine((data) => !(data.message && data.file), {
    message: "Either message or file can be present, not both",
    path: ["message", "file"],
  });

const receiverSchema = z.string();

const rewindDatesSchema = z.object({
  dates: z.object({
    range: z
      .object({
        start: z.string(),
        end: z.string(),
      })
      .refine(
        (range) => {
          const startDate = parseMomentDate(range.start);
          const endDate = parseMomentDate(range.end);
          return (
            startDate.isValid() &&
            endDate.isValid() &&
            endDate.isAfter(startDate)
          );
        },
        {
          message: "End date must be after start date",
          path: ["end"],
        }
      ),
    future: z.array(z.string()),
  }),
});

const futureDatesSchema = z.object({
  dates: z.object({
    range: z
      .object({
        start: z.string(),
        end: z.string(),
      })
      .refine(
        (range) => {
          const startDate = parseMomentDate(range.start);
          const endDate = parseMomentDate(range.end);
          return (
            startDate.isValid() &&
            endDate.isValid() &&
            endDate.isAfter(startDate)
          );
        },
        {
          message: "End date must be after start date",
          path: ["end"],
        }
      ),
    deliveryDate: z.string(),
  }),
});

const socialDatesSchema = z.object({
  dates: z.object({
    range: z
      .object({
        start: z.string(),
        end: z.string(),
      })
      .refine(
        (range) => {
          const startDate = parseMomentDate(range.start);
          const endDate = parseMomentDate(range.end);
          return (
            startDate.isValid() &&
            endDate.isValid() &&
            endDate.isAfter(startDate)
          );
        },
        {
          message: "End date must be after start date",
          path: ["end"],
        }
      ),
  }),
});

const boxRewindSchema = baseBoxSchema
  .and(rewindDatesSchema.merge(z.object({ receiver: receiverSchema })))
  .refine((data) => data.type === Type.REWIND, {
    message: "Type must be REWIND for boxRewindSchema",
    path: ["type"],
  });

const boxFutureSchema = baseBoxSchema
  .and(futureDatesSchema.merge(z.object({ receiver: receiverSchema })))
  .refine((data) => data.type === Type.FUTURE, {
    message: "Type must be FUTURE for boxFutureSchema",
    path: ["type"],
  });

const boxSocialSchema = baseBoxSchema
  .and(socialDatesSchema)
  .refine((data) => data.type === Type.SOCIAL, {
    message: "Type must be SOCIAL for boxSocialSchema",
    path: ["type"],
  });

export { boxRewindSchema, boxFutureSchema, boxSocialSchema };
