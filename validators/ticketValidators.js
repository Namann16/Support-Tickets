import { body, query } from 'express-validator';

export const createTicketValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('priority').isIn(['low', 'medium', 'high', 'critical']).withMessage('Invalid priority'),
];

export const updateTicketStatusValidation = [
  body('status').notEmpty().isIn(['open', 'in_progress', 'resolved', 'closed', 'deleted']).withMessage('Invalid status'),
];

export const assignTicketValidation = [
  body('agentId').notEmpty().withMessage('AgentId is required'),
];

export const filterTicketsValidation = [
  query('status').optional().isIn(['open', 'in_progress', 'resolved', 'closed', 'deleted']).withMessage('Invalid status'),
  query('priority').optional().isIn(['low', 'medium', 'high', 'critical']).withMessage('Invalid priority'),
]; 