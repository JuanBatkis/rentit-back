const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Please add your email'],
    unique: true
  },
  firstName: {
    type: String,
    required: [true, 'Please add your name']
  },
  lastName: {
    type: String,
    required: [true, 'Please add your last name']
  },
  storeName: String,
  phone:{
    type: String,
    required: [true, 'Please add your phone']
  },
  password: {
    type: String,
    required: [true, 'Please add your password'],
  },
  rating: {
    type: Number,
    default: 2.5
  },
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
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
