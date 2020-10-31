const express = require("express")

const { check, validationResult } = require("express-validator")
const auth = require("../middleware/auth")

const User = require("../models/User")
const Account = require("../models/Account")

const router = express.Router()

// API/ACCOUNTS ALREADY ADDED IN SERVER.JS

//  @route  GET api/accounts
//  @desc    Get all accounts of user
//  @access   PRIVATE
router.get("/", auth, async (req, res) => {
  try {
<<<<<<< HEAD
    const accounts = await Account.findById({ user: req.user.id }).sort({
      date: -1,
    })
    res.json(accounts)
=======
    const account = await Account.find({ user: req.user.id }).sort({
      date: -1,
    })
    res.json(account)
>>>>>>> update
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

    const { user, accountNumber, balance } = req.body

    try {
      let userExists = await User.findOne({ user })

      let accountExist = await Account.findOne({ user: req.user.id })

      if (userExists === null) {
        console.log(userExists)

        return res
          .status(400)
          .json({ msg: "User Does not exist - Contact Administrator" })
      } else if (accountExist) {
        return res.status(400).json({ msg: "User Already has an account" })
      }

      const newAccount = new Account({
        user: req.user.id,
        accountNumber,
        balance,
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
router.put("/:id", (req, res) => {
  res.send("Update accounts")
})

//  @route  DELETE api/accounts/:id
//  @desc   DELETE accounts
//  @access PRIVATE
router.delete("/:id", (req, res) => {
  res.send("Delete accounts")
})

module.exports = router
