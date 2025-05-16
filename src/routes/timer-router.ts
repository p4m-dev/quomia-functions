import { Router } from "express";
import {
  retrieveBoxesByUsernameAndBoxType,
  retrieveTimers,
} from "../services/timer-services";

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

timerRouter.get("/boxes", async (req, res) => {
  try {
    const query = req.query;

    const username = query.username;
    const boxType = query.boxType;

    if (typeof username !== "string" || typeof boxType !== "string") {
      return res.status(400).json({
        error: "Query parameters 'username' and 'boxType' must be strings",
      });
    }

    const boxes = await retrieveBoxesByUsernameAndBoxType(username, boxType);

    return res.status(200).json({ boxes });
  } catch (error) {
    console.error("Error while retrieving timers: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default timerRouter;
