const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    unique: true
  },
  firstName: String,
  lastName: String,
  storeName: String,
  phone: String,
  password: String,
  avatar: String,
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product"
    }
  ],
  renting: [
    {
      type: Schema.Types.ObjectId,
      ref: "Rent"
    }
  ],
  rented: [
    {
      type: Schema.Types.ObjectId,
      ref: "Rent"
    }
  ],
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
  ],
  role: {
    type: String,
    default: 'USER',
    enum: ['ADMIN', 'USER'],
  },
  verified: {
    type: Boolean,
    default: false,
  },
  googleID: String,
  facebookID: String
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
