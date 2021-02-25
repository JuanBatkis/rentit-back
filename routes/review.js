
const express = require("express")
const router = express.Router()
const {
  createReview,
  deleteReview
} = require("../controllers/review")

const { isAuth, catchErrors } = require("../middlewares")

router.post("/", isAuth, catchErrors(createReview))

router.delete("/:reviewId", isAuth, catchErrors(deleteReview))


module.exports = router