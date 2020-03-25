const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const CartItemSchema = new Schema({
  product: { type: ObjectId, ref: "Product" },
  price: Number,
  quantity: Number
}, { timestamps: true });

const OrderSchema = new Schema({
  products: { type: [CartItemSchema]},
  transactionId: {},
  totalAmount: { type: Number },
  shippingAddress: String,
  status: {
    type: String,
    default: "processing",
    enum: ["processing", "processed", "shipped", "cancelled"]
  },
  owner: { type: ObjectId, ref: "User" }
}, { timestamps: true });

const CartItem = mongoose.model("CartItem", CartItemSchema);
const Order = mongoose.model("Order", OrderSchema);

module.exports = { Order, CartItem };