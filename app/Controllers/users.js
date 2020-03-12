const User = require("../Models/User");
const ErrorResponse = require("../Utils/errorsResponse");
const { asyncHandler } = require("../Utils/middlewares");

/*
	Desc: Get current logged-in user
	route: GET /api/v1/users/currentuser
	access: Public
*/
exports.getCurrentUser = (req, res, next) =>{
  return res.status(200).json({ currentuser: req.currentuser });
};

/*
	Desc: Update logged-in user account
	route: PUT /api/v1/currentuser/updateAccount
	access: Private
*/
exports.updateAccount = asyncHandler(async (req, res, next) =>{
  const { firstName, lastName, email, password, currentPassword, phone } = req.body;

  const isMatch = await req.currentuser.validatePassword(currentPassword);
  if(!isMatch){
    const err = "Current password must be provided to update account.";
    return next(new ErrorResponse(err, 401));
  };

  const updateData = { firstName, lastName, email, password, phone };
  const currentuser = await User.findByIdAndUpdate(req.currentuser.id, updateData, {new: true});

  return res.status(200).json({ success: true, currentuser });
});

/*
	Desc: Delete user account
	route: DELETE /api/v1/users/:id/delete_account
	access: Private
*/
exports.deleteAccount = async (req, res, next) => {
  return res.status(200).json({ success: true });
};