import express from "express";
import boxRewindRouter from "./routes/box-rewind-router";
import boxFutureRouter from "./routes/box-future-router";
import boxSocialRouter from "./routes/box-social-router";
import timerRouter from "./routes/timer-router";
import { onRequest } from "firebase-functions/v2/https";

const app = express();
app.use(express.json());

app.use("/box/rewind", boxRewindRouter);
app.use("/box/future", boxFutureRouter);
app.use("/box/social", boxSocialRouter);
app.use("/timers", timerRouter);

export const api = onRequest({ region: "europe-west3" }, app);
