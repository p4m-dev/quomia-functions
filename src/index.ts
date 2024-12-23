import { onRequest } from "firebase-functions/v2/https";
import { Box, Category, Type } from "./types";
import { cert, initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { Credentials } from "./credentials";
import express, { Request, Response } from 'express';
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

const app = express();
app.use(express.json());

const checkCategory = (category: Category): void => {
  if (![Category.INTERACTIVE, Category.TEXT].includes(category)) {
    throw new Error('Categoria non valida');
  }
};

const checkType = (type: Type): void => {
  if (![Type.FUTURE, Type.REWIND, Type.MESSAGE_IN_A_BOTTLE].includes(type)) {
    throw new Error('Tipo non valido');
  }
};

app.post("/box", async (req: Request, res: Response) => {
  try {
    const { title, type, startDate, endDate, category, message, filePath, user } = req.body;

    if (!title || !type || !startDate || !endDate || !category) {
      return res.status(400).json({ error: "Campi obbligatori mancanti" });
    }

    // Validazione di categoria e tipo
    checkCategory(category);
    checkType(type);

    const box: Box = {
      title,
      type,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      category,
      message: message ?? '',
      filePath: filePath ?? '',
      user: user ?? '',
      createdAt: FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection("boxes").add(box);
    const createdBox = await docRef.get();

    return res.status(201).json({ id: docRef.id, ...createdBox.data() });
  } catch (error: any) {
    console.error("Errore nella creazione della box:", error);
    if (error.message === 'Categoria non valida' || error.message === 'Tipo non valido') {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: "Errore interno del server" });
  }
});

app.get("/box", async (req: Request, res: Response) => {
  try {
    const viralBoxes: Box[] = [];
    const snapshot = await db.collection("boxes")
      .where("type", "==", Type.MESSAGE_IN_A_BOTTLE)
      .orderBy('createdAt', 'desc')
      .get();

    snapshot.forEach(doc => {
      viralBoxes.push({ ...(doc.data() as Box) });
    });

    return res.status(200).json({ viralBoxes });
  } catch (error) {
    console.error("Errore nel recupero delle boxes:", error);
    return res.status(500).json({ error: "Errore interno del server" });
  }
});

export const api = onRequest({ region: 'europe-west3' }, app);
