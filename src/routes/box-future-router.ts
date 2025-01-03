import { Router } from "express";
import { handleBoxFuture, handleBoxRewind } from "../services/box-services";
import { boxFutureSchema } from "../models/schemas";

const boxFutureRouter = Router();

boxFutureRouter.post("/", async (req, res) => {
  try {
    const validatedBody = boxFutureSchema.parse(req.body);

    const result = handleBoxFuture(validatedBody);

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

export default boxFutureRouter;
