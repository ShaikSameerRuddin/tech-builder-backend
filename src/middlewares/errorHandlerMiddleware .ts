import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CustomAPIError, InternalServerError, NotFoundError } from '../errors/customErrors';

export const errorHandlerMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): Response<any, Record<string, any>> => {
  if (err instanceof CustomAPIError || err instanceof NotFoundError || err instanceof InternalServerError) {
    return res.status(err.statusCode).json({ message: err.message, code: err.errorCode });
  } else {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
  }
};


