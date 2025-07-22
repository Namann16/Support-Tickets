import { body } from 'express-validator';

export const registerValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['admin', 'agent', 'customer']).withMessage('Invalid role'),
  body('customerId').notEmpty().withMessage('CustomerId is required'),
];

export const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const updateUserValidation = [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('role').optional().isIn(['admin', 'agent', 'customer']).withMessage('Invalid role'),
];

export const changeUserRoleValidation = [
  body('role').notEmpty().isIn(['admin', 'agent', 'customer']).withMessage('Invalid role'),
]; 