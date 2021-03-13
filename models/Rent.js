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
  type: {
    type: String,
    enum: ['hour', 'day'],
  },
  extendedTo: Date,
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'in-progress', 'finished', 'cancelled'],
  },
  preferenceId: String
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
});

const Rent = mongoose.model('Rent', rentSchema);
module.exports = Rent;
