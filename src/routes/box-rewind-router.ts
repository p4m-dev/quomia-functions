import { Router } from "express";
import { handleBoxRewind } from "../services/box-services";
import { boxRewindSchema } from "../models/schemas";
import { ZodError } from "zod";
import { handleZodError } from "../utils/error-utils";

const boxRewindRouter = Router();

boxRewindRouter.post("/", async (req, res) => {
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

    if (error instanceof ZodError) {
      return handleZodError(res, error);
    }
    return res.status(500).json({ error: error.message });
  }
});

export default boxRewindRouter;
