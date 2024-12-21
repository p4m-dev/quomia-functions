import * as admin from "firebase-admin";

export interface Box {
    title: string;
    message: string;
    createdAt?: FirebaseFirestore.FieldValue;
}