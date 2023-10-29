import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../app/models";
import { AuthenticationError, BadRequest } from "../errors/customErrors";

export const checkDuplicatePhoneOrEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, number } = req.body;
  const existingUser = await User.findOne({ $or: [{ email }, { number }] });

  if (existingUser) {
    const conflictField = existingUser.email === email ? "email" : "number";
    throw new BadRequest(`${conflictField} is already in use`);
  }
  next();
};
interface CustomRequest extends Request {
  user?: { id: string; fullName: string };
}
export const authenticationCheck = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AuthenticationError("Sorry need Authentication to this");
  }
  const token = authHeader.split(" ")[1];

  const payload: any = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
  // attach the user to the job routes
  req.user = { id: payload.id, fullName: payload.fullName };
  next();
};



