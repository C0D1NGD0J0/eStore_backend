const router = require("express").Router();
const { execValidations } = require("../Utils/validations");
const { 
  getCategories, 
  createCategory, 
  getSubCategories, 
  createSubCategory, 
  deleteCategory, updateCategory } = require("../Controllers/category");

router.route("/")
  .get(getCategories)
  .post(createCategory);

router.route("/:id/sub_categories")
  .get(getSubCategories)
  .put(createSubCategory);

router.route("/:id")
  .put(updateCategory)
  .delete(deleteCategory);


module.exports = router;