import { Router } from "express";
import { collBoxes } from "../config";
import { parseDate } from "../date-utils";
import {
  checkBoxAlreadyPurchased,
  generateDeliveryDate,
} from "../services/box-services";
import { generateAccessCode } from "../box-utils";
import { FieldValue } from "firebase-admin/firestore";
import { Box } from "../types";

const boxRouter = Router();

boxRouter.post("/", async (req, res) => {
  try {
    const {
      title,
      type,
      startDate,
      endDate,
      category,
      message,
      filePath,
      sender,
      receiver,
      isAnonymous,
    } = req.body;

    if (!title || !type || !startDate || !endDate || !category || !sender) {
      return res.status(400).json({ error: "Campi obbligatori mancanti" });
    }

    const parsedStartDate = parseDate(startDate);
    const parsedEndDate = parseDate(endDate);

    if (type !== "rewind") {
      const check = await checkBoxAlreadyPurchased(
        parsedStartDate,
        parsedEndDate
      );

      if (check) {
        return res.status(409).json({ error: "Temporal slot not available!" });
      }
    }

    const deliveryDate = await generateDeliveryDate(startDate, type);

    const box: Box = {
      info: {
        title,
        type,
        category,
        isAnonymous: isAnonymous ?? false,
        accessCode: generateAccessCode(),
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
      },
    };

    const docRef = await collBoxes.add(box);
    const createdBox = await docRef.get();

    return res.status(201).json({ id: docRef.id, ...createdBox.data() });
  } catch (error: any) {
    console.error("Errore nella creazione della box:", error);
    return res.status(500).json({ error: "Errore interno del server" });
  }
});

boxRouter.get("/", async (req, res) => {
  try {
    const boxes: Box[] = [];
    const snapshot = await collBoxes
      .where("info.type", "==", "social")
      .orderBy("createdAt", "desc")
      .get();

    snapshot.forEach((doc) => {
      boxes.push({ ...(doc.data() as Box) });
    });

    return res.status(200).json({ boxes });
  } catch (error) {
    console.error("Errore nel recupero delle boxes:", error);
    return res.status(500).json({ error: "Errore interno del server" });
  }
});

export default boxRouter;
