const User = require("../Models/User");
const Product = require("../Models/Product");
const Category = require("../Models/Category");
const ErrorResponse = require("../Utils/errorsResponse");
const { asyncHandler } = require("../Utils/middlewares");

/*
	Desc: Get all products in the database
	route: GET /api/v1/products/
	access: Private
*/
exports.getAllProducts = asyncHandler(async (req, res, next) =>{
  const products = await Product.find({quantity: {$gt: 0}});
  const count = await Product.countDocuments({});

  return res.status(200).json({ success: true, products, count });
});

/*
	Desc: Create product
	route: POST /api/v1/products/
	access: Private
*/
exports.createProduct = asyncHandler(async (req, res, next) => {
  const { name, photo, price, description, brandName, quantity, featured, parentCategoryId, childCategoryId } = req.body;

  let product = {
    name, 
    featured, 
    brandName, 
    description, 
    price: parseFloat(price), 
    quantity: parseInt(quantity)
  };

  product = new Product(product);
  product.photos.push(photo);
  product.category = {
    parentCategory: parentCategoryId,
    subCategory: childCategoryId
  };

  await product.save();
  return res.status(201).json({ success: true, product });
});

/*
	Desc: Get products that belong to a category
	route: GET /api/v1/products/categories/:categoryId/
	access: Public
*/
exports.getCategoryProducts = asyncHandler(async (req, res, next) => {
  const { categoryId } = req.params;
  const category = await Category.findById(categoryId).select("id");

  if (!category) {
    let errMsg = "Invalid resource ID provided";
    return next(new ErrorResponse(errMsg, 404));
  };

  const products = await Product.find({"category.parentCategory": category.id });
  const count = products.length;

  return res.status(200).json({ success: true, count, products });
});

/*
	Desc: Get featured products
	route: GET /api/v1/products/featured
	access: Public
*/
exports.featuredProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find({featured: true}).select("id name price photos");
  const count = products.length;

  return res.status(200).json({ success: true, count, products });
});

/*
	Desc: Add product to user wishlist
	route: GET /api/v1/products/:id/add_to_wishlist
	access: Public
*/
exports.addToWishlist = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findById(id);
  if(!product){
    let errMsg = "Invalid resource ID provided";
    return next(new ErrorResponse(errMsg, 404));
  };

  const user = await User.findOneAndUpdate({ _id: req.currentuser.id }, { $addToSet: { wishlist: id } }, { new: true });

  const wishlist = user.wishlist;
  return res.status(200).json({ success: true, wishlist });
});

/*
	Desc: Remove product from user wishlist
	route: PUT /api/v1/products/:id/remove_wishlist_item
	access: Public
*/
exports.removeWishlistItem = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findById(id);
  if (!product) {
    let errMsg = "Invalid resource ID provided";
    return next(new ErrorResponse(errMsg, 404));
  };

  const user = await User.findOneAndUpdate({ _id: req.currentuser.id }, { $pull: { wishlist: id } }, { new: true });

  const wishlist = user.wishlist;
  return res.status(200).json({ success: true, wishlist });
});

/*
	Desc: Get single product 
	route: GET /api/v1/products/:id
	access: Public
*/
exports.getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findById(id);
  if (!product) {
    let errMsg = "Invalid resource ID provided";
    return next(new ErrorResponse(errMsg, 404));
  };

  return res.status(200).json({ success: true, product });
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