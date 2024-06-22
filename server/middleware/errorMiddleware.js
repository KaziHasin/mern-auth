import CustomErrorApi from "../errors/customError.js";
// this function is used to return not found error
const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// this function is used to handle mongoose error
const errorHandle = (error, req, res, next) => {
  let statusCode;
  let message;
  if (error instanceof CustomErrorApi) {
    res.status(error.statusCode).json({ message: error.message });
  }
  if (error.name == "CastError") {
    statusCode = 404;
    message = "Resource not found";
  } else if (error.errors) {
    const errorMessages = Object.values(error.errors).map((err) => err.message);
    statusCode = 400;
    message = errorMessages;
  } else if (error) {
    statusCode = 500;
    message = error;
  } else {
    statusCode = 500;
    message = "An error occurred";
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === "production" ? null : error.stack,
  });
};

export { notFound, errorHandle };
