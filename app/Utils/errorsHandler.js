const ErrorResponse = require("./errorsResponse");

const errorHandler = (err, req, res, next) =>{
  let error = { ...err };
  error.message = err.message;

  console.log(err.message.red.bold)
  
  // Mongoose bad ObjectID
  if (err.name === 'CastError') {
    const message = `Resource with ID ${err.value} not found!`;
    error = new ErrorResponse(message, 404);
  };

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = `Duplicate fields value provided!`;
    error = new ErrorResponse(message, 400);
  };

  // Mongoose Validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => (`${val.message}`.replace("Error, ", "")));
    error = new ErrorResponse(messages, 400);
  };

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error...'
  });
};

module.exports = errorHandler;