const jwt = require("jsonwebtoken")
const config = require("config")

module.exports = function (req, res, next) {
  // GET TOKEN FROM HEADER
  const token = req.header("b-auth-token")

  // CHECK IF TOKEN EXISTS
  if (!token) {
    return res.status(401).json({ msg: "No token , Access Denied" })
  }

  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"))

    req.user = decoded.user
    next()
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid - Try Again" })
  }
}
