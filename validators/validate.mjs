import { validationResult } from "express-validator";
import AppError from "../utils/appError.mjs";

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {


    const errorsString = errors
      .array()
      .map((error) => {
        return error.msg;
      })
      .join(`; `);

    next(new AppError(errorsString, 400));
  }
  next(); //proceed to next middlewre, validaton passed
};

export default validate;
