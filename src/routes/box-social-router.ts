import { Router } from "express";
import { handleBoxSocial, retrieveSocialBoxes } from "../services/box-services";
import { boxRewindSchema } from "../models/schemas";

const boxSocialRouter = Router();

boxSocialRouter.post("/rewind", async (req, res) => {
  try {
    const validatedBody = boxRewindSchema.parse(req.body);

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
    return res.status(500).json({ error: error.message });
  }
});

boxSocialRouter.get("/social", async (req, res) => {
  try {
    const boxes = await retrieveSocialBoxes();

    return res.status(200).json({ boxes });
  } catch (error) {
    console.error("Errore nel recupero delle boxes: ", error);
    return res.status(500).json({ error: "Errore interno del server" });
  }
});

export default boxSocialRouter;
