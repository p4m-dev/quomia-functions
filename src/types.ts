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
  sender: string;
  receiver?: string;
  message?: string;
  type: Type;
  category: Category;
  startDate: Date;
  endDate: Date;
  deliveryDate: Date;
  filePath?: string;
  isAnonymous?: boolean;
  accessCode: string;
  createdAt?: FirebaseFirestore.FieldValue;
  updatedAt?: FirebaseFirestore.FieldValue;
}