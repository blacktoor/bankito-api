const express = require("express")
const { check, validationResult } = require("express-validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const config = require("config")

const router = express.Router()

const User = require("../models/User")

//  @route  POST api/users
//  @desc    Register a user
//  @access PUBLIC
router.post(
  "/",
  [
    check("firstName", "Firstname is required").isAlpha().not().isEmpty(),
    check("surname", "Surname is required").isAlpha().not().isEmpty(),
    check("address", "Address is required").not().isEmpty(),
    check("occupation", "Occupation is required").not().isEmpty(),
    check("email", "Provide a valide Email").isEmail(),
    check("phone", "Provide a valid Phone Number")
      .isMobilePhone()
      .isLength({ min: 10, max: 10 }),
    check("password", "Enter a passwrod with 6 or more characters").isLength({
      min: 6,
      max: 25,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() })
    }
    const {
      firstName,
      surname,
      address,
      occupation,
      email,
      phone,
      password,
      level,
    } = req.body

    try {
      let user = await User.findOne({ email })
      let userPhone = await User.findOne({ phone })

      if (user) {
        return res
          .status(400)
          .json({ msg: "Email already associated with an account" })
      } else if (userPhone) {
        return res
          .status(400)
          .json({ msg: "Phone number already assiciated with an account" })
      }

      user = new User({
        firstName,
        surname,
        address,
        email,
        phone,
        occupation,
        password,
        level,
      })

      const salt = await bcrypt.genSalt()

      user.password = await bcrypt.hash(password, salt)

      await user.save()

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
