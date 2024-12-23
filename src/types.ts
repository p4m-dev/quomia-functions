export enum Category {
  INTERACTIVE,
  TEXT
}

export enum Type {
  FUTURE,
  REWIND,
  MESSAGE_IN_A_BOTTLE
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
  deliveryDate: Date;
  createdAt?: FirebaseFirestore.FieldValue;
  updatedAt?: FirebaseFirestore.FieldValue;
}

export interface User {
  sender: string;
  receiver?: string;
}

export interface Box {
  info: Info,
  content: Content,
  dates: Dates,
  user: User
}