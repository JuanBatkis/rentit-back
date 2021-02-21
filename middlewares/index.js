exports.catchErrors = controller => (req, res, next) =>
  controller(req, res).catch(next)

exports.isAuth = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" })
  }
  next()
}