import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

initializeApp();

const db = getFirestore();

db.settings({
  ignoreUndefinedProperties: true,
});

const bucket = getStorage().bucket();
const collBoxes = db.collection("boxes");
const collTimers = db.collection("timers");

export { db, collBoxes, collTimers, bucket };
