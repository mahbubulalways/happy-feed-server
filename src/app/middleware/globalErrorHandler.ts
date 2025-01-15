import { NextFunction, Request, Response } from 'express';
import config from '../config';
import { TErrorSources } from '../interface/errors';
import { handleZodError } from '../errors/handleZodError';
import { ZodError } from 'zod';

const globalErrorHandler = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  let message = error.message || 'Something went wrong';
  let statusCode = error.statusCode || 500;
  let errorSources: TErrorSources = [
    {
      path: '',
      message: 'Something went wrong',
    },
  ];

  if (error instanceof ZodError) {
    const simplifiedError = handleZodError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack: config.NODE_ENV === 'development' && error.stack,
  });
};

export default globalErrorHandler;
