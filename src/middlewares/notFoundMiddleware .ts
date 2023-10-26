import { Request, Response, NextFunction } from "express";
import { NotFoundError } from "../errors/customErrors";

export const notFoundMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  throw new NotFoundError("Route Not Found");
};
