
const express = require("express")
const router = express.Router()
const {
  getAllUserRents,
  getRentById,
  getRentPreference,
  createRent,
  updateRent
} = require("../controllers/rent")

const { isAuth, catchErrors } = require("../middlewares")

router.get("/all/:role", isAuth, catchErrors(getAllUserRents))

router.get("/:rentId", isAuth, catchErrors(getRentById))

router.post("/preference", isAuth, catchErrors(getRentPreference))

router.post("/", isAuth, catchErrors(createRent))

router.patch("/update", isAuth, catchErrors(updateRent))

module.exports = router