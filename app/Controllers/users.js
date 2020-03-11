const User = require("../Models/User");

/*
	Desc: Get current logged-in user
	route: GET /api/v1/users/currentuser
	access: Public
*/
exports.getCurrentUser = async (req, res, next) =>{
  return res.status(200).json({ success: true });
};

/*
	Desc: Update logged-in user account
	route: PUT /api/v1/users/:id
	access: Private
*/
exports.updateAccount = async (req, res, next) =>{
  return res.status(200).json({ success: true });
};

/*
	Desc: Delete user account
	route: DELETE /api/v1/users/:id/delete_account
	access: Private
*/
exports.deleteAccount = async (req, res, next) => {
  return res.status(200).json({ success: true });
};