import { Router } from "express";
import { handleBox, retrieveBoxes } from "../services/box-services";
import { boxSchema } from "../models/schemas";
import { handleApiErrors } from "../utils/error-utils";
import { BoxResponse } from "../models/types";

const boxRouter = Router();

boxRouter.post("/", async (req, res) => {
  console.log(req.body);

  try {
    const validatedBody = boxSchema.parse(req.body);

    const result = await handleBox(validatedBody);

    return res.status(201).json(result);
  } catch (error: any) {
    console.error(error);
    return handleApiErrors(res, error);
  }
});

boxRouter.get("/", async (req, res) => {
  try {
    const boxes: BoxResponse[] = await retrieveBoxes();

    return res.status(200).json({ boxes });
  } catch (error) {
    console.error("Errore nel recupero delle boxes: ", error);
    return res.status(500).json({ error: "Errore interno del server" });
  }
});

export default boxRouter;
