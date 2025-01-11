import { z } from "zod";
import { Category, Type } from "./types";
import { parseMomentDate } from "../utils/date-utils";

export const fileSchema = z
  .object({
    name: z.string(),
    content: z.string().base64(),
  })
  .optional();

const baseBoxSchema = z
  .object({
    sender: z.string().min(1, "Sender is required"),
    title: z.string().min(1, "Title is required"),
    type: z.enum([Type.FUTURE, Type.REWIND, Type.SOCIAL]),
    category: z.enum([Category.INTERACTIVE, Category.TEXT]),
    message: z.string().optional(),
    file: fileSchema,
    isAnonymous: z.boolean().optional(),
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
      .refine((range) => new Date(range.end) > new Date(range.start), {
        message: "End date must be after start date",
        path: ["end"],
      }),
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
      .refine((range) => new Date(range.end) > new Date(range.start), {
        message: "End date must be after start date",
        path: ["end"],
      }),
  }),
});

const boxRewindSchema = baseBoxSchema.and(
  rewindDatesSchema.merge(z.object({ receiver: receiverSchema }))
);

const boxFutureSchema = baseBoxSchema.and(
  futureDatesSchema.merge(z.object({ receiver: receiverSchema }))
);

const boxSocialSchema = baseBoxSchema.and(socialDatesSchema);

export { boxRewindSchema, boxFutureSchema, boxSocialSchema };
