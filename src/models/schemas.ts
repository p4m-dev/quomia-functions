import { z } from "zod";
import { Category, FileType } from "./types";
import { parseMomentDate } from "../utils/date-utils";

export const fileSchema = z
  .object({
    downloadUrl: z.string().url(),
    fileType: z.nativeEnum(FileType),
    imageBlurhash: z
      .string()
      .nullish()
      .transform((val) => val ?? undefined),
    videoThumbnailUrl: z
      .string()
      .url()
      .nullish()
      .transform((val) => val ?? undefined),
  })
  .nullish()
  .transform((val) => val ?? undefined);

const baseBoxSchema = z
  .object({
    sender: z.string().min(1, "Sender is required"),
    title: z.string().min(1, "Title is required"),
    category: z.nativeEnum(Category),
    location: z.object({
      latitude: z.number(),
      longitude: z.number(),
      street: z.string(),
    }),
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

const datesSchema = z.object({
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

const boxSchema = baseBoxSchema.and(datesSchema);

export { boxSchema };
