import argon2 from "argon2";
import {
  createUser,
  getUserByEmail,
  getUserById,
} from "../models/userModel.mjs";
import AppError from "../utils/appError.mjs";
import jwt from "jsonwebtoken";

// JWT tokens
const signToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};

const sendTokenCookie = (token, res) => {
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.cookie("jwt", token, cookieOptions);
};

// 1. Sign up controller
export const signup = async (req, res, next) => {
  try {
    const newUser = req.body;
    const hash = await argon2.hash(newUser.password);

    newUser.password = hash;
    newUser.passwordconfirm = undefined;

    const createdUser = await createUser(newUser);

    if (!createdUser) {
      throw new AppError("User not created", 400);
    }

    const token = signToken(createdUser.id);
    sendTokenCookie(token, res);

    createdUser.password = undefined;

    res.status(201).json({
      status: "success",
      data: createdUser,
    });

  } catch (error) {
    next(error);
  }
};

// 2. Login controller pagal email ir password
export const login = async (req, res, next) => {
  try {
    const { email } = req.body;

    const existingUser = await getUserByEmail(email);
    const token = signToken(existingUser.id);
    sendTokenCookie(token, res);

    existingUser.password = undefined;

    res.status(200).json({
      status: "success",
      data: existingUser,
    });
  } catch (error) {
    next(error);
  }
};

// 3. Protect controller only logged in users
export const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt;

    console.log(token);

    if (!token) {
      throw new AppError("You are not logged in", 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currectUser = await getUserById(decoded.id);
    currectUser.password = undefined;

    if (!currectUser) {
      throw new AppError(
        "The user belonging to this token does not exist",
        401
      );
    }

    req.user = currectUser;
    next();
  } catch (error) {
    next(error);
  }
};

// 4. Allow access to users with specific roles
export const allowAcessTo = (...roles) => {
  return (req, res, next) => {
    try {
      if (!roles.includes(req.user.role)) {
        throw new AppError(
          "You do not have permissions to perform this task",
          403
        );
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

// 5. Logout controller - deleting jwt
export const logout = (req, res, next) => {
  try {
    return res.clearCookie("jwt").status(200).json({
      status: "success",
      message: "You are logged out",
    });
  } catch (error) {
    next(error);
  }
};
