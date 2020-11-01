const express = require("express")

const { check, validationResult } = require("express-validator")
const auth = require("../middleware/auth")

const User = require("../models/User")
const Account = require("../models/Account")

const router = express.Router()

//##### GET ALL ACCOUNTS - ADMIN ONLY ###################################

//  @route  GET api/auth
//  @desc    Get All Users - ### Admin only ###
//  @access Private
router.get("/all", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password")
    if (user.level == "efiewura") {
      const allAccounts = await Account.find().sort({ firstName: -1 })
      res.json(allAccounts)
    } else
      res.status(403).json({
        msg: `Access Denied - Your Ip has been logged we are tracking your ${req.headers["user-agent"]}`,
      })
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

//  @route  GET api/accounts
//  @desc    Get User account of user
//  @access   PRIVATE
router.get("/", auth, async (req, res) => {
  try {
    const account = await Account.find({ user: req.user.id }).sort({
      date: -1,
    })
    res.json(account)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

//  @route  POST api/accouts
//  @desc    Add new accounts
//  @access PRIVATE
router.post(
  "/",
  [auth, [check("balance", "You must select a user").isNumeric()]],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() })
    }

    const { user, accountNumber, balance, active } = req.body

    try {
      let userExists = await User.findOne({ user })

      let accountExist = await Account.findOne({ user: req.user.id })

      if (userExists === null) {
        console.log(userExists)

        return res.status(400).json({
          msg: `User Does not exist - - Your Ip has been logged we are tracking your ${req.headers["user-agent"]}`,
        })
      } else if (accountExist) {
        return res.status(400).json({ msg: "User Already has an account" })
      }

      const newAccount = new Account({
        user: req.user.id,
        accountNumber,
        balance,
        active,
      })
      const account = await newAccount.save()

      res.json(account)
    } catch (err) {
      console.error(err.message)
      res.status(500).send("Server Error")
    }
  }
)

//  @route  PUT api/accounts/:id
//  @desc   UPDATE accounts
//  @access PRIVATE
router.put("/:id", auth, async (req, res) => {
  const { balance, active } = req.body

  // BUILD ACCOUNT OBJECT

  const accountFields = {}
  if (balance) accountFields.balance = balance
  if (active) accountFields.active = active

  try {
    let userAccount = await Account.findById(req.params.id)

    if (!userAccount)
      return res.status(404).json({ msg: "Account does not exist" })

    let authorisedUser = await User.findById(req.user.id)

    // MAKING SURE ONLY ADMIN OR TELLER CAN UPDATE ACCOUNTS INFO
    if (
      authorisedUser.level !== "efiewura" &&
      authorisedUser.level !== "teller"
    ) {
      return res.status(403).json({
        msg: `Access Denied - Your Ip has been logged we are tracking your ${req.headers["user-agent"]}`,
      })
    }

    userAccount = await Account.findByIdAndUpdate(
      req.params.id,
      { $set: accountFields },
      { new: true }
    )

    res.json(userAccount)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

//  @route  DELETE api/accounts/:id
//  @desc   DELETE accounts
//  @access PRIVATE
router.delete("/:id", auth, async (req, res) => {
  try {
    let userAccount = await Account.findById(req.params.id)

    if (!userAccount)
      return res.status(404).json({ msg: "Account does not exist" })

    let authorisedUser = await User.findById(req.user.id)

    // MAKING SURE ONLY ADMIN CAN DELETE ACCOUNTS
    if (authorisedUser.level !== "efiewura") {
      return res.status(403).json({
        msg: `Access Denied - Your Ip has been logged we are tracking your ${req.headers["user-agent"]}`,
      })
    }

    await Account.findByIdAndRemove(req.params.id)
    res.json({ msg: "Account successfully removed" })
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

module.exports = router
