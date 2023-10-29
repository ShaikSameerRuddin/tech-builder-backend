import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { saltRounds } from "./constants";
import {sendEmail} from "../app/services/mailer/emailServices";

export const generateToken = (
  payload: any,
  secretKey: string,
  expiresIn: string
): string => {
  return jwt.sign(payload, secretKey, { expiresIn: expiresIn });
};

export const createPasswordHash = (password: string): string => {
  return bcryptjs.hashSync(password, saltRounds);
};

export const isPasswordValid = (password: string) => {
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
  return passwordRegex.test(password);
};


