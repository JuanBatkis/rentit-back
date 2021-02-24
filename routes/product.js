
const express = require("express")
const router = express.Router()
const {
  getAllProducts,
  getProductsByCategory,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require("../controllers/product")

const { isAuth, catchErrors } = require("../middlewares")

router.get("/all", catchErrors(getAllProducts))

router.get("/category/:category", catchErrors(getProductsByCategory))

router.get("/:productId", catchErrors(getProductById))

router.post("/", isAuth, catchErrors(createProduct))

router.patch("/:productId", isAuth, catchErrors(updateProduct))

router.delete("/:productId", isAuth, catchErrors(deleteProduct))


module.exports = router