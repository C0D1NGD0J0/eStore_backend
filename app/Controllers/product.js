const Product = require("../Models/Product");
const ErrorResponse = require("../Utils/errorsResponse");
const { asyncHandler } = require("../Utils/middlewares");

/*
	Desc: Get all products in the database
	route: GET /api/v1/products/
	access: Private
*/
exports.getAllProducts = asyncHandler(async (req, res, next) =>{
  return res.status(200).json({ success: true });
});

/*
	Desc: Create product
	route: POST /api/v1/products/
	access: Private
*/
exports.createProduct = asyncHandler(async (req, res, next) => {
  const { name, photo, price, description, brandName, quantity, featured } = req.body;

  let product = new Product({
    name, price: parseFloat(price), description, brandName, quantity: parseInt(quantity), featured
  });
  product.photos.push(photo);
  await product.save();

  return res.status(201).json({ success: true, product });
});

/*
	Desc: Get products that belong to a category
	route: GET /api/v1/products/categories/:id/
	access: Public
*/
exports.getCategoryProducts = asyncHandler(async (req, res, next) => {
  return res.status(200).json({ success: true });
});

/*
	Desc: Get featured products
	route: GET /api/v1/products/featured
	access: Public
*/
exports.featuredProducts = asyncHandler(async (req, res, next) => {
  return res.status(200).json({ success: true });
});

/*
	Desc: Get current logged-in user
	route: GET /api/v1/products/:id/add_to_wishlist
	access: Public
*/
exports.addToWishlist = asyncHandler(async (req, res, next) => {
  return res.status(200).json({ success: true });
});

/*
	Desc: Get single product 
	route: GET /api/v1/products/:id
	access: Public
*/
exports.getProduct = asyncHandler(async (req, res, next) => {
  return res.status(200).json({ success: true });
});

/*
	Desc: Update a single product
	route: PUT /api/v1/products/:id
	access: Private
*/
exports.updateProduct = asyncHandler(async (req, res, next) => {
  return res.status(200).json({ success: true });
});

/*
	Desc: Delete single product
	route: GET /api/v1/products/:id
	access: Private
*/
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  return res.status(200).json({ success: true });
});