const User = require("../Models/User");
const ErrorResponse = require("../Utils/errorsResponse");
const { asyncHandler } = require("../Utils/middlewares");
const { sendEmail } = require("../Config/emailConfig");
const { tokenGenerator } = require("../Utils/helperFn");

/*
	Desc: New customer registration
	route: POST /api/v1/auth/register
	access: Public
*/
exports.register = asyncHandler(async (req, res, next) =>{
  const { firstName, lastName, email, password } = req.body;
  
  const founduser = await User.findOne({ email });
  if(founduser){
    let errMsg = `This email(${email}) is already associated with an account.`;
    return next(new ErrorResponse(errMsg, 404));
  };

  const user = new User({ firstName, lastName, email, password });
  user.activationToken = tokenGenerator();
  user.activationTokenExpires = (Date.now() + (3600000 * 2)); //expires in 2hrs
  await user.save();

  // send registration Email
  const mailOptions = {
    email: user.email,
    token: user.activationToken,
    emailType: "account_activation",
    subject: "House of Anasa: Account Activation"
  };
  await sendEmail(mailOptions);

  return res.status(200).json({ success: true });
});

/*
	Desc: Customer login route
	route: POST /api/v1/auth/login
	access: Public
*/
exports.login = asyncHandler(async (req, res, next) => {
  return res.status(200).json({ success: true });
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
  return res.status(200).json({ success: true });
});

/*
	Desc: Reset of customer password
	route: PUT /api/v1/auth/reset_password
	access: Private
*/
exports.resetPassword = asyncHandler(async (req, res, next) => {
  return res.status(200).json({ success: true });
});