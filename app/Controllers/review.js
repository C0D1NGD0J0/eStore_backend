const User = require("../Models/User");
const Product = require("../Models/Product");
const Review = require("../Models/Review");
const ErrorResponse = require("../Utils/errorsResponse");
const { asyncHandler } = require("../Utils/middlewares");

/*
	Desc: Get product reviews
	route: GET /api/v1/products/:id/reviews
	access: Private
*/
exports.getProductReviews = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const reviews = await Review.find({product: id}).populate("product", "name")
  return res.status(200).json({ success: true, count: reviews.length, reviews });
});

/*
	Desc: Create product review
	route: POST /api/v1/products/:id/reviews
	access: Private
*/
exports.addProductReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { title, body, rating } = req.body;

  const product = await Product.findById(id);
  
  if (!product) {
    let errMsg = "Invalid resource ID provided";
    return next(new ErrorResponse(errMsg, 404));
  };

  const review = await Review.create({ 
    author: req.currentuser._id, 
    product: id, 
    title, body, rating 
  });

  return res.status(201).json({ success: true, review });
});