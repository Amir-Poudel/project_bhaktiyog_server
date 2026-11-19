import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "yup";

export const validate =
  (schema: ObjectSchema<any>) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.validate(req.body ?? {}, { abortEarly: false, stripUnknown: true });
      next();
    } catch (err: any) {
      res.status(400).json({ success: false, message: "Validation failed", errors: err.errors });
    }
  };
