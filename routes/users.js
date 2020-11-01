const express = require("express")
const { check, validationResult } = require("express-validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const config = require("config")
const auth = require("../middleware/auth")

const router = express.Router()

const User = require("../models/User")

//  @route  GET api/auth
//  @desc    Get All Users - ### Admin only ###
//  @access Private
router.get("/all", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password")
    if (user.level == "efiewura") {
      const allUsers = await User.find().select("-password").sort({ date: -1 })
      res.json(allUsers)
    } else
      res.status(403).json({
        msg: `Access Denied - Your Ip has been logged we are tracking your ${req.headers["user-agent"]}`,
      })
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

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
      // REMOVE LEVEL BEFORE PRODUCTION
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

//  @route  PUT api/users/:id
//  @desc   UPDATE User Profile
//  @access PRIVATE
router.put("/:id", auth, async (req, res) => {
  const {
    firstName,
    surname,
    email,
    occupation,
    address,
    phone,
    password,
  } = req.body

  // BUILD ACCOUNT OBJECT

  const userField = {}
  if (firstName) userField.firstName = firstName
  if (surname) userField.surname = surname
  if (email) userField.email = email
  if (occupation) userField.occupation = occupation
  if (address) userField.address = address
  if (phone) userField.phone = phone
  if (password) userField.password = password

  try {
    let currentUser = await User.findById(req.params.id)

    if (currentUser._id.toString() !== req.params.id)
      return res.status(404).json({
        msg: `Access Denied - Your Ip has been logged we are tracking your ${req.headers["user-agent"]}`,
      })

    currentUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: userField },
      { new: true }
    )

    res.json(currentUser)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

//  @route  Delete api/users/:id
//  @desc   Delete User Profile
//  @access PRIVATE
router.delete("/:id", auth, async (req, res) => {
  try {
    let currentUser = await User.findById(req.params.id)

    if (!currentUser)
      return res.status(404).json({ msg: "User does not exist" })

    // MAKING SURE ONLY ADMIN AND USER HIMSELD CAN DELETE ACCOUNTS
    if (
      authorisedUser.level !== "efiewura" ||
      currentUser._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        msg: `Access Denied - Your Ip has been logged we are tracking your ${req.headers["user-agent"]}`,
      })
    }

    await User.findByIdAndRemove(req.params.id)
    res.json({ msg: "Account successfully removed" })
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

module.exports = router
