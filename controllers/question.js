const Question = require("../models/Question")
const Product = require("../models/Product")
const User = require("../models/User")

exports.getAllProductQuestions = async (req, res) => {
  const { productId } = req.params

  const questions = await Question.find({'product': productId})
  res.status(200).json({ questions })
}

exports.getUserQuestions = async (req, res) => {
  const { userId, status } = req.params

  const questions = await Question.find({'user': userId, status})
  res.status(200).json({ questions })
}

exports.createQuestion = async (req, res) => {
  const { product, description } = req.body

  const question = await Question.create({
    user: req.user._id,
    product,
    description,
  })
  await User.findByIdAndUpdate(req.user._id, {
    $push: { questions: question._id }
  })
  await Product.findByIdAndUpdate(product, {
    $push: { questions: question._id }
  })

  res.status(201).json(question)
}

exports.respondQuestion = async (req, res) => {
  const { questionId } = req.params
  const { answer } = req.body

  const question = await Question.findById(questionId)
    .populate("product","owner")

  if (question.product.owner.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  if (typeof question.answer !== "undefined") {
    return res.status(401).json({ message: "Question already answered" })
  }

  const questionNew = await Question.findByIdAndUpdate(
    questionId,
    { answer },
    { new: true }
  )

  res.status(200).json(questionNew)
}

exports.deleteQuestion = async (req, res) => {
  const { questionId } = req.params

  await Question.findByIdAndRemove(questionId)

  res.status(200).json({
    message: "deleted"
  })
}