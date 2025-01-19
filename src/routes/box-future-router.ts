import { Router } from "express";
import { handleBoxFuture } from "../services/box-services";
import { boxFutureSchema } from "../models/schemas";
import { handleApiErrors } from "../utils/error-utils";

const boxFutureRouter = Router();

boxFutureRouter.post("/", async (req, res) => {
  try {
    const validatedBody = boxFutureSchema.parse(req.body);

    const result = handleBoxFuture(validatedBody);

    return res.status(201).json(result);
  } catch (error: any) {
    console.error(error);
    return handleApiErrors(res, error);
  }
});

export default boxFutureRouter;
