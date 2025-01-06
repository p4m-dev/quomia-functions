import { z } from "zod";
import { Category, Type } from "./types";
import moment from "moment";

const byteSchema = z.number().int().min(0).max(255);

const uint8ArraySchema = z.array(byteSchema);

export const fileSchema = z
  .object({
    name: z.string(),
    content: uint8ArraySchema,
  })
  .optional();

const baseBoxSchema = z.object({
  sender: z.string().min(1, "Sender is required"),
  title: z.string().min(1, "Title is required"),
  type: z.enum([Type.FUTURE, Type.REWIND, Type.SOCIAL]),
  category: z.enum([Category.INTERACTIVE, Category.TEXT]),
  message: z.string().optional(),
  file: fileSchema,
  isAnonymous: z.boolean().optional(),
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
          const startDate = moment(range.start, "DD/MM/YYYY HH:mm", true);
          const endDate = moment(range.end, "DD/MM/YYYY HH:mm", true);
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

const boxRewindSchema = baseBoxSchema.merge(
  rewindDatesSchema.merge(z.object({ receiver: receiverSchema }))
);

const boxFutureSchema = baseBoxSchema.merge(
  futureDatesSchema.merge(z.object({ receiver: receiverSchema }))
);

const boxSocialSchema = baseBoxSchema.merge(socialDatesSchema);

export { boxRewindSchema, boxFutureSchema, boxSocialSchema };
