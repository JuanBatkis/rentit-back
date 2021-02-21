const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const rentSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product"
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  renter: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  total: Number,
  rentedFrom: Date,
  rentedTo: Date,
  extendedTo: Date
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Rent = mongoose.model('Rent', rentSchema);
module.exports = Rent;
