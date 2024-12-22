import * as express from "express";
import * as admin from "firebase-admin";
import { onRequest } from "firebase-functions/v2/https";
import { Box } from "./types";

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: "quomia",
    privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCpIjeplAr0Yd1k\nbkkd7ZRdfUtJMQiR5/X4twY/shqF28OcFkisugnYkcnkjdvkkD0+ivl8A5JWKQTS\nAjGRYnWKuC7KGqhiUX1PGIdR1RyI1GlpzXYI635RA8BfnhBucxfZKO5VqQRb1dLH\nDJl/SWHzk8G4lCiHZmB5dQhWVLTeGAC9Jwexqtim3eQ14VytHG67OkA53FLxF6Io\nt3QDfc47sZbf2pQ7RRFrnDrvL9PnkprVS0+kDsFqgHTKsZYEmI0sVrYw3p5UVVd4\nSsd/yQB0DAI5dYdyiJmNrfYSbNKtyVybmMwUexKrx/hghi6B9R7b5CGn29qm8joA\n+kVRQQxDAgMBAAECggEAALasvnHp8+r/yJ8wfshUUmqnaSkkTJ1Ka+C1zYn+U6dA\nNYXgi54DUZ8X13eDwHydTYi/kbbgJK3qn8ozlFXyggHR7LddE4EdgrprQ7ye8LLY\nuQINZ+86arQV2TFtB1JD/P4Pt1vNsWd/CqjycteH6sOqUxGI9D1J1elY/ihAVRmK\nEatXk0iqqsBGr7hJpRZRM91nJJp6/pQdoZl5dByXzgpgkWRsdLYpbRK5E5eqCzVx\nKS2kMKRtd1K5hCgC4wRnZRZs9bYQjVP5SqQKfE8WtinF23XzERfwasm2YyFVN5+x\nXxA4QvVO3gK+tmg5Sy/6f+PLlvwdMIk//iQKYPkX+QKBgQDUgF+DQ/WXqz592DQi\nwD6TW89f8Yz0sXoUuII26NOsxECxtmpNsY8gvheIHlvUlrIH0nzAniRlh3PfeJKg\nZVL9RW7wjpj+NZMOx7XSF9qrSRZEDz7xy1/ceX/nUbmDWsa/Di1gY5/EqwGadzhy\nUqRkvCX8SbgMByP3aSa+XhDDOwKBgQDLwUJuF2EL0nl/XinhKJ6hVoYugvzgRuuX\n4uqobI9brAvgSHZvJojolyjmXy/+gfX9X5Ns93SsqtupVkMHL+ZHsV8p9oCi/0F6\nlH+L/z15gYrJhZbZM2vafv8juvEFS6/BbHeecsJ31Z5ZJCeWxQ1t3M7UjwWOI1Vo\np4j6NPM6mQKBgAPwiVTGqsPwEc2Fd5n5VG+o8RRHRyS2MZw2u3tHH72BOe3RgvED\nzLJ/s7H7Vhp/3LcWaOetRuF2/Gf1NUqx9jLp2Z+uFRoJZjuM6ksF1DD+vuHuIm2b\nJqDQw9VHB5hu02ZxXdf+oNSlkvcJJMvBynhvoIin2Tin3TvWADjhR5BHAoGABPJJ\nIZERuw6+AliP3bZ1u2b1VPW7G9q853AL0FDqXghcNXKs5V/jHPpmdMlEygHvrdn/\nIzsSqwpu0LqWX/tKtNzaeZNRZiOaPFaUjhqBLIz3iJLkqZs0+BXzLbPhHAbNWn2+\nnasdi3k1Iebdyyw3ej5NCx35vYygCy1eBuz4JqkCgYAJ+4jiSs7PMYGM2FRBkXjF\nA7X41wv/Z7MuKlyOot0Ui3CUwRSFth3czRR+OASlsA8OB3cEtEgWBk9m8HxWVIos\nrW+B/yaDFPAW+4S2WHlxUcSflkqTSvGxJ/SksR9RuxzK12GOjOgCe+G14tCcfCWv\nmwkCPsya9cceISx7zpRQMw==\n-----END PRIVATE KEY-----\n",
    clientEmail: "firebase-adminsdk-y3p89@quomia.iam.gserviceaccount.com",
  })
});

const db = admin.firestore();
const app = express();

app.use(express.json());

console.log("Current Firebase Project:", admin.app().options.projectId);

// Create Box
app.post("/box", async (req, res) => {
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
      category: category,
    };

    const docRef = await db.collection("boxes").add(box);
    return res.status(201).json({ id: docRef.id, ...box });
  } catch (error) {
    console.error("Error creating box:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/box", async (req, res) => {});

exports.api = onRequest(app);
