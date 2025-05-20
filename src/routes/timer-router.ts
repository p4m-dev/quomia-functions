import { Router } from "express";
import { retrieveTimers } from "../services/timer-services";

const timerRouter = Router();

timerRouter.get("/", async (req, res) => {
  try {
    const timers = await retrieveTimers();

    return res.status(200).json({ timers });
  } catch (error) {
    console.error("Error while retrieving timers: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default timerRouter;
