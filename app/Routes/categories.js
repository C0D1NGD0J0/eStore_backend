const router = require("express").Router();
const { execValidations } = require("../Utils/validations");
const { 
  getCategories, 
  createCategory, 
  getSubCategories, 
  createSubCategory, 
  deleteCategory, updateCategory } = "../Controllers/category";

router.route("/")
  .get(getCategories)
  .post(createCategory);

router.route("/:id/sub_categories")
  .get(getSubCategories)
  .post(createSubCategory);

router.route("/:id")
  .put(updateCategory)
  .delete(deleteCategory);


module.exports = router;