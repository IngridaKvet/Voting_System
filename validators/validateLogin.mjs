import { body } from "express-validator";
import { getUserByEmail } from "../models/userModel.mjs";
import argon2 from "argon2";

const validateLogin = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is invalid")
    .normalizeEmail()
    .custom(async (email) => {
      const existingUser = await getUserByEmail(email);
      if (!existingUser) {
        throw new Error("User not found, please sign up");
      }
      return true; // email validation passed
    }),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .custom(async (password, { req }) => {
      const existingUser = await getUserByEmail(req.body.email);

      if (existingUser) {
        const match = await argon2.verify(existingUser.password, password);
        if (!match) {
            throw new Error('User or password is incorrect')
        }
      } 
      return true; // password validation passed
    }),
];

export default validateLogin
