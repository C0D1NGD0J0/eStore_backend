const {Order, CartItem} = require("../Models/Order");
const User = require("../Models/User");
const Product = require("../Models/Product");
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
  const { items, transactionId, total, address } = req.body;
  const currentuser = await User.findById(req.currentuser._id);

  const updatedItems = items.map((item) =>{
    return {
      product: item._id,
      price: item.price,
      quantity: item.qty,
    };
  });

  //update product soldCount
  items.map(async (item) =>{
    const product = await Product.findById(item._id).select("+soldCount");
    product.soldCount = product.soldCount + item.qty;
    await product.save();
  });

  const order = new Order();
  order.products = await updatedItems;
  order.transactionId = transactionId;
  order.totalAmount = total;
  order.shippingAddress = address;
  order.owner = req.currentuser._id;

  await order.save();
  currentuser.purchaseHistory.push(order._id);
  await currentuser.save({ validateBeforeSave: false });

  return res.status(200).json({ success: true, order });
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