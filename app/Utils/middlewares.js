const jwt = require("jsonwebtoken");
const User = require("../Models/User");
const ErrorResponse = require("./errorsResponse");

const asyncHandler = fn => (req, res, next) =>{
  return Promise.resolve(fn(req, res, next)).catch(next);
};

const isAuthorized = asyncHandler(async (req, res, next) =>{
  let token;

  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    token = req.headers.authorization.split(' ')[1];
  };

  if(!token){
    const err = "Access denied!, invalid credentials.";
    return next(new ErrorResponse(err, 401));
  };

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.currentuser = await User.findById(decoded.id).select("+password");
    next();
  } catch (error) {
    console.log("Err: ", error.message.red.bold.underline);
    const err = "Access denied!, invalid credentials.";
    return next(new ErrorResponse(err, 401));
  };
});

module.exports = {
  asyncHandler, isAuthorized
};