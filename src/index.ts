import express from "express";
import { onRequest } from "firebase-functions/v2/https";
import boxRouter from "./routes/box-router";
import timerRouter from "./routes/timer-router";

const app = express();
app.use(express.json());

app.use("/box", boxRouter);
app.use("/timers", timerRouter);

export const api = onRequest({ region: "europe-west3" }, app);
