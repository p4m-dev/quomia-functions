import { Router } from "express";
import { collTimers } from "../config/config";
import { Timer } from "../models/timer";

const timerRouter = Router();

timerRouter.get("/", async (req, res) => {
  try {
    const timers: Timer[] = [];
    const snapshot = await collTimers.orderBy("createdAt", "desc").get();

    snapshot.forEach((doc) => {
      timers.push({ ...(doc.data() as Timer) });
    });

    return res.status(200).json({ timers });
  } catch (error) {
    console.error("Error while retrieving timers: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default timerRouter;
