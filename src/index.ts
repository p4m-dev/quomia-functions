import express from "express";
import timerRouter from "./routes/timer-router";
import cryptoRouter from "./routes/crypto-router";
import userRouter from "./routes/user-router";
import boxRouter from "./routes/box-router";
import { onRequest } from "firebase-functions/v2/https";

const app = express();
app.use(express.json());

app.use("/box", boxRouter);
app.use("/timers", timerRouter);
app.use("/user", userRouter);

// DEBUG PURPOSE
app.use("/crypto", cryptoRouter);

export const api = onRequest({ region: "europe-west3", memory: "512MiB" }, app);
