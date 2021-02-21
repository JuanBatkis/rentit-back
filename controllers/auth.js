
const User = require("../models/User")
const passport = require("passport")
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt")
const bcryptSalt = 10

exports.clearRes = (data) => {
  //destructuramos el objeto "data" y retornamos un nuevo objeto unicamente con
  // los datos requerido para nuestro "desarrollador = dev"
  const {password,__v,createdAt,updatedAt, ...cleanedData} = data;
  // {key:"value"}
  return cleanedData
}

exports.loginProcess = (req, res, next) => {
  passport.authenticate("local", (error, user, errDetails) => {
    if (error) return res.status(500).json({ message: errDetails })
    if (!user) return res.status(401).json({ message: "Unauthorized" })

    req.login(user, error => {
      if (error) return res.status(500).json({ message: errDetails })
      const user = clearRes(user.toObject)
      res.status(200).json(user)
    })
  })(req, res, next)
}

exports.signupProcess = (req, res, next) => {
  const { email, password, username } = req.body

  if (email === "" || password === "" || username === "") {
    res.status(400).json({ message: "Indicate email, username, and password" })
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
      username,
      password: hashPass
    })

    newUser
      .save()
      .then((newUser) => {
        const user = clearRes(newUser.toObject)
        res.status(200).json(user)
      })
      .catch(err => {
        res.status(500).json({ message: "Something went wrong" })
      })
  })
}

exports.logoutProcess = (req, res) => {
  req.logout()
  res.json({ message: "loggedout" })
}

exports.checkSession = (req, res) => {
  if (req.user) {
    const user = clearRes(req.user.toObject)
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