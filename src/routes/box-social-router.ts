import { Router } from "express";
import { handleBoxSocial, retrieveSocialBoxes } from "../services/box-services";
import { boxSocialSchema } from "../models/schemas";
import { ZodError } from "zod";
import { handleZodError } from "../utils/error-utils";
import { BoxResponse } from "../models/types";

const boxSocialRouter = Router();

boxSocialRouter.post("/", async (req, res) => {
  try {
    const validatedBody = boxSocialSchema.parse(req.body);

    const result = handleBoxSocial(validatedBody);

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

boxSocialRouter.get("/", async (req, res) => {
  try {
    const boxes: BoxResponse[] = await retrieveSocialBoxes();

    return res.status(200).json({ boxes });
  } catch (error) {
    console.error("Errore nel recupero delle boxes: ", error);
    return res.status(500).json({ error: "Errore interno del server" });
  }
});

export default boxSocialRouter;
