
const express = require("express")
const router = express.Router()
const {
  getAllProducts,
  getProductsByQuery,
  getProductById,
  getUserProducts,
  createProduct,
  updateProduct,
  deleteProduct
} = require("../controllers/product")

const { isAuth, catchErrors } = require("../middlewares")

router.get("/all/:limit", catchErrors(getAllProducts))

router.post("/query", catchErrors(getProductsByQuery))

router.get("/:productId", catchErrors(getProductById))

router.get("/user/:userId/:limit", isAuth, catchErrors(getUserProducts))

router.post("/", isAuth, catchErrors(createProduct))

router.patch("/:productId", isAuth, catchErrors(updateProduct))

router.delete("/:productId", isAuth, catchErrors(deleteProduct))


module.exports = router