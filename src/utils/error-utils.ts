import { ZodError } from "zod";
import { Response } from "express";
import TimeError from "../errors/time-error";

const handleZodError = (res: Response, error: ZodError) => {
  const errors = error.errors.map((err) => ({
    path: err.path.join("."),
    message: err.message,
  }));
  return res.status(400).json({
    error: "Validation Error",
    details: errors,
  });
};

const handleTimeError = (res: Response, error: string) => {
  return res.status(409).json({
    error: "Time error",
    details: error,
  });
};

export const handleApiErrors = (res: Response, error: any) => {
  console.error(error);

  if (error instanceof ZodError) {
    return handleZodError(res, error);
  }
  if (error instanceof TimeError) {
    return handleTimeError(res, error.message);
  }
  return res.status(500).json({ error: error.message });
};
