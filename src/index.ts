import { onRequest } from "firebase-functions/v2/https";
import { Box } from "./types";
import { parseDate } from "./date-utils";
import { checkBoxAlreadyPurchased, generateDeliveryDate } from "./services/box-services";
import { FieldValue } from "firebase-admin/firestore";
import { collBoxes } from "./config";
import express, { Request, Response } from 'express';
import { generateAccessCode } from "./box-utils";
import { Timer } from "./models/timer";

const app = express();
app.use(express.json());

/*const checkCategory = (category: Category): void => {
  if (![Category.INTERACTIVE, Category.TEXT].includes(category)) {
    throw new Error('Categoria non valida');
  }
};

const checkType = (type: Type): void => {
  if (![Type.FUTURE, Type.REWIND, Type.MESSAGE_IN_A_BOTTLE].includes(type)) {
    throw new Error('Tipo non valido');
  }
};*/

app.post("/box", async (req: Request, res: Response) => {
  try {
    const { title, type, startDate, endDate, category, message, 
      filePath, sender, receiver, isAnonymous } = req.body;

    if (!title || !type || !startDate || !endDate || !category || !sender) {
      return res.status(400).json({ error: "Campi obbligatori mancanti" });
    }

    console.log(category, type);

    //checkCategory(category);
    //checkType(type);

    const parsedStartDate = parseDate(startDate);
    const parsedEndDate = parseDate(endDate);

    // Skip on rewind
    if (type !== 'rewind') { 
      const check = await checkBoxAlreadyPurchased(parsedStartDate, parsedEndDate);

      if (check) {
        return res.status(409).json({ error: "Box temporale non disponibile!" });
      }
    }

    const deliveryDate = await generateDeliveryDate(startDate, type);

    const box: Box = {
      info: {
        title,
        type,
        category,
        isAnonymous: isAnonymous ?? false,
        accessCode: generateAccessCode()
      },
      content: {
        message: message ?? null,
        filePath: filePath ?? null,
      },
      dates: {
        startDate: parsedStartDate,
        endDate: parsedEndDate,
        deliveryDate: deliveryDate,
        createdAt: FieldValue.serverTimestamp(),
      },
      user: {
        sender: sender,
        receiver: receiver ?? null,
      }
    }

    const docRef = await collBoxes.add(box);
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
    const boxes: Box[] = [];
    const snapshot = await collBoxes
      .where("info.type", "==", 'social')
      .orderBy('createdAt', 'desc')
      .get();

    snapshot.forEach(doc => {
      boxes.push({ ...(doc.data() as Box) });
    });

    return res.status(200).json({ boxes });
  } catch (error) {
    console.error("Errore nel recupero delle boxes:", error);
    return res.status(500).json({ error: "Errore interno del server" });
  }
});

app.get("/timers", async (req: Request, res: Response) => {
  try {
    const boxes: Timer[] = [];
    const snapshot = await collBoxes
      .orderBy('createdAt', 'desc')
      .get();

    snapshot.forEach(doc => {
      boxes.push({ ...(doc.data() as Timer) });
    });

    return res.status(200).json({ boxes });
  } catch (error) {
    console.error("Error while retrieving timers:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export const api = onRequest({ region: 'europe-west3' }, app);
