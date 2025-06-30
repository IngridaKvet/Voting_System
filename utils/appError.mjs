class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith(`4`) ? `fail` : `error`;

    this.isOperational = true;

    //we are capturing the stack trace, so we can see whee the error happened
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
