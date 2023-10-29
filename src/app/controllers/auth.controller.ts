import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { User } from "../models";
import {
  AuthenticationError,
  BadRequest,
  CustomAPIError,
  NotFoundError,
} from "../../errors/customErrors";
import { createPasswordHash, isPasswordValid } from "../../helpers/utils";
import { sendThankYouEmail } from "../services/mailer/sendEmails";

export default {
  register: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { fullName, email, number, password, location } = req.body;

      if (!isPasswordValid(password)) {
        throw new BadRequest("Invalid password format");
      }
      const user = new User({
        fullName,
        email,
        number,
        passwordHash: createPasswordHash(password),
      });
      await user.save();

      const token = user.createJWT("1h");
      user.token = token;
      await user.save();

      res.status(StatusCodes.CREATED).send({
        message: "Successfully Register",
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          number: user.number,
          location: user.location,
          token: user.token,
        },
      });
      await sendThankYouEmail({ name: user.fullName, email: user.email });
    } catch (error) {
      next(error);
    }
  },
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new BadRequest("Please provided the username and password");
      }

      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("Invalidate Credentials");
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        throw new AuthenticationError("Password is incorrect");
      }

      const token = user.createJWT("1h");
      user.token = token;
      await user.save();
      res.status(StatusCodes.OK).send({
        message: "Successfully Logged in",
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          number: user.number,
          location: user.location,
          token: user.token,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  updateUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, fullName, number, location } = req.body;
      if (!email || !fullName || !number || !location) {
        throw new BadRequest("Please provide all values");
      }
      const user = await User.findOne({ _id: (req as any).user.id });

      if (!user) {
        throw new NotFoundError("User not found");
      }

      user.email = email;
      user.fullName = fullName;
      user.number = number;
      user.location = location;

      await user.save();
      res.status(StatusCodes.OK).json({
        message: "Successfully updated",
        user: {
          email: user.email,
          fullName: user.fullName,
          number: user.number,
          location: user.location,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  logout: async () => {},
};
