const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const productSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  name: {
    type: String,
    required: [true, 'Please add a name for your product']
  },
  category: {
    type: String,
    enum: ['tools', 'technology', 'vehicles', 'sports', 'other'],
    required: [true, 'Please add a category for your product']
  },
  images: {
    type: [String],
    required: [true, 'Please add at least one image']
  },
  priceHour: {
    type: Number,
    required: [true, 'Please add a price per hour']
  },
  priceDay: Number,
  description: {
    type: String,
  },
  nextAvailable: Date,
  rating: {
    type: {
      total: Number,
      one: Number,
      two: Number,
      three: Number,
      four: Number,
      five: Number
    },
    default: {
      total: 0,
      one: 0,
      two: 0,
      three: 0,
      four: 0,
      five: 0
    }
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review"
    }
  ],
  questions: [
    {
      type: Schema.Types.ObjectId,
      ref: "Question"
    }
  ]
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
