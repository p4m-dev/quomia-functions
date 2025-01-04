import { z } from "zod";
import { boxFutureSchema, boxRewindSchema, boxSocialSchema } from "./schemas";

export enum Category {
  INTERACTIVE = "interactive",
  TEXT = "text",
}

export enum Type {
  FUTURE = "future",
  REWIND = "rewind",
  SOCIAL = "social",
}

export interface Info {
  title: string;
  type: Type;
  category: Category;
  isAnonymous?: boolean;
  accessCode: string;
}

export interface Content {
  message?: string;
  filePath?: string;
}

export interface Dates {
  startDate: Date;
  endDate: Date;
  deliveryDate?: Date;
  futureDates?: Date[];
}

export interface User {
  sender: string;
  receiver?: string;
}

export interface Box {
  info: Info;
  content: Content;
  dates: Dates;
  user: User;
  createdAt?: FirebaseFirestore.FieldValue;
  updatedAt?: FirebaseFirestore.FieldValue;
}

type RewindSchema = z.infer<typeof boxRewindSchema>;

type FutureSchema = z.infer<typeof boxFutureSchema>;

type SocialSchema = z.infer<typeof boxSocialSchema>;

export { RewindSchema, FutureSchema, SocialSchema };
