const {Order, CartItem} = require("../Models/Order");
const User = require("../Models/User");
const Product = require("../Models/Product");
const ErrorResponse = require("../Utils/errorsResponse");
const { asyncHandler } = require("../Utils/middlewares");
const { sendEmail } = require("../Config/emailConfig");

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
  const { items, transactionId, purchaseTotal, address, costBreakdown } = req.body;
  const currentuser = await User.findById(req.currentuser._id);

  const updatedCartItems = items.map((item) =>{
    return {
      product: item._id,
      price: item.price,
      quantity: item.qty,
      name: item.name,
      photo: item.photos[0].url
    };
  });

  //update product soldCount
  items.map(async (item) =>{
    const product = await Product.findById(item._id).select("+soldCount");
    product.soldCount = product.soldCount + item.qty;
    await product.save();
  });

  //create new order 
  const order = new Order();
  order.products = updatedCartItems;
  order.transactionId = transactionId;
  order.totalAmount = purchaseTotal;
  order.shippingAddress = address;
  order.costBreakdown = costBreakdown;
  order.owner = req.currentuser._id;

  await order.save();
  currentuser.purchaseHistory.push(order._id);
  await currentuser.save({ validateBeforeSave: false });

  //email user regarding their order
  const mailOptions = {
    order,
    orderItems: updatedCartItems,
    customer: currentuser.fullname,
    emailType: "new_order",
    email: currentuser.email,
    subject: "House of Anasa: Recently Placed Order"
  };
  await sendEmail(mailOptions, req, next);

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