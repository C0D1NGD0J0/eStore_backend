const User = require("../Models/User");
const Product = require("../Models/Product");
const Review = require("../Models/Review");
const Category = require("../Models/Category");
const slugify = require("slugify");
const ErrorResponse = require("../Utils/errorsResponse");
const { asyncHandler } = require("../Utils/middlewares");
const { paginateResult } = require("../Utils/helperFn");

/*
	Desc: Get all products in the database
	route: GET /api/v1/products/
	access: Private
*/
exports.getAllProducts = asyncHandler(async (req, res, next) => {
  let query, skip;
  let { page, limit, sortBy } = req.query;

  // pagination
  page = parseInt(page, 10) || 1;
  limit = parseInt(limit, 10) || 9;
  skip = (page - 1) * limit;

  query = {};
  const products = await Product.find(query).sort(sortBy).skip(skip).limit(limit).populate({
    path: "category.parentCategory",
    select: "slug"
  });
  const count = await Product.countDocuments({});
  const pagination = paginateResult(count, skip, limit);

  return res.status(200).json({ success: true, pagination, products });
});

/*
	Desc: Create product
	route: POST /api/v1/products/
	access: Private
*/
exports.createProduct = asyncHandler(async (req, res, next) => {
  const { name, photo, price, description, brandName, quantity, featured, parentCategoryId, childCategoryId, isactive } = req.body;

  let product = {
    name,
    featured,
    brandName,
    description,
    isActive: isactive,
    price: parseFloat(price),
    author: req.currentuser._id,
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
	Desc: Get single product 
	route: GET /api/v1/products/:id
	access: Public
*/
exports.getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  let product = await Product.findById(id).select("+soldCount +quantity").lean({ virtuals: true });

  if (!product) {
    let errMsg = "Invalid resource ID provided";
    return next(new ErrorResponse(errMsg, 404));
  };

  //const { soldCount, quantity, ...others } = product;
  const reviews = await Review.find({ product: id }).populate("author", "firstName lastName");;

  return res.status(200).json({ success: true, product, reviews });
});

/*
	Desc: Get related products based parent category
	route: GET /api/v1/products/:id/related_products/category/:categoryId
	access: Public
*/
exports.relatedProducts = asyncHandler(async (req, res, next) => {
  const limit = 3;
  const { id, categoryId } = req.params;

  const products = await Product.find({ _id: { $ne: id }, "category.parentCategory": categoryId }).limit(limit).select("name photos price slug");

  if (!products) {
    let errMsg = "Invalid resource ID provided";
    return next(new ErrorResponse(errMsg, 404));
  };

  return res.status(200).json({ success: true, products });
});

/*
	Desc: Get products that belong to a category
	route: GET /api/v1/products/categories/:categoryId/
	access: Public
*/
exports.getCategoryProducts = asyncHandler(async (req, res, next) => {
  let skip, products;
  const { categoryId } = req.params;
  let { page, limit, sortBy } = req.query;
  const category = await Category.findById(categoryId).select("-subcategories");
  
  if (!category) {
    let errMsg = "Invalid resource ID provided";
    return next(new ErrorResponse(errMsg, 404));
  };

  // pagination
  page = parseInt(page, 10) || 1;
  limit = parseInt(limit, 10) || 9;
  skip = (page - 1) * limit;

  if(sortBy){
    products = await Product.find({ isActive: true, "category.parentCategory": category._id }).sort(sortBy).skip(skip).limit(limit);
  }else {
    products = await Product.find({ isActive: true, "category.parentCategory": category._id }).skip(skip).limit(limit);
  };

  const count = await Product.countDocuments({ "category.parentCategory": category._id });
  const pagination = paginateResult(count, skip, limit);

  return res.status(200).json({ success: true, pagination, products });
});

/*
	Desc: Get featured products
	route: GET /api/v1/products/featured
	access: Public
*/
exports.featuredProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find({ featured: true }).select("id name price photos");
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
  if (!product) {
    let errMsg = "Invalid resource ID provided";
    return next(new ErrorResponse(errMsg, 404));
  };

  const user = await User.findOneAndUpdate({ _id: req.currentuser.id }, { $addToSet: { wishlist: id } }, { new: true }).populate("wishlist");

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

  const user = await User.findOneAndUpdate({ _id: req.currentuser.id }, { $pull: { wishlist: id } }, { new: true }).populate("wishlist");

  const wishlist = user.wishlist;
  return res.status(200).json({ success: true, wishlist });
});

/*
	Desc: Update a single product
	route: PUT /api/v1/products/:id
	access: Private
*/
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, price, description, brandName, quantity, featured, parentCategoryId, childCategoryId, photo, isActive } = req.body;

  let product = await Product.findById(id);
  if (!product) {
    let errMsg = "Invalid resource ID provided";
    return next(new ErrorResponse(errMsg, 404));
  };

  let productUpdate = {
    isActive,
    name: name ? name : product.name,
    featured: featured ? featured : product.featured,
    brandName: brandName ? brandName : product.brandName,
    description: description ? description : product.description,
    price: price ? parseFloat(price) : product.price,
    photos: [...product.photos],
    quantity: quantity ? parseInt(quantity) : product.quantity
  };

  productUpdate.slug = slugify(productUpdate.name, { lower: true, replacement: '_' });

  if (photo) {
    productUpdate.photos = [...productUpdate.photos, photo];
  };

  productUpdate.category = {
    parentCategory: parentCategoryId ? parentCategoryId : product.category.parentCategory,
    subCategory: childCategoryId ? childCategoryId : product.category.subCategory
  };

  await Product.findOneAndUpdate({ _id: id }, { $set: productUpdate }, { new: true });
  return res.status(200).json({ success: true, product: productUpdate });
});

/*
	Desc: Toggle product status (change status to inActive)
	route: PUT /api/v1/products/:id/toggle_product_status
	access: Private
*/
exports.toggleProductStatus = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  let product = await Product.findById(id);
  if (!product) {
    let errMsg = "Invalid resource ID provided";
    return next(new ErrorResponse(errMsg, 404));
  };

  await Product.findOneAndUpdate({ _id: id }, { $set: { isActive: !product.isActive } }, { new: true });
  return res.status(200).json({ success: true });
});

/*
	Desc: Delete single product
	route: DELETE /api/v1/products/:id
	access: Private
*/
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    let errMsg = "Resource not found with ID provided";
    return next(new ErrorResponse(errMsg, 400));
  };

  return res.status(200).json({ success: true });
});

/*
	Desc: Delete single product
	route: GET /api/v1/products/search
	access: Public
*/
exports.searchProducts = asyncHandler(async (req, res, next) => {
  let skip;
  let { orderBy, sortBy, limit, searchQuery, page } = req.query;

  // pagination
  page = parseInt(page, 10) || 1;
  limit = parseInt(limit, 10) || 15;
  skip = (page - 1) * limit;

  //full text search
  //const products = await Product.find({ $text: { $search: searchQuery } }, { searchGrade: { $meta: 'textScore' } }).select("name price brandName category photos").skip(skip).limit(limit).sort({ searchGrade: { $meta: 'textScore' } });

  //partial text search
  const products = await Product.find({ $or: [{ name: { $regex: searchQuery, "$options": 'i' } }, { brandName: { $regex: searchQuery, "$options": 'i' } } ]}).select("name price brandName category photos").skip(skip).limit(limit);

  if (!products) {
    let errMsg = "Resource not found with ID provided";
    return next(new ErrorResponse(errMsg, 400));
  };

  const count = products.length;
  const pagination = paginateResult(count, skip, limit);

  return res.status(200).json({ success: true, products, pagination });
});