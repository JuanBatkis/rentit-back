const Product = require("../models/Product")
const User = require("../models/User")

exports.getAllProducts = async (req, res) => {
  const products = await Product.find()
  res.status(200).json({ products })
}

exports.getProductsByCategory = async (req, res) => {
  const { category } = req.params

  const products = await Product.find({ category })
  res.status(200).json({ products })
}

exports.getProductById = async (req, res) => {
  const { productId } = req.params

  const product = await Product.findById(productId)
    .populate("owner","email firstName lastName storeName phone rating")
    .populate("questions","description answer")
  res.status(200).json(product)
}

exports.createProduct = async (req, res) => {
  const { name, category, description, images, priceHour, priceDay } = req.body

  if (!['Tools', 'Technology', 'Vehicles', 'Sports', 'Other'].includes(category)) {
    return res.status(400).json({ message: "Please select one of the allowed categories" })
  }

  const product = await Product.create({
    name,
    category,
    description,
    images,
    priceHour,
    priceDay,
    owner: req.user._id
  })
  await User.findByIdAndUpdate(req.user._id, {
    $push: { products: product._id }
  })

  res.status(201).json(product)
}

exports.updateProduct = async (req, res) => {
  const { productId } = req.params
  const { name, description, images, priceHour, priceDay } = req.body

  const product = await Product.findById(productId)

  if (product.owner.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  const productNew = await Product.findByIdAndUpdate(
    productId,
    { name, description, images, priceHour, priceDay },
    { new: true }
  )

  res.status(200).json(productNew)
}

exports.deleteProduct = async (req, res) => {
  const { productId } = req.params

  await Product.findByIdAndRemove(productId)

  res.status(200).json({
    message: "deleted"
  })
}