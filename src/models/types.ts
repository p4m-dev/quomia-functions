import { z } from "zod";
import {
  boxFutureSchema,
  boxRewindSchema,
  boxSocialSchema,
  fileSchema,
} from "./schemas";
import { NFT } from "./nft";

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

export enum FileType {
  IMAGE = "image",
  AUDIO = "audio",
  VIDEO = "video",
  TEXT = "text",
}

export interface TimerComment {
  username: string;
  message: string;
  createdAt: Date;
}

export interface Comments {
  totalOfComments: number;
  timerComments: TimerComment[];
}

export interface Info {
  title: string;
  type: Type;
  category: Category;
  isAnonymous?: boolean;
  accessCode: string;
  likes?: number;
  comments?: Comments;
}

export interface Content {
  message?: string;
  fileType?: FileType;
  downloadUrl?: string;
  imageBlurhash?: string;
  videoThumbnailUrl?: string;
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
  location: string;
}

export interface Box {
  info: Info;
  content: Content;
  dates: Dates;
  user: User;
  createdAt?: FirebaseFirestore.FieldValue;
  updatedAt?: FirebaseFirestore.FieldValue;
}

export interface BoxDB {
  boxId: string;
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

export interface BoxResponseDB {
  boxId: string;
  info: Info;
  content: Content;
  dates: Dates;
  user: User;
}

export interface BoxResponseWithNFT {
  info: Info;
  content: Content;
  dates: Dates;
  user: User;
  nft: NFT;
}

type RewindSchema = z.infer<typeof boxRewindSchema>;

type FutureSchema = z.infer<typeof boxFutureSchema>;

type SocialSchema = z.infer<typeof boxSocialSchema>;

type FileSchema = z.infer<typeof fileSchema>;

export { RewindSchema, FutureSchema, SocialSchema, FileSchema };
