import AppError from "../utilis/appError.js";

const handleCastErrorDb = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleJsonWebTokenError = () =>
  new AppError("Invalid token. Please login again.", 401);
const handleJwtTokenExpiredError = () =>
  new AppError("Token expired. Please login again.", 401);

const handleDuplicateFieldsdb = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}`;
  return new AppError(message, 400);
};

const handleValidationErrorDb = (err) => {
  const errors = object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  //operational error, trusted error: send msg to client
  if (err.isOPerational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    //programming or unknown error: dont leak error information
  } else {
    console.error("Error", err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong, please try again later.",
    });
  }
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV !== "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV !== "production") {
    let error = { ...err };
    if (error.name === "CastError") error = handleCastErrorDb(error);
    if (error.code === 11000) error = handle = handleDuplicateFieldsdb(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorDb(error);
    if (error.name === "JsonWebTokenError") error = handleJsonWebTokenError();
    if (error.name === "TokenExpiredError")
      error = handleJwtTokenExpiredError();
    sendErrorProd(error, res);
  }
};
export default globalErrorHandler;
