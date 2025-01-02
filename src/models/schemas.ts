import { z } from "zod";
import { Category, Type } from "./types";

const baseBoxSchema = z.object({
  sender: z.string().min(1, "Sender is required"),
  title: z.string().min(1, "Title is required"),
  type: z.enum([Type.FUTURE, Type.REWIND, Type.SOCIAL]),
  category: z.enum([Category.INTERACTIVE, Category.TEXT]),
  message: z.string().optional(),
  filePath: z.string().optional(),
  isAnonymous: z.boolean().optional(),
});

const receiverSchema = z.string();

const rewindDatesSchema = z.object({
  dates: z.object({
    range: z.object({
      start: z.string(),
      end: z.string(),
    }),
    future: z.array(z.string()),
  }),
});

const futureDatesSchema = z.object({
  dates: z.object({
    range: z.object({
      start: z.string(),
      end: z.string(),
    }),
    deliveryDate: z.string(),
  }),
});

const socialDatesSchema = z.object({
  dates: z.object({
    range: z.object({
      start: z.string(),
      end: z.string(),
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
