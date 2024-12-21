import * as express from "express";
import * as admin from "firebase-admin";
import { onRequest } from "firebase-functions/v2/https";
import { Box } from "./types";

admin.initializeApp();
const db = admin.firestore();
const app = express();

app.use(express.json());

// Create Box
app.post('/box', async (req, res) => {
    try {
        const { title, message } = req.body;
    
        // Validazione dei dati
        if (!title || !message) {
          return res.status(400).json({ error: "Name and expiration are required" });
        }
    
        const box: Box = {
            title,
            message,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        };
    
        const docRef = await db.collection("boxes").add(box);
        return res.status(201).json({ id: docRef.id, ...box });
      } catch (error) {
        console.error("Error creating box:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
});

app.get('/box', async (req, res) => {

});

exports.boxes = onRequest(app);