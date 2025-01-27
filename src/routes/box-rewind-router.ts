import { Router } from "express";
import { handleBoxRewind } from "../services/box-services";
import { boxRewindSchema } from "../models/schemas";
import { handleApiErrors } from "../utils/error-utils";

const boxRewindRouter = Router();

boxRewindRouter.post("/", async (req, res) => {
  console.log(req.body);

  try {
    const validatedBody = boxRewindSchema.parse(req.body);

    const result = await handleBoxRewind(validatedBody);

    return res.status(201).json(result);
  } catch (error: any) {
    console.error(error);
    return handleApiErrors(res, error);
  }
});

export default boxRewindRouter;
