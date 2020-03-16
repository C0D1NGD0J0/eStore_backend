const User = require("../Models/User");
const ErrorResponse = require("../Utils/errorsResponse");
const { asyncHandler } = require("../Utils/middlewares");
const { sendEmail } = require("../Config/emailConfig");
const { tokenGenerator, jwtGenerator } = require("../Utils/helperFn");

/*
	Desc: New customer registration
	route: POST /api/v1/auth/register
	access: Public
*/
exports.register = asyncHandler(async (req, res, next) =>{
  const { firstName, lastName, email, password } = req.body;
  
  const founduser = await User.findOne({ email });
  if(founduser){
    let errMsg = `The email(${email}) is already associated with an account.`;
    return next(new ErrorResponse(errMsg, 404));
  };

  const user = new User({ firstName, lastName, email, password });
  user.activationToken = await tokenGenerator();
  user.activationTokenExpires = (Date.now() + (3600000 * 2)); //expires in 2hrs
  await user.save();

  // send registration Email
  const mailOptions = {
    email: user.email,
    token: user.activationToken,
    emailType: "account_activation",
    subject: "House of Anasa: Account Activation"
  };
  await sendEmail(mailOptions, req, next);

  return res.status(200).json({ success: true, msg: "Confirmation email has been sent to your registered email." });
});

/*
	Desc: Account activation
	route: GET /api/v1/auth/account_activation/:token
	access: Private
*/
exports.activateAccount = asyncHandler( async (req, res, next) =>{
  const { token } = req.params;

  const user = await User.findOne({
    activationToken: token,
    activationTokenExpires: { $gt: Date.now() }
  });

  if (!user) {
    const msg = "Activation link has expired.";
    return next(new ErrorResponse(msg, 404));
  };
  
  user.isActive = true;
  user.activationToken = "";
  user.activationTokenExpires = "";
  await user.save();
  
  return res.status(200).json({ success: true, token: jwtGenerator(user) });
});

/*
	Desc: Customer login route
	route: POST /api/v1/auth/login
	access: Public
*/
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  
  if(!user){
    const err = "Invalid email/password credentials.";
    return next(new ErrorResponse(err, 401));
  };

  if(!user.isActive){
    const err = "Please activate your account! to proceed.";
    return next(new ErrorResponse(err, 401));
  };

  const isMatch = await user.validatePassword(password);

  if(!isMatch){
    const err = "Invalid email/password credentials.";
    return next(new ErrorResponse(err, 401));
  };

  return res.status(200).json({ success: true, token: jwtGenerator(user)});
});

/*
	Desc: Logout customer
	route: GET /api/v1/auth/logout
	access: Public
*/
exports.logout = asyncHandler(async (req, res, next) => {
  return res.status(200).json({ success: true });
});

/*
	Desc: Customer forgot password to account their account
	route: POST /api/v1/auth/forgot_password
	access: Public
*/
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const token = tokenGenerator();

  const user = await User.findOne({ email });

  if(!user){
    const err = "No user found with the email provided.";
    return next(new ErrorResponse(err, 401));
  };

  user.passwordResetToken = token;
  user.passwordResetExpires = Date.now() + 7200000;
  await user.save();

  // send password reset email
  const mailOptions = {
    email: user.email,
    token: user.passwordResetToken,
    emailType: "password_reset",
    subject: "House of Anasa: Password Reset"
  };
  await sendEmail(mailOptions, req, next);

  return res.status(200).json({ success: true });
});

/*
	Desc: Reset of customer password
	route: PUT /api/v1/auth/reset_password
	access: Private
*/
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({ passwordResetToken: token, passwordResetExpires: { $gt: Date.now()} });

  if(!user){
    const err = "Please generate a new token.";
    return next(new ErrorResponse(err, 401));
  };

  user.password = password;
  user.passwordResetToken = "";
  user.passwordResetExpires = "";
  await user.save();

  return res.status(200).json({ success: true, token: jwtGenerator(user) });
});