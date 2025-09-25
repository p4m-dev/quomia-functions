import { z } from "zod";
import { boxSchema, fileSchema } from "./schemas";
import { NFT } from "./nft";

export enum Category {
  INTERACTIVE = "interactive",
  TEXT = "text",
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
  category: Category;
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
}

export interface User {
  sender: string;
  receiver?: string;
  location: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  street: string;
}

export interface Box {
  info: Info;
  content: Content;
  dates: Dates;
  user: User;
  location: Location;
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

type BoxSchema = z.infer<typeof boxSchema>;

type FileSchema = z.infer<typeof fileSchema>;

export { BoxSchema, FileSchema };
