const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const uniqueValidator = require('mongoose-unique-validator');

const UserSchema = new Schema({
  firstName: {
    type: String,
    unique: true,
    trim: true,
    maxlength: 25,
    minlength: 2,
    required: [true, 'Please provide a first name']
  },
  lastName: {
    trim: true,
    minlength: 2,
    type: String,
    unique: true,
    maxlength: 25,
    required: [true, 'Please provide a last name']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email address.'],
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
  },
  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer'
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  isActive: { type: Boolean, default: false },
  purchaseHistory: { type: Array, default: [] },
  activationToken: { type: String, default: "" },
  passwordResetToken: { type: String, default: "" },
  passwordResetExpires: { type: Date, default: "" },
  activationTokenExpires: { type: Date, default: "" },
  wishlist: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
}, { timestamps: true });

UserSchema.pre('save', async function(next){
  if (!this.isModified('password')) {
    next();
  };

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.validatePassword = async function(pwd){
  return await bcrypt.compare(pwd, this.password);
};

UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", UserSchema);