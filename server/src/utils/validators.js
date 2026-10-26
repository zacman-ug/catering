import { body } from 'express-validator';

export const bookingValidation = [
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('eventType').trim().notEmpty().withMessage('Event type is required'),
  body('email').optional({ checkFalsy: true }).isEmail().withMessage('Invalid email address'),
  body('guestCount').optional({ checkFalsy: true }).isInt({ min: 1 }).withMessage('Guest count must be at least 1'),
  body('serviceStyle').optional({ checkFalsy: true }).isString().withMessage('Invalid service style'),
  body('dietaryRequirements').optional({ checkFalsy: true }).isString().withMessage('Invalid dietary requirements'),
  body('budgetRange').optional({ checkFalsy: true }).isString().withMessage('Invalid budget range'),
];

export const enrollmentValidation = [
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('email').optional({ checkFalsy: true }).isEmail().withMessage('Invalid email address'),
  body('courseId').optional({ checkFalsy: true }).isUUID().withMessage('Invalid course ID'),
];

export const contactValidation = [
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('message').trim().notEmpty().withMessage('Message is required'),
  body('email').optional({ checkFalsy: true }).isEmail().withMessage('Invalid email address'),
];

export const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];
