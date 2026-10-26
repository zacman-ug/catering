import { validationResult } from 'express-validator';
import { AppError } from './errorHandler.js';

export function validate(req, _res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array().map((e) => e.msg).join(', '), 400));
  }
  next();
}
