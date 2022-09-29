module.exports = {
  userAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    } else {
      res.redirect('/login')
    }
  }
}