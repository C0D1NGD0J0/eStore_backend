const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');

const ProductSchema = new Schema({
  name: {
    trim: true,
    type: String,
    maxlength: 70,
    unique: true,
    index: true,
    lowercase: true,
    required: [true, 'Product Name is required!']
  },
  description: {
    trim: true,
    type: String,
    required: true,
    maxlength: 2000
  },
  price: {
    default: 0,
    type: Number,
    required: true
  },
  slug: String,
  soldCount: { default: 0, type: Number, select: false },
  quantity: { type: Number, default: 0, required: true, select: false },
  featured: { type: Boolean, default: false },
  photos: [{ filename: String, url: String }],
  author: { type: Schema.Types.ObjectId, ref: 'User', select: false },
  isActive: { type: Boolean, default: false, select: false },
  category: { 
    parentCategory: {type: Schema.Types.ObjectId, ref: 'Category'},
    subCategory: { type: Schema.Types.ObjectId, ref: 'Category' },
  },
  brandName: { type: String, trim: true, minlength: 2, maxlength: 25, lowercase: true, required: true },
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
  avgRatings: { type: Number, min: [1, 'Rating must be at least 1'], max: [5, "Rating cannot be greater than 5"], default: 0 }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

ProductSchema.plugin(uniqueValidator);
ProductSchema.plugin(mongooseLeanVirtuals);

ProductSchema.virtual('inStock').get(function () {
  return this.quantity - this.soldCount;
});

module.exports = mongoose.model('Product', ProductSchema);