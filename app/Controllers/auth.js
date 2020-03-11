const User = require("../Models/User");

/*
	Desc: New customer registration
	route: POST /api/v1/auth/register
	access: Public
*/
exports.register = async (req, res, next) =>{
  return res.status(200).json({ success: true });
};

/*
	Desc: Customer login route
	route: POST /api/v1/auth/login
	access: Public
*/
exports.login = async (req, res, next) => {
  return res.status(200).json({ success: true });
};

/*
	Desc: Logout customer
	route: GET /api/v1/auth/logout
	access: Public
*/
exports.logout = async (req, res, next) => {
  return res.status(200).json({ success: true });
};

/*
	Desc: Customer forgot password to account their account
	route: POST /api/v1/auth/forgot_password
	access: Public
*/
exports.forgotPassword = async (req, res, next) => {
  return res.status(200).json({ success: true });
};

/*
	Desc: Reset of customer password
	route: PUT /api/v1/auth/reset_password
	access: Private
*/
exports.resetPassword = async (req, res, next) => {
  return res.status(200).json({ success: true });
};