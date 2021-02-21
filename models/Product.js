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
  rating: Number,
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
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
