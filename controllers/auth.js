
const User = require("../models/User")
const passport = require("passport")
const {clearRes} = require('../utils/auth');
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt")
const bcryptSalt = 10

exports.loginProcess = (req, res, next) => {
  passport.authenticate("local", (error, user, errDetails) => {
    if (error) return res.status(500).json({ message: errDetails })
    if (!user) return res.status(401).json({ message: "Unauthorized" })

    if (user.verified) {
      req.login(user, error => {
        if (error) return res.status(500).json({ message: errDetails })
        const cleanUser = clearRes(user)
        res.status(200).json(cleanUser)
      })
    } else {
      res.status(403).json({msg: `Please verify your email address before logging in`})
    }

  })(req, res, next)
}

exports.signupProcess = (req, res, next) => {
  const { email, password, firstName, lastName, storeName, phone } = req.body

  let missingFields = []
  email === "" && missingFields.push('email')
  password === "" && missingFields.push('password')
  firstName === "" && missingFields.push('first name')
  lastName === "" && missingFields.push('last name')
  phone === "" && missingFields.push('phone number')

  if (missingFields.length === 1) {
    res.status(400).json({ message: `Please indicate your ${missingFields[0]}` })
    return
  } else if(missingFields.length > 1) {
    let fullError = missingFields[0]
    for (let i = 1; i < missingFields.length; i++) {
      i === (missingFields.length - 1) ? fullError += ` and ${missingFields[i]}` : fullError += `, ${missingFields[i]}`
    }
    res.status(400).json({ message: `Please indicate your ${fullError}` })
    return
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
        const user = clearRes(newUser)
        res.status(200).json(user)
      })
      .catch(err => {
        res.status(500).json({ message: err })
      })
  })
}

exports.verifyProcess = async (req, res, next) => {
  const { id } = req.params

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