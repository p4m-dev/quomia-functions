export interface Box {
    title: string;
    user?: string;
    message?: string;
    type: string;
    category: string;
    date: string;
    time: string;
    filePath?: string;
    isAnonymous?: boolean;
    createdAt?: FirebaseFirestore.FieldValue;
    updatedAt?: FirebaseFirestore.FieldValue;
}