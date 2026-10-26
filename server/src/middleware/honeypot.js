import { AppError } from './errorHandler.js';
import { trimString } from '../utils/guards.js';

export function rejectHoneypot(fieldName = 'companyWebsite') {
  return (req, _res, next) => {
    const value = trimString(req.body?.[fieldName]);
    if (value) {
      return next(new AppError('Unable to submit form', 400));
    }
    next();
  };
}
