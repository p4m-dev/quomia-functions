export enum Category {
  INTERACTIVE,
  TEXT
}

export enum Type {
  FUTURE,
  REWIND,
  MESSAGE_IN_A_BOTTLE
}

export interface Box {
  title: string;
  user?: string;
  message?: string;
  type: Type;
  category: Category;
  startDate: Date;
  endDate: Date;
  filePath?: string;
  isAnonymous?: boolean;
  createdAt?: FirebaseFirestore.FieldValue;
  updatedAt?: FirebaseFirestore.FieldValue;
}