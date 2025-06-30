import { body } from "express-validator";

const validateNewTopic = [
  body('title')
  .trim()
  .notEmpty().withMessage('Title is required')
  .isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),

body('description')
  .optional()
  .trim()
  .isLength({ max: 500 }).withMessage('Description max length is 500'),

body('options')
  .isArray({ min: 2, max: 5 }).withMessage('Options must be an array with 2 to 5 items'),

body('options.*')
  .trim()
  .notEmpty().withMessage('Option text cannot be empty')
  .isString().withMessage('Each option must be a string'),
];

export default validateNewTopic;
