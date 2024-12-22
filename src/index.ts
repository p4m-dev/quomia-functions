import * as express from "express";
import * as admin from "firebase-admin";
import { onRequest } from "firebase-functions/v2/https";
import { Box } from "./types";

admin.initializeApp();
const db = admin.firestore();
const app = express();

app.use(express.json());

console.log("Current Firebase Project:", admin.app().options.projectId);

// Create Box
app.post('/box', async (req, res) => {
    try {
        const { title, type, date, time, category } = req.body;
    
        /*if (!title || !message) {
          return res.status(400).json({ error: "Name and expiration are required" });
        }*/
    
        const box: Box = {
            title: title,
            type: type,
            date: date,
            time: time,
            category: category
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

exports.api = onRequest(app);