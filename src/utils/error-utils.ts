import { ZodError } from "zod";
import { Response } from "express";

export const handleZodError = (res: Response, error: ZodError) => {
  const errors = error.errors.map((err) => ({
    path: err.path.join("."),
    message: err.message,
  }));
  return res.status(400).json({
    error: "Validation Error",
    details: errors,
  });
};
