exports.errorHandler = (err, req, res, next) =>{
  let error = {};
  console.log(err.name);
  console.log(err.message.red.bold);

  // Mongoose bad ObjectID
  if (err.name === 'CastError') {
    const message = `Resource with ID ${err.value} not found!`;
    error = new ErrorResponse(message, 404);
  };

  // Mongoose TypeError
  if (err.name === 'TypeError') {
    const message = err.message;
    error = new ErrorResponse(message, 404);
  };

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = `Duplicate fields value provided!`;
    error = new ErrorResponse(message, 400);
  };

  // Mongoose Validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  };

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error...'
  });
};