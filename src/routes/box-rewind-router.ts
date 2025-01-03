import { Router } from "express";
import { handleBoxRewind } from "../services/box-services";
import { boxRewindSchema } from "../models/schemas";

const boxRewindRouter = Router();

boxRewindRouter.post("/rewind", async (req, res) => {
  try {
    const validatedBody = boxRewindSchema.parse(req.body);

    const result = handleBoxRewind(validatedBody);

    if (result == null) {
      return res.status(400).json({
        message: "Error",
      });
    }
    return res.status(201).json({
      message: "Rewind Box successfully created!",
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

export default boxRewindRouter;
