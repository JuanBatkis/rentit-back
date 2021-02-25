const Review = require("../models/Review")
const Product = require("../models/Product")
const User = require("../models/User")

exports.createReview = async (req, res) => {
  const { userId, productId, rating, description } = req.body

  if (typeof userId !== "undefined") {
    const review = await Review.create({
      owner: req.user._id,
      user: userId,
      rating,
      description,
    })

    const user = await User.findById(userId)

    let {five, four, three, two, one} = user.rating

    switch (rating) {
      case 5:
        five++
        break;
      case 4:
        four++
        break;
      case 3:
        three++
        break;
      case 2:
        two++
        break;
      case 1:
        one++
        break;
    }

    const userRating = ( 5 * five + 4 * four + 3 * three + 2 * two + one) / (five + four + three + two + one)

    await User.findByIdAndUpdate(userId, {
      rating: {
          total: userRating,
          one,
          two,
          three,
          four,
          five
      },
      $push: { reviews: review._id }
    })

    res.status(201).json(review)

  } else if (typeof productId !== "undefined") {
    const review = await Review.create({
      owner: req.user._id,
      product: productId,
      rating,
      description,
    })

    const product = await Product.findById(productId)

    let {five, four, three, two, one} = product.rating

    switch (rating) {
      case 5:
        five++
        break;
      case 4:
        four++
        break;
      case 3:
        three++
        break;
      case 2:
        two++
        break;
      case 1:
        one++
        break;
    }

    const productRating = ( 5 * five + 4 * four + 3 * three + 2 * two + one) / (five + four + three + two + one)

    await Product.findByIdAndUpdate(productId, {
      rating: {
          total: productRating,
          one,
          two,
          three,
          four,
          five
      },
      $push: { reviews: review._id }
    })

    res.status(201).json(review)
  }
}

exports.deleteReview = async (req, res) => {
  const { reviewId } = req.params

  await Review.findByIdAndRemove(reviewId)

  res.status(200).json({
    message: "deleted"
  })
}