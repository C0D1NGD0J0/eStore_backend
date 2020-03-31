const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  title: {
    type: String,
    trim: true,
    maxlength: 100,
    required: [true, 'Title is required']
  },
  body: {
    type: String,
    trim: true,
    maxlength: 200,
    required: [true, 'Product review text is required']
  },
  product: {
    type: Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    type: Number,
    min: [1, 'Rating must have a value greater than 0'], 
    max: [5, "Rating can't be greater than 5"],
    reqired: [true, 'Please provide a product rating.']
  }
}, { timestamps: true });

//prevents user from submitting more than 1 review per-product
ReviewSchema.index({product: 1, author: 1}, {unique: true});

//calculate product avgRatings
ReviewSchema.statics.calculateAvgRating = async function(productid){
  const avgCalculation = await this.aggregate([
    {
      $match: { product: productid }
    },
    {
      $group: {
        _id: '$product',
        avgRating: { $avg: '$rating'}
      }
    }
  ]);

  try {
    await this.model('Product').findByIdAndUpdate(productid, { avgRatings: avgCalculation[0].avgRating }, {new: true});
  } catch (error) {
    console.log(error);
  };
};

ReviewSchema.post("save", function () {
  this.constructor.calculateAvgRating(this.product);
});

ReviewSchema.pre("remove", function () {
  this.constructor.calculateAvgRating(this.product);
});

module.exports = mongoose.model('Review', ReviewSchema);