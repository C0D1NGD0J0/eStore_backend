//const Order = require("../Models/Order");
const ErrorResponse = require("../Utils/errorsResponse");
const { asyncHandler } = require("../Utils/middlewares");

/*
	Desc: Get all orders in the db 
	route: GET /api/v1/orders/
	access: Private (Admin)
*/
exports.getAllOrders = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.currentuser.id).populate("wishlist", "name price photos");
  const currentuser = await user.profile();

  return res.status(200).json({ success: true, currentuser });
});

/*
	Desc: Create new order
	route: POST /api/v1/orders/
	access: Private
*/
exports.createOrder = asyncHandler(async (req, res, next) => {
  return res.status(200).json({ success: true });
});

/*
	Desc: Update order status
	route: PUT /api/v1/orders/:id
	access: Private (Admin)
*/
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  return res.status(200).json({ success: true });
});

/*
	Desc: Get user order
	route: GET /api/v1/orders/:id
	access: Private
*/
exports.getSingleOrder = asyncHandler(async (req, res, next) => {
  return res.status(200).json({ success: true });
});

/*
	Desc: Delete user order
	route: DELETE /api/v1/orders/:id
	access: Private (Admin)
*/
exports.deleteOrder = async (req, res, next) => {
  return res.status(200).json({ success: true });
};