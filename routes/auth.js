
const express = require("express")
const router = express.Router()
const {
  loginProcess,
  signupProcess,
  verifyProcess,
  logoutProcess,
  checkSession,
  changeAvatar,
  changeLocation,
  googleInit,
  googleCallback,
  facebookInit,
  facebookCallback
} = require("../controllers/auth")

const { isAuth, catchErrors } = require("../middlewares")

router.post("/login", loginProcess)

router.post("/signup", signupProcess)

router.patch("/verify", catchErrors(verifyProcess))

router.get("/logout", logoutProcess)

router.get("/session", checkSession)

router.patch("/avatar/change", isAuth, catchErrors(changeAvatar))

router.patch("/location/change", isAuth, catchErrors(changeLocation))

router.get("/google", googleInit)

router.get("/google/callback", googleCallback)

router.get("/facebook", facebookInit)

router.get("/facebook/callback", facebookCallback)

module.exports = router