import { z } from "zod";
import {
  boxFutureSchema,
  boxRewindSchema,
  boxSocialSchema,
  fileSchema,
} from "./schemas";

export enum Category {
  INTERACTIVE = "interactive",
  TEXT = "text",
}

export enum Type {
  FUTURE = "future",
  REWIND = "rewind",
  SOCIAL = "social",
}

export enum ContentType {
  JPG = "image",
  PNG = "image",
  WAV = "audio",
  MP4 = "video",
}

export interface Info {
  title: string;
  type: Type;
  category: Category;
  isAnonymous?: boolean;
  accessCode: string;
}

export interface File {
  name: string;
  content: Buffer;
}

export interface Content {
  message: string;
  file?: File;
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

export interface BoxResponse {
  info: Info;
  content: Content;
  dates: Dates;
  user: User;
}

type RewindSchema = z.infer<typeof boxRewindSchema>;

type FutureSchema = z.infer<typeof boxFutureSchema>;

type SocialSchema = z.infer<typeof boxSocialSchema>;

type FileSchema = z.infer<typeof fileSchema>;

export { RewindSchema, FutureSchema, SocialSchema, FileSchema };
