const router = require("express").Router({mergeParams: true});
const { isAuthorized } = require("../Utils/middlewares");
const { validateProduct, execValidations } = require("../Utils/validations");
const { getProductReviews, addProductReview } = require("../Controllers/review.js");

router.route("/")
  .get(isAuthorized, getProductReviews)
  .post(isAuthorized, addProductReview);

module.exports = router;