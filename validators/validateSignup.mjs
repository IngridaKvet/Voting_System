import { body } from "express-validator";
import { getUserByEmail } from "../models/userModel.mjs";

const validateNewUser = [
  body().notEmpty().withMessage("User body must contain data"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is invalid")
    .normalizeEmail()
    .custom(async (email) => {
      const user = await getUserByEmail(email);
      if (user) {
        throw new Error("Email already exist");
      }
      return true; // email validation passed
    }),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .custom((password, { req }) => {
      if (password !== req.body.passwordconfirm) {
        throw new Error("Passwords must match. Please try again");
      }
      return true; // password validation passed
    }),
];

export default validateNewUser;
