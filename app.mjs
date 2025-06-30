import express from "express";
import topicRouter from "./routes/topicRoutes.mjs";
import userRouter from "./routes/userRoutes.mjs";
import cookieParser from "cookie-parser";

const app = express();

//parsers
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use("/topics", topicRouter);
app.use("/users", userRouter);


app.use((err, req, res, next) => {
  const {
    statusCode = 500,
    status = "error",
    message = "Internal server error",
  } = err;

  res.status(statusCode).json({
    status: status,
    message: message,
  });
});

export default app;
