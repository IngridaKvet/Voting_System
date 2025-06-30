import express from "express";
import {
  signup,
  login,
  logout,
  protect,
} from "../controllers/authController.mjs";
import validateNewUser from "../validators/validateSignup.mjs";
import validate from "../validators/validate.mjs";
import validateLogin from "../validators/validateLogin.mjs";

const router = express.Router();

router.route("/signup").post(validateNewUser, validate, signup);
router.route("/login").post(validateLogin, validate, login);
router.route("/logout").post(protect, logout);

export default router;
