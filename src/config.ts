import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { Credentials } from "./credentials";
import serviceAccountKey from "./res/serviceAccountKey.json";

const credentials: Credentials = {
  projectId: serviceAccountKey.project_id,
  clientEmail: serviceAccountKey.client_email,
  privateKey: serviceAccountKey.private_key,
};

initializeApp({
  credential: cert({
    projectId: credentials.projectId,
    clientEmail: credentials.clientEmail,
    privateKey: credentials.privateKey
  })
});

const db = getFirestore();
const collBoxes = db.collection('boxes');

export {
    db,
    collBoxes
}