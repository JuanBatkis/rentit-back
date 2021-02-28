
const express = require("express")
const router = express.Router()
const {
  loginProcess,
  signupProcess,
  verifyProcess,
  logoutProcess,
  checkSession,
  changeAvatar,
  googleInit,
  googleCallback
} = require("../controllers/auth")

const { isAuth, catchErrors } = require("../middlewares")

router.post("/login", loginProcess)

router.post("/signup", signupProcess)

router.patch("/verify/:id", catchErrors(verifyProcess))

router.get("/logout", logoutProcess)

router.get("/session", checkSession)

router.post("/avatar/change", isAuth, catchErrors(changeAvatar))

router.get("/google", googleInit)

router.get("/google/callback", googleCallback)

module.exports = router