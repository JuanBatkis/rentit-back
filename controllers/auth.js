
const User = require("../models/User")
const passport = require("passport")
const {clearRes, getMissingMessage} = require('../utils/auth')
const {sendEmail} = require('../utils/emailTemplate')
const { catchErrors } = require("../middlewares")
const nodemailer = require("nodemailer")
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt")
const bcryptSalt = 10

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS
  }
})

exports.loginProcess = (req, res, next) => {
  const { email, password } = req.body

  let missingFields = []
  email === "" || email === undefined && missingFields.push('email')
  password === "" || password === undefined && missingFields.push('password')

  const missingMessage = getMissingMessage(missingFields)
  if (missingMessage) {
    return res.status(400).json({ message: missingMessage })
  }

  passport.authenticate("local", (error, user, errDetails) => {
    if (error) return res.status(500).json({ message: errDetails })
    if (!user) return res.status(401).json({ message: "Incorrect email or password" })

    if (user.verified) {
      req.login(user, error => {
        if (error) return res.status(500).json({ message: errDetails })
        const cleanUser = clearRes(user)
        res.status(200).json(cleanUser)
      })
    } else {
      res.status(403).json({message: `Please verify your email address before logging in`})
    }

  })(req, res, next)
}

exports.signupProcess = (req, res, next) => {
  const { email, password, confirmPassword, firstName, lastName, storeName, phone } = req.body

  let missingFields = []
  email === "" || email === undefined && missingFields.push('email')
  password === "" || password === undefined && missingFields.push('password')
  confirmPassword === "" || confirmPassword === undefined && missingFields.push('confirm password')
  firstName === "" || firstName === undefined && missingFields.push('first name')
  lastName === "" || lastName === undefined && missingFields.push('last name')
  phone === "" || phone === undefined && missingFields.push('phone number')

  const missingMessage = getMissingMessage(missingFields)
  if (missingMessage) {
    return res.status(400).json({ message: missingMessage })
  }


  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Your password and confirmation do not match' })
  }

  User.findOne({ email }, "email", (err, user) => {
    if (user !== null) {
      res.status(400).json({ message: "The email already exists" })
      return
    }

    const salt = bcrypt.genSaltSync(bcryptSalt)
    const hashPass = bcrypt.hashSync(password, salt)

    const newUser = new User({
      email,
      firstName,
      lastName,
      storeName,
      phone,
      password: hashPass
    })

    newUser
      .save()
      .then((newUser) => {
        console.log('user');
        const user = clearRes(newUser)
        catchErrors(sendEmail(email, firstName, user._id, transporter))
        res.status(200).json(user)
      })
      .catch(err => {
        res.status(500).json({ message: err })
      })
  })
}

exports.verifyProcess = async (req, res, next) => {
  const { id } = req.body

  const user = await User.findByIdAndUpdate(
    id,
    { $set: { verified: true } },
    { new: true }
  )

  const cleanUser = clearRes(user)
  res.status(200).json(cleanUser)
}

exports.logoutProcess = (req, res) => {
  req.logout()
  res.json({ message: "loggedout" })
}

exports.checkSession = (req, res) => {
  if (req.user) {
    const user = clearRes(req.user)
    return res.status(200).json(user)
  }
  res.status(200).json(null)
}

exports.changeAvatar = async (req, res) => {
  const { avatar } = req.body

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { avatar } },
    { new: true }
  )

  const {
    _doc: { password, ...rest }
  } = user

  res.status(200).json(rest)
}

exports.changeLocation = async (req, res) => {
  const { lng, lat } = req.body

  const location= {
    type: 'Point',
    coordinates: [lng, lat]
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { location } },
    { new: true }
  )

  const {
    _doc: { password, ...rest }
  } = user

  res.status(200).json(rest)
}

exports.googleInit = passport.authenticate('google', {
  scope: [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email"
  ]
})

exports.googleCallback = (req, res, next) => {
  passport.authenticate(
    'google',
    { scope: ['profile', 'email'] },
    (err, user, errDetails) => {
      if (err) return res.status(500).json({message: errDetails})
      if (!user) return res.status(500).json({message: errDetails})

      req.login(user, err => {
        if (err) return res.status(500).json({message: errDetails})
        res.redirect(process.env.ENV === 'development' ? 'http://localhost:3000' : 'https://rentit-project.herokuapp.com')
      })
    }
  )(req, res, next)
}

exports.facebookInit = passport.authenticate('facebook', {
  scope: [
    "email"
  ]
})

exports.facebookCallback = (req, res, next) => {
  passport.authenticate(
    'facebook',
    { scope: ['email'] },
    (err, user, errDetails) => {
      if (err) return res.status(500).json({message: errDetails})
      if (!user) return res.status(500).json({message: errDetails})

      req.login(user, err => {
        if (err) return res.status(500).json({message: errDetails})
        res.redirect(process.env.ENV === 'development' ? 'http://localhost:3000' : 'https://rentit-project.herokuapp.com')
      })
    }
  )(req, res, next)
}