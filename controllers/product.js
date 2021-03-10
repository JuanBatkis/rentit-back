const Product = require("../models/Product")
const User = require("../models/User")

exports.getAllProducts = async (req, res) => {
  const { limit } = req.params
  const products = await Product.find().sort({createdAt: -1}).limit(parseInt(limit)).populate("owner","location")
  res.status(200).json({ products })
}

exports.getProductsByQuery = async (req, res) => {
  const { limit, category, center, radius } = req.body

  const ownersInRadious = await User.find({
    location: { $geoWithin: { $centerSphere: [ center, radius/6371 ] } }
  }, '_id')
  const onlyIds = ownersInRadious.map(owner => owner._id)

  /* const products = await Product.find({
    location: { $geoWithin: { $centerSphere: [ center, radius/6371 ] } }
  }).sort({createdAt: -1}).populate("owner","location") */
  /* const products = await Product.find().sort({createdAt: -1}).populate({
    path: 'owner',
    select: 'location',
    match: {
      location: { $geoWithin: { $centerSphere: [ center, radius/63710 ] } }
    }
  }) */
  //const products = await Product.find({ category }).populate("owner","location")
  /* const products = await Product.aggregate([
    { "$lookup": {
      "from": 'User',
      "let": { "tags": "$tags" },
      "pipeline": [
        { "$match": {
          "tags": { "$in": [ "politics", "funny" ] },
          "$expr": { "$in": [ "$_id", "$$tags" ] }
        }}
      ]
    }}
  ]).sort({createdAt: -1}).populate("owner","location") */
  const products = await Product.find({
    owner: { $in: onlyIds }
  }).sort({createdAt: -1})
  res.status(200).json({ products })
}

exports.getProductById = async (req, res) => {
  const { productId } = req.params

  const product = await Product.findById(productId)
    .populate("owner","email firstName lastName storeName phone rating")
    .populate("questions","description answer")
  res.status(200).json(product)
}

exports.getUserProducts = async (req, res) => {
  const { userId, limit } = req.params

  const products = await Product.find({'owner': userId}).sort({createdAt: -1}).limit(parseInt(limit))
  res.status(200).json({ products })
}

exports.createProduct = async (req, res) => {
  const { name, category, description, images, priceHour, priceDay } = req.body

  if (!['tools', 'technology', 'vehicles', 'sports', 'other'].includes(category)) {
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