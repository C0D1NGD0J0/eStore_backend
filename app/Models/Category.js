const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slugify = require("slugify");
const uniqueValidator = require('mongoose-unique-validator');

const SubCategorySchema = new Schema({
  name: {
    trim: true,
    type: String,
    minlength: 3,
    maxlength: 50,
    unique: true,
    required: [true, "Topic name is required"]
  },
  slug: String
});

const CategorySchema = new Schema({
  name: {
    type: String,
    trim: true,
    unique: true,
    minlength: 3,
    maxlength: 50,
    required: [true, "Category Name is required"]
  },
  slug: String,
  subcategories: [SubCategorySchema]
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

CategorySchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true, replacement: '_' });
  next();
});

CategorySchema.statics.getSubCategorysList = function () {
  return this.aggregate([
    { $unwind: "$subcategories" },
    { $group: { _id: "$subcategories._id", name: { $first: "$subcategories.slug" }, category: { $first: "$slug" } } }
  ]);
};

CategorySchema.plugin(uniqueValidator);

module.exports = mongoose.model("Category", CategorySchema);