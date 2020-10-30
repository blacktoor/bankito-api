const { check, validationResult } = require("express-validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const config = require("config")
const auth = require("../middleware/auth")
const User = require("../models/User")
const express = require("express")

const router = express.Router()

// API/AUTH ALREADY ADDED IN SERVER.JS

//  @route  GET api/auth
//  @desc    Get logged in user
//  @access Private
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password")
    res.json(user)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

//  @route  POST api/auth
//  @desc    Log in a user
//  @access Public
router.post(
  "/",
  [
    check("email", "Please provide a valid Email").isEmail(),
    check("password", "Please provide a valid Password").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() })
    }

    const { email, password } = req.body

    try {
      let user = await User.findOne({ email })
      if (!user) {
        return res.status(400).json({ msg: "Invalid Credentials" })
      }
      const isMath = await bcrypt.compare(password, user.password)

      if (!isMath) {
        return res.status(400).json({ msg: "Invalid Credentials" })
      }
      const payload = {
        user: {
          id: user.id,
        },
      }

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: 360000000,
        },
        (err, token) => {
          if (err) throw err
          res.json({ token })
        }
      )
    } catch (err) {
      console.error(err.message)
      res.status(500).send("Server Error")
    }
  }
)

module.exports = router
