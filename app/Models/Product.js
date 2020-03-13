const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: {
    trim: true,
    type: String,
    maxlength: 40,
    unique: true,
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
  soldCount: { default: 0, type: Number },
  quantity: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  photos: [{ filename: String, url: String }],
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  brandName: { type: String, trim: true, minlength: 3, maxlength: 25, lowercase: true },
  avgRatings: { type: Number, min: [1, 'Product rating must be at least 1'], max: [5, "Rating cann't be greater than 5"]}
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);