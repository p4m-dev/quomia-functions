import { Router } from "express";
import {
  checkTimeSlotAvailability,
  saveNFT,
} from "../services/crypto-services";
import { mapBoxFuture } from "../mapper/box-mapper";
import { boxFutureSchema } from "../models/schemas";
import { Box } from "../models/types";

const cryptoRouter = Router();

cryptoRouter.post("/", async (req, res) => {
  console.log(req.body);

  try {
    const validatedBody = boxFutureSchema.parse(req.body);
    const box: Box = mapBoxFuture(validatedBody);

    const boxId = "1312";
    const doc = await saveNFT(box, boxId);

    return res.status(200).json({ data: doc });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

cryptoRouter.get("/check-dates", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ error: "startDate and endDate are required" });
    }

    const start = new Date(startDate as string);
    const end = new Date(endDate as string);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    await checkTimeSlotAvailability(start, end);

    return res.status(200).send("Slot available");
  } catch (error) {
    console.error("Error while retrieving timers: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default cryptoRouter;
