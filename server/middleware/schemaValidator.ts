import { NextFunction, Request, Response } from "express";
import { z, ZodError } from "zod";

export const schemaValidator =
  (schema: z.ZodObject<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedBody = await schema.parseAsync(req.body);
      req.body = parsedBody;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next({ error: error.errors[0].message, status: 400 });
        // res.status(400).json({ error: error.errors[0].message });
      }
    }
  };
