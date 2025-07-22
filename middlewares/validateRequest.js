import { validationResult } from 'express-validator';
import { ApiResponse } from '../utils/ApiResponse.js';

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(
      new ApiResponse(400, null, 'Validation failed', errors.array())
    );
  }
  next();
};

export default validateRequest; 