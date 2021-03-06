const User = require("../Models/User");
const ErrorResponse = require("../Utils/errorsResponse");
const { asyncHandler } = require("../Utils/middlewares");

/*
	Desc: Get current logged-in user
	route: GET /api/v1/users/currentuser
	access: Public
*/
exports.getCurrentUser = asyncHandler(async(req, res, next) =>{
  const user = await User.findById(req.currentuser.id).populate("purchaseHistory", "status totalAmount createdAt").populate("wishlist", "name price photos");
  const currentuser = await user.profile();
  
  return res.status(200).json({ success: true, currentuser });
});

/*
	Desc: Update logged-in user account
	route: PUT /api/v1/currentuser/updateAccount
	access: Private
*/
exports.updateAccount = asyncHandler(async (req, res, next) =>{
  const { firstName, lastName, email, password, currentPwd, phone } = req.body;
  ;
  const isMatch = await req.currentuser.validatePassword(currentPwd);
  if(!isMatch){
    const err = "Current password must be provided to update account.";
    return next(new ErrorResponse(err, 401));
  };

  const updateData = { firstName, lastName, email, phone };
  if(password){
    updateData.password = password;
  };

  let currentuser = await User.findByIdAndUpdate(req.currentuser.id, updateData, { new: true }).populate("purchaseHistory", "status totalAmount createdAt");
  currentuser = await currentuser.profile();

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