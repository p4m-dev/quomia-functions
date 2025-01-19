import { Router } from "express";
import { handleBoxSocial, retrieveSocialBoxes } from "../services/box-services";
import { boxSocialSchema } from "../models/schemas";
import { handleApiErrors } from "../utils/error-utils";
import { BoxResponse } from "../models/types";

const boxSocialRouter = Router();

boxSocialRouter.post("/", async (req, res) => {
  try {
    const validatedBody = boxSocialSchema.parse(req.body);

    const result = handleBoxSocial(validatedBody);

    return res.status(201).json(result);
  } catch (error: any) {
    console.error(error);
    return handleApiErrors(res, error);
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
