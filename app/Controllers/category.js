const Product = require("../Models/Product");
const ErrorResponse = require("../Utils/errorsResponse");
const { asyncHandler } = require("../Utils/middlewares");

exports.getCategories = asyncHandler(async (req, res, next) => {
  return res.status(200).json({ success: true });
});

exports.getSubCategories = asyncHandler(async (req, res, next) => {
  return res.status(200).json({ success: true });
});

exports.createCategory = asyncHandler(async (req, res, next) => {
  return res.status(200).json({ success: true });
});

exports.createSubCategory = asyncHandler(async (req, res, next) => {
  return res.status(200).json({ success: true });
});

exports.updateCategory = asyncHandler(async (req, res, next) => {
  return res.status(200).json({ success: true });
});

exports.deleteCategory = asyncHandler(async (req, res, next) => {
  return res.status(200).json({ success: true });
});