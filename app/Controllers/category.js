const slugify = require("slugify");
const Category = require("../Models/Category");
const ErrorResponse = require("../Utils/errorsResponse");
const { asyncHandler } = require("../Utils/middlewares");

/*
	Desc: Get all parent categories 
	route: GET /api/v1/categories/
	access: Public
*/
exports.getCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find({}).select("name imgUrl");
  const count = await Category.countDocuments({});

  return res.status(200).json({ success: true, categories, count });
});

/*
	Desc: Get all subcategories of a parent category
	route: GET /api/v1/categories/:id/subcategories
	access: Public
*/
exports.getSubCategories = asyncHandler(async (req, res, next) => {
  const { id: parentId } = req.params;
  const parentCategory = await Category.findById(parentId);

  if (!parentCategory) {
    let errMsg = "Invalid resource ID provided";
    return next(new ErrorResponse(errMsg, 404));
  };

  const count = parentCategory.subcategories.length;
  const subCategories = parentCategory.subcategories;

  return res.status(200).json({ success: true, subCategories, count });
});

/*
	Desc: Create new product category
	route: POST /api/v1/categories/
	access: Private
*/
exports.createCategory = asyncHandler(async (req, res, next) => {
  const { name, imgUrl } = req.body;

  const category = await Category.create({ name, imgUrl });

  return res.status(200).json({ success: true, category });
});

/*
	Desc: Create subcategory 
	route: POST /api/v1/categories/:id/
	access: Private
*/
exports.createSubCategory = asyncHandler(async (req, res, next) => {
  const { name, imgUrl } = req.body;
  const { id } = req.params;

  let parentCategory = await Category.findById(id);

  if(!parentCategory){
    let errMsg = "Invalid resource ID provided";
    return next(new ErrorResponse(errMsg, 404));
  };

  const subCategory = { name, imgUrl };
  subCategory.slug = slugify(subCategory.name, {replacement: '_', lower: true});

  parentCategory.subcategories.push(subCategory);
  parentCategory = await parentCategory.save();
  
  const childCategory = {
    parent: parentCategory.name,
    parentId: parentCategory.id,
    childrenCategories: parentCategory.subcategories
  };

  return res.status(200).json({ success: true, subCategories: childCategory });
});

/*
	Desc: Update parent category
	route: PUT /api/v1/categories/:id
	access: Private
*/
exports.updateCategory = asyncHandler(async (req, res, next) => {
  return res.status(200).json({ success: true });
});

/*
	Desc: Delete a parent category 
	route: DELETE /api/v1/categories/:id
	access: Private
*/
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  return res.status(200).json({ success: true });
});