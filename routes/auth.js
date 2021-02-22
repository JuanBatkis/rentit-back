
const express = require("express")
const router = express.Router()
const {
  loginProcess,
  signupProcess,
  verifyProcess,
  logoutProcess,
  checkSession,
  changeAvatar
} = require("../controllers/auth")

const { isAuth } = require("../middlewares")

router.post("/login", loginProcess)

router.post("/signup", signupProcess)

router.patch("/verify/:id", verifyProcess)

router.get("/logout", logoutProcess)

router.get("/session", checkSession)

router.post("/avatar/change", isAuth, changeAvatar)

module.exports = router