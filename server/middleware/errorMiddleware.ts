import { NextFunction, Request, Response } from "express";

export const errorMiddleware = (
  error: { error: string; status: number },
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.status(error.status).json({ error: error.error });
};
