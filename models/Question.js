const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const questionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product"
  },
  description: String,
  status: {
    type: String,
    default: 'not-answered',
    enum: ['not-answered', 'answered'],
  },
  answer: String
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
});

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;
