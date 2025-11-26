import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';
import { AppError } from '../utils/errors';
import { sendError } from '../utils/response.util';
import { Prisma } from '@prisma/client';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response | void => {
  logger.error(err, 'Error occurred');

  if (err instanceof AppError) {
    return sendError(res, err.message, err.statusCode);
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return sendError(res, 'Duplicate entry', 409);
    }
    if (err.code === 'P2025') {
      return sendError(res, 'Record not found', 404);
    }
    return sendError(res, 'Database error', 500);
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return sendError(res, 'Validation error', 400);
  }

  return sendError(res, 'Internal server error', 500);
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  return sendError(res, `Route ${req.originalUrl} not found`, 404);
};

